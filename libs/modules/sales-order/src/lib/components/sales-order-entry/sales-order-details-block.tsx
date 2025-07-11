import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { FormDate, FormInput, FormInputAutoComplete, FormInputAutoCompleteVirtualized, FormSelect, FormTextArea, FormRadio, PopupMessageBox } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { useStoreSelector, STORE } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { useCustomerBasicQuery } from '../../queries/customer-lookup-query';
import { useCustomerDetailsQuery } from '../../queries/use-customer-details-query';
import SalesOrderProductDetails from './sales-order-product-details';
import { CustomerAutoComplete } from './customer-autocomplete';
import { CarrierAutoComplete } from './carrier-autocomplete';
import { useSalesOrderMasterDataQuery } from '../../queries/use-sales-order-master-data-query';
import { SalesOrderMasterData } from '@cookers/models';
import { setCustomerDetails, clearCustomerDetails } from '@cookers/store';
import { AddressSelectionPopup } from './address-selection-popup';
import { Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const SalesOrderDetailsBlock: React.FC = () => {
  const { watch, setValue, formState } = useFormContext();
  const { permission, salesOrderApiData } = useStoreSelector(STORE.SalesOrder);
  const dispatch = useDispatch();
  const customerCode = watch('orderDetails.customerCode');
  const selectedProduct = watch('productDetails.products.0.product');
  const { customerBasicData } = useCustomerBasicQuery();
  const { salesOrderMasterData } = useSalesOrderMasterDataQuery();
  const orderTypeData = salesOrderMasterData?.orderTypeList || [];
  const status = watch('orderDetails.status');
  const isCancelled = status === 'Cancelled';
  const isPrinted = status === 'Printed';
  const isOnTruck = status === 'On Truck';
  const isInvoiced = status === 'Invoiced';
  const isReadOnly = !permission.canEditDetailsBlock || isCancelled || isPrinted || isOnTruck || isInvoiced;
  const orderNo = watch('orderDetails.orderNo');
  const [searchParams] = useSearchParams();
  
  // Get contractNo from both URL params and API response
  const urlContractNo = searchParams.get('contractNo');
  const apiContractNo = salesOrderApiData?.orderDetails?.contractNo;
  
  // URL contractNo takes priority if both are present
  const effectiveContractNo = urlContractNo || apiContractNo || '';
  const shouldShowContractNo = Boolean(effectiveContractNo && effectiveContractNo !== '0');

  // Check if this is a standing order opened from URL parameters (should be read-only)
  const isStandingOrderFromUrl = Boolean(urlContractNo && urlContractNo !== '0' && !orderNo);
  
  // Check if this is a standing order from API response (should be read-only)
  const currentOrderType = watch('orderDetails.orderType');
  const isStandingOrderFromApi = Boolean(orderNo && (currentOrderType === 'STAN' || currentOrderType === 'Standing Order'));
  
  // Combined standing order check
  const isStandingOrder = isStandingOrderFromUrl || isStandingOrderFromApi;

  const isCustomerReadOnly = isReadOnly || isStandingOrder;

  // Address selection popup state
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Credit status popup state
  const [isCreditStatusPopupOpen, setIsCreditStatusPopupOpen] = useState(false);
  const [creditStatusMessage, setCreditStatusMessage] = useState('');
  const [shouldShowCreditStatusAfterAddressClose, setShouldShowCreditStatusAfterAddressClose] = useState(false);
  const [previousCustomerCode, setPreviousCustomerCode] = useState<string | null>(null);

  // Watch for customer code changes to update customer details
  const selectedCustomer = customerBasicData?.find((customer) => customer.value === customerCode?.value);

  // Fetch customer details when customer code changes
  const { data: customerDetails, isLoading: isLoadingCustomerDetails } = useCustomerDetailsQuery(
    customerCode?.value || null
  );

  // Check if there are multiple addresses
  const hasMultipleAddresses = customerDetails?.addressList && customerDetails.addressList.length > 0;

  // Watch for order type changes
  const orderType = watch('orderDetails.orderType');
  const isOneOff = orderType === 'ONOF';

  // Auto show address popup when customer has multiple addresses
  useEffect(() => {
    if (hasMultipleAddresses && !isReadOnly && customerDetails) {
      // Only show popup for new orders (no orderNo) and non-printed status
      if (!orderNo && status !== 'P') {
        setIsAddressPopupOpen(true);
      }
    }
  }, [hasMultipleAddresses, customerDetails, isReadOnly, orderNo, status]);

  // Get all available addresses for the popup
  const getAllAddresses = () => {
    return customerDetails?.addressList || [];
  };

  // Handle address selection from popup
  const handleAddressSelect = (selectedAddress: any) => {
    setSelectedAddress(selectedAddress);
    setValue('addressDetails.address1', selectedAddress.address1 || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.address2', selectedAddress.address2 || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.city', selectedAddress.city || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.state', selectedAddress.state || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.postalCode', selectedAddress.postcode || '', { shouldValidate: true, shouldDirty: true });
    
    // Update telephone and fax from the selected address (only for new orders)
    if (!orderNo) {
      setValue('customerDetails.telephone', selectedAddress.telephone?.trim() || '', { shouldValidate: true, shouldDirty: true });
      setValue('customerDetails.fax', selectedAddress.fax?.trim() || '', { shouldValidate: true, shouldDirty: true });
      setValue('customerDetails.contact', selectedAddress.contact?.trim() || '', { shouldValidate: true, shouldDirty: true });
    }
  };

  // Handle address popup close
  const handleAddressPopupClose = () => {
  setIsAddressPopupOpen(false);
  
  // If no address was selected, use default streetAddress
  if (!selectedAddress && customerDetails?.streetAddress) {
    const defaultAddress = customerDetails.streetAddress;
    
    // Update address fields
    setValue('addressDetails.address1', defaultAddress.address1 || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.address2', defaultAddress.address2 || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.city', defaultAddress.city || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.state', defaultAddress.state || '', { shouldValidate: true, shouldDirty: true });
    setValue('addressDetails.postalCode', defaultAddress.postcode || '', { shouldValidate: true, shouldDirty: true });
    
    // Update contact, telephone, fax from streetAddress (only for new orders)
    if (!orderNo) {
      setValue('customerDetails.contact', defaultAddress.contact?.trim() || '', { shouldValidate: true, shouldDirty: true });
      setValue('customerDetails.telephone', defaultAddress.telephone?.trim() || '', { shouldValidate: true, shouldDirty: true });
      setValue('customerDetails.fax', defaultAddress.fax?.trim() || '', { shouldValidate: true, shouldDirty: true });
    }
  }
  
  // Handle credit status popup
  if (shouldShowCreditStatusAfterAddressClose) {
    setShouldShowCreditStatusAfterAddressClose(false);
    setIsCreditStatusPopupOpen(true);
  }
};

  // Update customer details in Redux store
  useEffect(() => {
    if (customerDetails) {
      dispatch(setCustomerDetails(customerDetails));
    } else {
      dispatch(clearCustomerDetails());
    }
  }, [customerDetails, dispatch]);

  // Update form fields with customer details and show credit status popup
  useEffect(() => {
    if (customerDetails) {
      const currentCustomerCode = customerCode?.value;
      
      // Reset popup states when customer changes
      if (previousCustomerCode && currentCustomerCode && previousCustomerCode !== currentCustomerCode) {
        setShouldShowCreditStatusAfterAddressClose(false);
        setIsCreditStatusPopupOpen(false);
        setSelectedAddress(null);
      }
      
      // Update previous customer code
      if (currentCustomerCode) {
        setPreviousCustomerCode(currentCustomerCode);
      }

      // Set customer details
      setValue('customerDetails.bdm', customerDetails.customerDetails.repName || '', { shouldValidate: true, shouldDirty: true });
      setValue('customerDetails.crStatus', customerDetails.customerDetails.creditStatus || '', { shouldValidate: true, shouldDirty: true });

      const creditStatus = customerDetails.customerDetails.creditStatus;
      if (creditStatus && creditStatus.trim() !== '' && !orderNo) {
        const creditStatusNumber = creditStatus.trim().split(' ')[0];
        setCreditStatusMessage(`Customer's Credit Status is ${creditStatusNumber}`);
        
        // Don't show popup if credit status is "02"
        if (creditStatusNumber !== '02') {
          if (hasMultipleAddresses && !isReadOnly && status !== 'P') {
            setShouldShowCreditStatusAfterAddressClose(true);
          } else {
            setIsCreditStatusPopupOpen(true);
          }
        }
      }

      // Set address fields in one batch
      let addressData = null;
      
      if (orderNo) {
        // For existing orders, use the address data from API response
        // This should come from the form data or API response
        addressData = {
          address1: watch('addressDetails.address1'),
          address2: watch('addressDetails.address2'),
          city: watch('addressDetails.city'),
          state: watch('addressDetails.state'),
          postalCode: watch('addressDetails.postalCode'),
        };
      } else if (selectedAddress) {
        // Use selected address if user made a choice (for new orders)
        addressData = selectedAddress;
      } else if (customerDetails.addressList && customerDetails.addressList.length > 0) {
        // Use first entry from addressList if available (for initial load)
        addressData = customerDetails.addressList[0];
      } else if (customerDetails.streetAddress) {
        // Fallback to streetAddress if addressList is empty
        addressData = customerDetails.streetAddress;
      }

      // Set address fields and contact/telephone/fax in one batch
      if (addressData) {
        // Address fields
        setValue('addressDetails.address1', addressData.address1 || '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.address2', addressData.address2 || '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.city', addressData.city || '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.state', addressData.state || '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.postalCode', addressData.postcode || '', { shouldValidate: true, shouldDirty: true });
        
        if (!orderNo) {
          setValue('customerDetails.contact', addressData.contact?.trim() || '', { shouldValidate: true, shouldDirty: true });
          setValue('customerDetails.telephone', addressData.telephone?.trim() || '', { shouldValidate: true, shouldDirty: true });
          setValue('customerDetails.fax', addressData.fax?.trim() || '', { shouldValidate: true, shouldDirty: true });
        }
      } else {
        // Clear address fields if no address data is available
        setValue('addressDetails.address1', '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.address2', '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.city', '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.state', '', { shouldValidate: true, shouldDirty: true });
        setValue('addressDetails.postalCode', '', { shouldValidate: true, shouldDirty: true });
        
        // Clear telephone and fax as well (skip for existing orders)
        if (!orderNo) {
          setValue('customerDetails.telephone', '', { shouldValidate: true, shouldDirty: true });
          setValue('customerDetails.fax', '', { shouldValidate: true, shouldDirty: true });
        }
      }

      // Initialize placeholder product when customer is selected (for new orders only)
      if (!orderNo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const formattedDate = today.toLocaleDateString('en-CA');
        const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
        const depotName = customerDetails.customerDetails.depotName || '';
        const depotCode = customerDetails.customerDetails.depotCode || depotName.split(' - ')[0] || '';

        // Set placeholder product that will trigger validation if user tries to save
        setValue('productDetails.products', [{
          product: '_placeholder_',
          price: 0,
          interval: '',
          dateRequired: formattedDate,
          uom: '',
          dow: dayOfWeek,
          market: '',
          marketDesc: '',
          depot: depotCode,
          depotName: depotName,
          qty: '',
          netAmt: 0,
          description: '',
          brand: ''
        }], { shouldDirty: true });
      }

      // Clear carrier when customer changes (only for new orders)
      if (!orderNo) {
        setValue('carrierDetails.carrier', { label: '', value: '' }, { shouldDirty: true });
      }
    }
  }, [customerDetails, setValue, orderNo, hasMultipleAddresses, isReadOnly, status,selectedAddress]);

  // Clear reason when switching to Standing order
  useEffect(() => {
    if (!isOneOff) {
      setValue('carrierDetails.reason', '', { shouldValidate: true });
    }
  }, [isOneOff, setValue]);



  // Note: Order type initialization is now handled in the main form component to prevent race conditions

  // Check if the selected product requires used oil trucks (UO brand only)
  const isUsedCookingOilProduct = React.useMemo(() => {
    if (!selectedProduct || !customerDetails?.customerPriceList) return false;
    const product = customerDetails.customerPriceList.find(
      item => item.catlogCode === selectedProduct
    );
    // Used Oil trucks (WST carriers) are used for UO (Used Oil) brand only
    return product?.brand === 'UO';
  }, [selectedProduct, customerDetails]);

  // Filter and format carrier list
  const formattedCarrierList = React.useMemo(() => {
    // Don't show any carriers if no product is selected or if it's the placeholder
    if (!selectedProduct || selectedProduct === '_placeholder_' || !salesOrderMasterData?.carrierList) {
      return [];
    }
    
    return salesOrderMasterData.carrierList
      .filter(carrier => {
        if (!carrier?.label || !carrier?.value) return false;
        if (isUsedCookingOilProduct) {
          return carrier.value === 'WST';
        }
        return carrier.value !== 'WST';
      })
      .map(carrier => ({
        label: carrier.label,
        value: carrier.label
      }));
  }, [salesOrderMasterData?.carrierList, isUsedCookingOilProduct, selectedProduct]);

  // Update carrier when product changes (only for new orders)
  useEffect(() => {
    if (orderNo) {
      return;
    }

    // Clear carrier if no product is selected or if it's the placeholder
    if (!selectedProduct || selectedProduct === '_placeholder_') {
      setValue('carrierDetails.carrier', { label: '', value: '' });
      return;
    }

    // Get the carrier from the product's price list if available (for all products)
    const product = customerDetails?.customerPriceList?.find(
      item => item.catlogCode === selectedProduct
    );
    
    if (product?.carrierCode) {
      // Try to find matching carrier in the filtered list
      const matchingCarrier = formattedCarrierList.find(
        carrier => carrier.value === product.carrierCode?.trim()
      );
      if (matchingCarrier) {
        setValue('carrierDetails.carrier', matchingCarrier, { shouldValidate: true, shouldDirty: true });
      } else {
        // Clear if no matching carrier found in the filtered list
        setValue('carrierDetails.carrier', { label: '', value: '' });
      }
    } else {
      // Clear if product has no carrier code
      setValue('carrierDetails.carrier', { label: '', value: '' });
    }
  }, [selectedProduct, formattedCarrierList, setValue, customerDetails, orderNo]);

  return (
    <>
      <div className="form-section-block pb-4 overflow-hidden">
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>{isStandingOrder ? 'Standing Order Details' : 'Sales Order Details'}</Heading>
            <Flex align="end" gap="2"></Flex>
          </Flex>
          <Flex align="end" gap="2">
            <small></small>
          </Flex>
        </Box>

        <Flex wrap="wrap" className="form-section-grid !flex-row">
          <Flex className="w-full" gap="0" direction="row" wrap="wrap">
            {/* Left Section: Order Details */}
            <Box className="form-section-2x-grid-block w-1/2">
              <Heading size="3">Order Details</Heading>
              <div className="grid grid-cols-2 gap-x-10">
                {/* <FormInput label="Order No" name="orderDetails.orderNo" readOnly={true} />
                <FormInput label="Status" name="orderDetails.status" readOnly={true} /> */}
                <div className="col-span-2">
                  <CustomerAutoComplete label="Customer" name="orderDetails.customerCode" options={customerBasicData || []} readOnly={isCustomerReadOnly} />
                </div>
                <FormDate 
                  label="Date Ordered" 
                  name="orderDetails.dateOrdered" 
                  dateFormat="dd-MMM-yyyy"
                  returnType="string"
                  minDate={orderNo ? undefined : new Date()}
                  defaultValue={new Date()}
                  readOnly={isReadOnly}
                  required={true}
                  onDateChange={(date) => {
                    if (date) {
                      const selectedDate = new Date(date);
                      selectedDate.setHours(0, 0, 0, 0);
                      const formattedDate = selectedDate.toLocaleDateString('en-CA'); 
                      setValue('orderDetails.dateOrdered', formattedDate, { shouldValidate: true });
                    }
                  }}
                />
                <FormInput label="Customer Order No" name="orderDetails.customerOrderNo" readOnly={isReadOnly} maxLength={20} validateOnChange={true} />
                {isOneOff && <FormInput label="PList No" name="orderDetails.plistNo" maxLength={30} readOnly={true} />}
                {shouldShowContractNo && (
                  <FormInput 
                    label="Contract No" 
                    name="orderDetails.contractNo"
                    readOnly={true}
                  />
                )}
              </div>
            </Box>

            {/* Right Section: Address Details */}
            <Box className="form-section-2x-grid-block w-1/4">
              {hasMultipleAddresses && customerDetails ? (
                <Flex justify="between" align="center">
                  <Heading size="3" className="flex-grow">
                    Address Details
                  </Heading>
                  <IconButton size="1" variant="soft" color="blue" type="button" onClick={() => setIsAddressPopupOpen(true)} disabled={isReadOnly} title={`Select Address (${getAllAddresses().length} available)`}>
                    <Info size={14} />
                  </IconButton>
                </Flex>
              ) : (
                <Heading size="3">Address Details</Heading>
              )}
              <div className="grid grid-cols-1 gap-1">
                <FormInput label="Address 1" name="addressDetails.address1" maxLength={100} readOnly={true} />
                <FormInput label="Address 2" name="addressDetails.address2" maxLength={100} readOnly={true} />
                <FormInput label="Suburb" name="addressDetails.city" maxLength={50} readOnly={true} />
                <FormInput label="State" name="addressDetails.state" maxLength={50} readOnly={true} />
                <FormInput label="Postal Code" name="addressDetails.postalCode" maxLength={10} readOnly={true} />
              </div>
            </Box>

            {/* Right Section: Customer Details */}
            <Box className="form-section-2x-grid-block w-1/4">
              <Heading size="3">Customer Details</Heading>
              <div className="grid grid-cols-1 gap-1">
                <FormInput label="Contact" name="customerDetails.contact" maxLength={30} readOnly={true} />
                <FormInput label="Telephone" name="customerDetails.telephone" maxLength={14} readOnly={true} />
                <FormInput label="BDM" name="customerDetails.bdm" maxLength={30} readOnly={true} />
                <FormInput label="Fax" name="customerDetails.fax" maxLength={50} readOnly={true} />
                <FormInput label="Credit Status" name="customerDetails.crStatus" readOnly={true} />
              </div>
            </Box>
          </Flex>
        </Flex>
      </div>

      {/* Product Details as a separate main section */}
      <div className="form-section-block pb-4 overflow-hidden">
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>Product Details</Heading>
            <Flex align="end" gap="2"></Flex>
          </Flex>
          <Flex align="end" gap="2">
            <small></small>
          </Flex>
        </Box>

        <Flex wrap="wrap" className="form-section-grid !flex-row">
          <Flex className="w-full" gap="0" direction="row" wrap="wrap">
            <SalesOrderProductDetails isStandingOrderFromUrl={isStandingOrder} />
          </Flex>
        </Flex>
      </div>

      {/* Carrier Details Section */}
      <div className="form-section-block pb-4 overflow-hidden">
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>Other Details</Heading>
            <Flex align="end" gap="2"></Flex>
          </Flex>
          <Flex align="end" gap="2">
            <small></small>
          </Flex>
        </Box>

        <Flex wrap="wrap" className="form-section-grid !flex-row">
          {/* Left Column */}
          <Box className="form-section-2x-grid-block w-1/2 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="min-h-[100px] flex flex-col justify-start">
                <CarrierAutoComplete
                  label="Carrier"
                  name="carrierDetails.carrier"
                  options={formattedCarrierList}
                  readOnly={isReadOnly}
                />
              </div>
              <FormTextArea label="Special Instruction" name="carrierDetails.specialInstruction" readOnly={isReadOnly} maxLength={256} size="l" validateOnChange={true} />
            </div>
          </Box>

          {/* Right Column */}
          <Box className="form-section-2x-grid-block w-1/2 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="min-h-[100px] flex flex-col justify-end">
              </div>
              {isOneOff && (
                <FormTextArea label="Reason" name="carrierDetails.reason" readOnly={isReadOnly} size="l" maxLength={100} required={true} validateOnChange={true} />
              )}
            </div>
          </Box>
        </Flex>
      </div>

      {/* Credit Status Popup */}
      <PopupMessageBox
        isOpen={isCreditStatusPopupOpen}
        onOpenChange={setIsCreditStatusPopupOpen}
        dialogTitle="Customer Credit Status"
        dialogDescription={creditStatusMessage}
        confirmButtonLabel="OK"
        showCancelButton={false}
        onConfirm={() => {
          setIsCreditStatusPopupOpen(false);
        }}
      />

      {/* Address Selection Popup */}
      <AddressSelectionPopup 
        isOpen={isAddressPopupOpen} 
        onClose={handleAddressPopupClose} 
        addresses={getAllAddresses()} 
        onAddressSelect={handleAddressSelect}
        selectedAddress={selectedAddress}
      />
    </>
  );
};

export default SalesOrderDetailsBlock; 