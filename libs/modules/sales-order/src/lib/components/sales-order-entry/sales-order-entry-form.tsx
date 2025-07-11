import { Flex, ModuleBaseLayout, PopupMessageBox, SectionBaseLayout } from '@cookers/ui';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { configStore, setSalesOrderApiData, STORE, updateSalesOrderPermission, useStoreSelector } from '@cookers/store';
import { DevTool } from '@hookform/devtools';
import { ToastWrapper, useToast } from '@cookers/modules/shared';
import { SalesOrderEntryInterface, DefaultSalesOrderEntry } from '@cookers/models';
import { useSpinner } from '@cookers/providers';
import { useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { salesOrderEntrySchema } from '../../schema/form-schema';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useNavigationBlock } from '@cookers/modules/common';
import { SalesOrderDetailsBlock } from './sales-order-details-block';
import { SalesOrderEntryHeader } from './sales-order-entry-header';
import { SalesOrderEntryFooter } from './sales-order-entry-footer';
import { inMemoryfileStorage } from '@cookers/utils';
import { useSalesOrderFormQuery } from '../../queries/use-sales-order-entry-query';
import { useCustomerDetailsQuery } from '../../queries/use-customer-details-query';
import { useCancelPickListMutation } from '../../queries/use-cancel-picklist-query';
import { useCancelSalesOrderMutation } from '../../queries/use-cancel-sales-order-query';
import { useCustomerBasicQuery } from '../../queries/customer-lookup-query';
import { usePrintPickListMutation } from '../../queries/use-print-picklist-query';
import { handleOrderActions } from '../../handlers/order-action-handlers';

export const SalesOrderEntryForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const urlContractNo = searchParams.get('contractNo');
  const urlCustCode = searchParams.get('custCode');
  const urlCatlogCode = searchParams.get('catlogCode');

  const { salesOrderApiData, masterData, permission, customerDetails } = useStoreSelector(STORE.SalesOrder);
  const { customerBasicData } = useCustomerBasicQuery();

  // Get contractNo from both URL params and API response, URL takes priority
  // For new orders, only consider URL contractNo, not API data from Redux
  const apiContractNo = id ? salesOrderApiData?.orderDetails?.contractNo : undefined;
  const effectiveContractNo = urlContractNo || apiContractNo || '';
  const { setBlocked } = useNavigationBlock();
  const currentUser = getProxyUserFromLocalStorage() ?? getUserFromLocalStorage();
  const cancelPickListMutation = useCancelPickListMutation();
  const cancelSalesOrderMutation = useCancelSalesOrderMutation();
  const printPickListMutation = usePrintPickListMutation();

  // Fetch sales order data when ID is provided
  const { salesOrderData, rawApiData, isLoading: isLoadingSalesOrderData } = useSalesOrderFormQuery(id ? Number(id) : 0);

  const methods = useForm<SalesOrderEntryInterface>({
    defaultValues: {
      ...(id ? salesOrderApiData : DefaultSalesOrderEntry),
      orderDetails: {
        ...(id ? salesOrderApiData.orderDetails : DefaultSalesOrderEntry.orderDetails),
        contractNo: effectiveContractNo,
      },
    },
    resolver: zodResolver(salesOrderEntrySchema),
    mode: 'onSubmit',
    shouldFocusError: false,
  });

  // Get customer code from form to trigger customer details API (after methods is created)
  const customerCode = methods.watch('orderDetails.customerCode');
  const { data: customerDetailsApiData } = useCustomerDetailsQuery(customerCode?.value || null);
  const dispatch = useDispatch();
  const [isOpenCompletionPopup, setIsOpenCompletionPopup] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();
  const { open, setOpen, toastState, showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Set contractNo - this will be handled by the main form reset useEffect
  useEffect(() => {
    // Set contractNo - URL takes priority over API response, but treat "0" as empty
    if (effectiveContractNo && effectiveContractNo !== '0') {
      methods.setValue('orderDetails.contractNo', effectiveContractNo, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [id, methods, effectiveContractNo, urlContractNo, apiContractNo]);

  useEffect(() => {
    if (Object.keys(methods.formState.dirtyFields).length > 0) {
      setBlocked(true);
    } else {
      setBlocked(false);
    }
  }, [methods.formState]);

  useEffect(() => {
    // If sales order data fetched, dispatch it to the store
    if (salesOrderData && id) {
      dispatch(setSalesOrderApiData(salesOrderData));
    }
  }, [salesOrderData, id, dispatch]);

  useEffect(() => {
    if (!id) {
      // For new orders, use clean default data instead of stale Redux data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedDate = today.toLocaleDateString('en-CA');
      // Determine if this is a standing order based on contractNo in URL
      const isStandingOrder = effectiveContractNo && effectiveContractNo !== '0';
      const cleanDefaultData = {
        ...DefaultSalesOrderEntry,
        orderDetails: {
          ...DefaultSalesOrderEntry.orderDetails,
          status: isStandingOrder ? 'Standing Order' : 'New',
          orderType: isStandingOrder ? 'STAN' : 'ONOF',
          orderTypeVal: isStandingOrder ? 'Standing Order' : 'One-Off',
          dateOrdered: formattedDate,
          contractNo: effectiveContractNo && effectiveContractNo !== '0' ? effectiveContractNo : '',
        },
      };
      methods.reset(cleanDefaultData);
    } else {
      // For existing orders, use API data but preserve URL contractNo if present
      let formDataWithPreservedContractNo = {
        ...salesOrderApiData,
        orderDetails: {
          ...salesOrderApiData.orderDetails,
          // Preserve URL contractNo over API contractNo, but treat "0" as empty
          contractNo: effectiveContractNo && effectiveContractNo !== '0' ? effectiveContractNo : '',
        },
      };
      // If customer details are available, update depot information in product details
      if (customerDetailsApiData && salesOrderApiData.productDetails?.products) {
        const depotName = customerDetailsApiData.customerDetails?.depotName || '';
        const depotCode = customerDetailsApiData.customerDetails?.depotCode || depotName.split(' - ')[0] || '';
        formDataWithPreservedContractNo = {
          ...formDataWithPreservedContractNo,
          productDetails: {
            ...salesOrderApiData.productDetails,
            products: salesOrderApiData.productDetails.products.map((product: any) => ({
              ...product,
              depot: depotCode,
              depotName: depotName,
            })),
          },
        };
      }

      methods.reset(formDataWithPreservedContractNo);
    }
    const orderStatus = salesOrderApiData.orderDetails?.status?.toLowerCase();
    if (orderStatus && id) {
      if (masterData.permissionLevel.readOnly && (currentUser?.originator ?? currentUser?.userName) !== salesOrderApiData.orderDetails?.customerCode) {
        dispatch(updateSalesOrderPermission({ canEditDetailsBlock: false }));
      }
    } else if (!id) {
      // For new orders, ensure canEditDetailsBlock is true
      dispatch(updateSalesOrderPermission({ canEditDetailsBlock: true }));
    }
    // Set URL parameters after form reset (only for new orders)
    if (!id) {
      // Set customer from URL parameter using customerBasicData (orders-master API)
      if (urlCustCode && customerBasicData) {
        const customer = customerBasicData.find((c: any) => c.value === urlCustCode);
        if (customer) {
          methods.setValue(
            'orderDetails.customerCode',
            {
              label: customer.label,
              value: customer.value,
            },
            {
              shouldValidate: !!id, // Only validate for existing orders, not new ones
              shouldDirty: false,
            }
          );
        }
      }
    }
  }, [masterData, id, methods, dispatch, salesOrderApiData, effectiveContractNo, urlCustCode, urlCatlogCode, customerBasicData]);

  // Handle customer details and product setting when customer details API response is available
  useEffect(() => {
    if (!id && customerDetailsApiData) {
      // Set customer details from API response
      methods.setValue('customerDetails.repName', customerDetailsApiData.customerDetails?.repName || '');
      methods.setValue('customerDetails.crStatus', customerDetailsApiData.customerDetails?.creditStatus || '');
      // Set address details from API response
      if (customerDetailsApiData.streetAddress) {
        methods.setValue('addressDetails.address1', customerDetailsApiData.streetAddress.address1 || '');
        methods.setValue('addressDetails.address2', customerDetailsApiData.streetAddress.address2 || '');
        methods.setValue('addressDetails.city', customerDetailsApiData.streetAddress.city || '');
        methods.setValue('addressDetails.state', customerDetailsApiData.streetAddress.state || '');
        methods.setValue('addressDetails.postalCode', customerDetailsApiData.streetAddress.postcode || '');
      }
    }

    if (id && customerDetailsApiData && salesOrderApiData) {
      // Get the current address from the form/API data
      const currentAddress = salesOrderApiData.addressDetails;

      // Find matching address in customer details to get telephone and fax
      let matchingAddress = null;

      if (customerDetailsApiData.addressList && customerDetailsApiData.addressList.length > 0) {
        // For customers with multiple addresses, find the matching one
        matchingAddress = customerDetailsApiData.addressList.find((addr: any) => addr.address1?.trim() === currentAddress.address1?.trim() && addr.city?.trim() === currentAddress.city?.trim());

        // If no exact match found, use the first address
        if (!matchingAddress) {
          matchingAddress = customerDetailsApiData.addressList[0];
        }
      } else if (customerDetailsApiData.streetAddress) {
        // For customers with single address, use streetAddress
        matchingAddress = customerDetailsApiData.streetAddress;
      }

      // Set telephone and fax from the matching address
      if (matchingAddress) {
        methods.setValue('customerDetails.telephone', (matchingAddress as any).telephone?.trim() || '', { shouldValidate: false });
        methods.setValue('customerDetails.fax', (matchingAddress as any).fax?.trim() || '', { shouldValidate: false });
        
        // Also set address fields to ensure they stay populated after save
        methods.setValue('addressDetails.state', matchingAddress.state || '', { shouldValidate: false });
        methods.setValue('addressDetails.postalCode', matchingAddress.postcode || '', { shouldValidate: false });
      }
      
      // Also repopulate product field for existing orders to prevent disappearing after save
      if (salesOrderApiData.productDetails?.products && salesOrderApiData.productDetails.products.length > 0) {
        const existingProduct = salesOrderApiData.productDetails.products[0];
        
        // Find matching product in customer price list to get full details
        const matchingProduct = customerDetailsApiData.customerPriceList?.find(
          (item) => item.catlogCode === existingProduct.product
        );
        
        if (matchingProduct) {
          // Update with full product details including description for dropdown display
          const depotName = customerDetailsApiData.customerDetails?.depotName || '';
          const depotCode = depotName.split(' - ')[0] || '';
          
          const updatedProduct = {
            ...existingProduct,
            description: matchingProduct.description || (existingProduct as any).description || '',
            brand: matchingProduct.brand || (existingProduct as any).brand || '',
            market: matchingProduct.market || (existingProduct as any).market || '',
            marketDesc: matchingProduct.marketDesc || (existingProduct as any).marketDesc || '',
            depot: depotCode || (existingProduct as any).depot || '',
            depotName: depotName || (existingProduct as any).depotName || '',
            interval: matchingProduct.payPeriod || (existingProduct as any).interval || '',
          };
          
          methods.setValue('productDetails.products', [updatedProduct], { shouldValidate: false });
        } else {
          // If no matching product found in price list, use existing data as-is
          methods.setValue('productDetails.products', salesOrderApiData.productDetails.products, { shouldValidate: false });
        }
      }
    }

    // Set product from URL parameter if provided (only for new orders)
    if (!id && urlCatlogCode && customerDetailsApiData && customerDetailsApiData.customerPriceList) {
      const matchingProduct = customerDetailsApiData.customerPriceList.find((item) => item.catlogCode === urlCatlogCode);

      if (matchingProduct) {
        const depotName = customerDetailsApiData.customerDetails?.depotName || '';
        const depotCode = depotName.split(' - ')[0] || '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const formattedDate = today.toLocaleDateString('en-CA');
        const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
        // Create complete product object with all data from customer price list
        const productObject = {
          product: matchingProduct.catlogCode,
          price: Number(matchingProduct.price) || 0,
          interval: matchingProduct.payPeriod || '',
          dateRequired: formattedDate,
          uom: matchingProduct.uomOrder || '',
          dow: dayOfWeek,
          market: matchingProduct.market || '',
          marketDesc: matchingProduct.marketDesc || '',
          depot: depotCode,
          depotName: depotName,
          qty: 0,
          netAmt: 0,
          description: matchingProduct.description || '',
          brand: matchingProduct.brand || '',
          plistNo: 0,
        };
        // Set the product in the form
        methods.setValue('productDetails.products', [productObject], {
          shouldValidate: false,
          shouldDirty: false,
        });
      } else {
        console.warn('Product not found in customer price list:', urlCatlogCode);
      }
    }
  }, [id, urlCatlogCode, customerDetailsApiData, methods, salesOrderApiData]);

  useEffect(() => {
    return () => {
      inMemoryfileStorage.clear();
    };
  }, []);

  const handleFormSubmit = async (formData: SalesOrderEntryInterface, event?: React.BaseSyntheticEvent) => {
    setIsSpinnerLoading(true);

    // Handle order actions (cancel, print, etc.)
    const actionHandled = await handleOrderActions({
      formData,
      id: id as string,
      methods,
      showToast,
      setOpen,
      setIsSpinnerLoading,
      navigate,
      cancelPickListMutation,
      cancelSalesOrderMutation,
      printPickListMutation
    });

    if (actionHandled) {
      return; // Action was handled, exit early
    }

    const orderTypeValue = formData.orderDetails?.orderType || '';

    // Standing Order Validation based on contractNo value
    if (effectiveContractNo && effectiveContractNo !== '0') {
      // If contractNo is a positive number, it must be a standing order
      if (orderTypeValue !== 'STAN') {
        showToast({
          type: 'error',
          title: 'Invalid Order Type',
          message: 'This is a standing order. Order type must be "Standing".',
        });
        setIsSpinnerLoading(false);
        return;
      }
    } else {
      // If contractNo is 0 or empty, it cannot be a standing order
      if (orderTypeValue === 'STAN') {
        showToast({
          type: 'error',
          title: 'Invalid Order Type',
          message: 'Standing orders must have a valid contract number.',
        });
        setIsSpinnerLoading(false);
        return;
      }
    }
    // Get the assigneeNo from the selected customer address
    let assigneeNo = 1;
    if (customerDetails?.addressList && customerDetails.addressList.length > 0) {
      // Find the address that matches the current form address details
      const currentFormAddress = formData.addressDetails;
      const matchingAddress = customerDetails.addressList.find((addr: any) => addr.address1?.trim() === currentFormAddress.address1?.trim() && addr.city?.trim() === currentFormAddress.city?.trim());

      if (matchingAddress?.assigneeNo) {
        assigneeNo = matchingAddress.assigneeNo;
      } else if (customerDetails.addressList[0]?.assigneeNo) {
        assigneeNo = customerDetails.addressList[0].assigneeNo;
      }
    }
    if (assigneeNo === 1 && customerDetails?.streetAddress?.assigneeNo) {
      assigneeNo = customerDetails.streetAddress.assigneeNo;
    }

    // Helper function to extract carrier code (use label for API, value is for filtering)
    const getCarrierCode = (carrier: any): string => {
      if (!carrier) return '';
      if (typeof carrier === 'string') return carrier;
      if (typeof carrier === 'object' && carrier.label) return carrier.label;
      return '';
    };

    // Helper function to convert contractNo to number
    const getContractNoAsNumber = (contractNo: string | undefined): number => {
      if (!contractNo || contractNo.trim() === '') return 0;
      const parsed = parseInt(contractNo);
      return isNaN(parsed) ? 0 : parsed;
    };

    const currentVersion = id ? rawApiData?.orderHeader?.version || 0 : 0;

    // Determine correct status: existing orders or new standing orders (with contractNo) are 'Standing Order'
    const isNewStandingOrder = !id && effectiveContractNo && effectiveContractNo !== '0';
    const orderStatus = id || isNewStandingOrder ? 'Standing Order' : 'New';
    const apiData = {
      orderHeader: {
        sOrderNo: parseInt(id as string) || 0,
        status: formData.orderDetails.status || 'New',
        custCode: formData.orderDetails.customerCode?.value || '',
        custOrderNo: formData.orderDetails.customerOrderNo || '',
        orderDate: formData.orderDetails.dateOrdered ? new Date(formData.orderDetails.dateOrdered).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        carrierCode: getCarrierCode(formData.carrierDetails?.carrier),
        reason: formData.carrierDetails?.reason || '',
        version: currentVersion,
        statusName: formData.orderDetails.status || 'New',
        contractNo: getContractNoAsNumber(formData.orderDetails.contractNo),
      },
      orderDetailList:
        formData.productDetails?.products?.map((product) => ({
          catlogCode: product.product || '',
          depotCode: product.depot || '',
          market: product.market || '',
          orderQty: Number(product.qty) || 0,
          price: Number(product.price) || 0,
          netAmount: Number(product.netAmt) || 0,
          dateRequired: product.dateRequired ? new Date(product.dateRequired).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          dateDespatched: new Date().toISOString().split('T')[0],
          payPeriodCode: Number(product.interval) || 0,
          plistNo: id ? parseInt(String(product.plistNo || '0')) || 0 : 0,
        })) || [],
      requestCreatedDateTime: new Date().toISOString(),
      specialInst: formData.carrierDetails?.specialInstruction || '',
      assigneeNo: assigneeNo,
      isOneOff: orderTypeValue === 'ONOF',
    };
    try {
      // Construct URL based on contractNo presence - URL param takes priority
      const url = urlContractNo ? `/orders?contractNo=${urlContractNo}` : '/orders';

      const response = await getAxiosInstance().post(url, apiData);

      if (response.data?.status) {
        const newOrderId = response.data.id;
        setOpen(true);
        const orderTypeVal = formData.orderDetails?.orderTypeVal || '';
        const isStandingOrder = orderTypeValue === 'STAN';
        const successMessage = isStandingOrder ? 'Standing Order Submitted Successfully' : 'Sales Order Submitted Successfully';
        showToast({
          type: 'success',
          message: successMessage,
          title: successMessage,
        });
        // Simple invalidation of the list query
        queryClient.invalidateQueries({ queryKey: ['data-SalesOrder'] });
        //queryClient.invalidateQueries({ queryKey: ['customerDetails'] });
        setIsSpinnerLoading(false);
        setTimeout(() => {
          if (id) {
            // For existing orders, just reload the page
            navigate(`/${configStore.appName}/sales-order/${id}`);
          } else {
            // For new orders, navigate and then reload
            navigate(`/${configStore.appName}/sales-order/${newOrderId}`);
          }
        }, 1000);
      } else {
        console.error('API Error Response:', response.data);
        showToast({
          type: 'error',
          title: 'Sales Order Submission Failed!',
          message: response.data?.message || 'Unknown error occurred',
        });
        setIsSpinnerLoading(false);
      }
    } catch (error: any) {
      console.error('API Call Error:', error);
      console.error('Error Response:', error.response?.data);
      setOpen(true);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Sales Order Submission Failed!',
        title: 'Sales Order Submission Failed!',
      });
      setIsSpinnerLoading(false);
    }
  };

  const handleErrors = (errors: any) => {
    console.error('Form validation errors:', errors);
  };

  // Handle form submission with conditional validation
  const handleFormSubmitWithValidation = (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    const formData = methods.getValues();

    // Only skip validation for cancel actions, not for editing existing orders
    const shouldSkipValidation = formData.actionType === 'C' || formData.actionType === 'CS';

    if (shouldSkipValidation) {
      handleFormSubmit(formData);
    } else {
      // Use validation for all order submissions (new and existing), then add custom interval validation
      methods.handleSubmit(
        (validatedData) => {
          // Schema validation passed, now check custom interval validation
          const isStandingOrder = validatedData.orderDetails.orderType === 'STAN';
          const interval = validatedData.productDetails?.products?.[0]?.interval;

          const intervalNumber = Number(interval);
          if (isStandingOrder && (interval === undefined || interval === null || isNaN(intervalNumber) || intervalNumber <= 0)) {
            // Set custom error for interval field and stop submission
            methods.setError('productDetails.products.0.interval', {
              type: 'manual',
              message: 'Please enter Interval (days)',
            });
            return;
          }
          // All validations passed, proceed with submission
          handleFormSubmit(validatedData);
        },
        (errors) => {
          // Schema validation failed, also check and add interval error if needed
          const isStandingOrder = formData.orderDetails.orderType === 'STAN';
          const interval = formData.productDetails?.products?.[0]?.interval;
          const intervalNumber = Number(interval);

          if (isStandingOrder && (interval === undefined || interval === null || isNaN(intervalNumber) || intervalNumber <= 0)) {
            methods.setError('productDetails.products.0.interval', {
              type: 'manual',
              message: 'Please enter Interval (days)',
            });
          }
          handleErrors(errors);
        }
      )();
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="salesOrderForm" onSubmit={handleFormSubmitWithValidation} noValidate>
        <ModuleBaseLayout
          main={
            <SectionBaseLayout
              header={<SalesOrderEntryHeader />}
              footer={<SalesOrderEntryFooter />}
              main={
                <Flex gap="6" direction="column" className="min-h-full" style={{ backgroundColor: '#f4f4f4' }}>
                  <Flex direction="column" gap="6" style={{ backgroundColor: '#f4f4f4', padding: '2rem', maxWidth: '1400px' }}>
                    <SalesOrderDetailsBlock />
                    <ToastWrapper open={open} setOpen={setOpen} toastState={toastState} actionUrl={`/${configStore.appName}/sales-order/`} actionLabel="Go to List" />
                  </Flex>
                </Flex>
              }
            />
          }
        />
        <PopupMessageBox showCancelButton={true} isOpen={isOpenCompletionPopup} onOpenChange={setIsOpenCompletionPopup} dialogTitle="Confirmation" dialogDescription="Are you sure you want to complete the order?" onConfirm={() => handleFormSubmit(methods.getValues())} confirmButtonLabel="Yes" cancelButtonLabel="No" />
      </form>
      <DevTool control={methods.control} />
    </FormProvider>
  );
};

export default SalesOrderEntryForm;
