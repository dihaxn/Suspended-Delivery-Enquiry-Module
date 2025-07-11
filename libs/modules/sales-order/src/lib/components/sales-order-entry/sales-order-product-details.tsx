import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { FormDate, FormInput, FormSelect } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { useStoreSelector, STORE } from '@cookers/store';
import { useCustomerDetailsQuery } from '../../queries/use-customer-details-query';
import { useSalesOrderMasterDataQuery } from '../../queries/use-sales-order-master-data-query';


interface SalesOrderProductDetailsProps {
  isStandingOrderFromUrl?: boolean; 
}

export const SalesOrderProductDetails: React.FC<SalesOrderProductDetailsProps> = ({ 
  isStandingOrderFromUrl = false  
}) => {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const { permission } = useStoreSelector(STORE.SalesOrder);
  const customerCode = watch('orderDetails.customerCode');
  const orderNo = watch('orderDetails.orderNo');
  const status = watch('orderDetails.status');
  const { data: customerDetails } = useCustomerDetailsQuery(customerCode?.value || null);
  const { salesOrderMasterData } = useSalesOrderMasterDataQuery();
  
  // Check read-only states
  const isCancelled = status === 'Cancelled';
  const isPrinted = status === 'Printed';
  const isOnTruck = status === 'On Truck';
  const isInvoiced = status === 'Invoiced';
  const isReadOnly = !permission.canEditDetailsBlock || isCancelled || isPrinted || isOnTruck || isInvoiced;
  const isOneOff = watch('orderDetails.orderType') === 'ONOF';
  const isProductDropdownReadOnly = isReadOnly || isStandingOrderFromUrl;

  // Reset product-related fields when customer changes, but only for manual customer selection (not URL params)
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasUrlParams = searchParams.has('custCode') || searchParams.has('catlogCode');
    
    if (customerCode && !orderNo && !hasUrlParams) { 
      console.log('Resetting product fields for manual customer change');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedDate = today.toLocaleDateString('en-CA');
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
      const depotName = customerDetails?.customerDetails?.depotName || '';
      const depotCode = depotName.split(' - ')[0] || '';

      // Reset all product fields immediately when customer changes for new orders
      setValue('productDetails.products.0', {
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
      });
      
      setValue('carrierDetails.carrier', { label: '', value: '' });
    }
  }, [customerCode, setValue, customerDetails, orderNo]);

  // Initialize product if not exists - this acts as a fallback to ensure there's always a product entry
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasUrlParams = searchParams.has('custCode') || searchParams.has('catlogCode');
    
    const currentProducts = watch('productDetails.products');
    
    // Only initialize if products array is truly empty and we have customer details
    if ((!currentProducts || currentProducts.length === 0) && 
        customerDetails?.customerDetails && 
        !orderNo && 
        !hasUrlParams) {
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedDate = today.toLocaleDateString('en-CA');
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

      const depotName = customerDetails.customerDetails.depotName || '';
      const depotCode = depotName.split(' - ')[0] || '';

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
      }]);
    }
  }, [setValue, customerDetails?.customerDetails, orderNo]);

  const handleProductChange = (value: string) => {
    if (value === '_placeholder_') {
      setValue('carrierDetails.carrier', { label: '', value: '' });
      return;
    }

    const selectedItem = customerDetails?.customerPriceList?.find(
      item => item.catlogCode === value
    );

    if (selectedItem) {
      const depotName = customerDetails?.customerDetails?.depotName || '';
      const depotCode = depotName.split(' - ')[0] || '';

      // Reset date required to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedDate = today.toLocaleDateString('en-CA');
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

      setValue('productDetails.products.0.product', selectedItem.catlogCode);
      setValue('productDetails.products.0.price', Number(selectedItem.price) || 0);
      setValue('productDetails.products.0.uom', selectedItem.uomOrder || '');
      setValue('productDetails.products.0.description', selectedItem.description || '');
      setValue('productDetails.products.0.market', selectedItem.market || '');
      setValue('productDetails.products.0.marketDesc', selectedItem.marketDesc || '');
      setValue('productDetails.products.0.depot', depotCode);
      setValue('productDetails.products.0.depotName', depotName);
      setValue('productDetails.products.0.brand', selectedItem.brand || '');
      setValue('productDetails.products.0.qty', '');
      setValue('productDetails.products.0.interval', selectedItem.payPeriod ? Number(selectedItem.payPeriod) : '', { shouldValidate: true });
      setValue('productDetails.products.0.dateRequired', formattedDate, { shouldValidate: true });
      setValue('productDetails.products.0.dow', dayOfWeek);
      
      // Set or clear carrier based on product's carrier code
      if (selectedItem.carrierCode?.trim()) {
        // Product has a carrier code - try to set it
        const carrierExists = salesOrderMasterData?.carrierList?.some(
          carrier => carrier.label.trim() === selectedItem.carrierCode?.trim()
        );

        if (carrierExists) {
          const matchingCarrier = salesOrderMasterData?.carrierList?.find(
            carrier => carrier.label.trim() === selectedItem.carrierCode?.trim()
          );
          
          setValue('carrierDetails.carrier', {
            label: matchingCarrier?.label || '',
            value: matchingCarrier?.value || ''
          });
        } else {
          // Carrier code exists but not found in list - clear carrier
          setValue('carrierDetails.carrier', { label: '', value: '' });
        }
      } else {
        // Product doesn't have a carrier code - clear carrier
        setValue('carrierDetails.carrier', { label: '', value: '' });
      }
      setValue('productDetails.products.0.netAmt', 0);
    }
  };

  const handleQtyChange = (value: number) => {
    const qty = isNaN(value) || value < 0 ? 0 : value;
    setValue('productDetails.products.0.qty', qty, { shouldValidate: true });
    const currentPrice = watch('productDetails.products.0.price') || 0;
    setValue('productDetails.products.0.netAmt', qty * currentPrice);
  };

  const handleDateChange = (date: string | Date | null | undefined) => {
    if (date) {
      const selectedDate = new Date(date);
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      setValue('productDetails.products.0.dateRequired', formattedDate , { shouldValidate: true });
      setValue('productDetails.products.0.dow', selectedDate.toLocaleDateString('en-US', { weekday: 'long' }));
    }
  };

  const handleIntervalChange = (value: number) => {
    const interval = isNaN(value) || value < 0 ? 0 : value;
    setValue('productDetails.products.0.interval', interval, { shouldValidate: true });
  };

  return (
    <Box className="form-section-2x-grid-block w-full mt-4">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border-b w-[330px]">Product</th>
              <th className="p-2 text-left border-b w-[120px]">Market</th>
              <th className="p-2 text-left border-b w-[150px]">Depot</th>
              <th className="p-2 text-left border-b w-[80px]">UOM</th>
              <th className="p-2 text-left border-b w-[70px]">QTY</th>
              <th className="p-2 text-left border-b w-[100px]">Price</th>
              <th className="p-2 text-left border-b w-[100px]">Net Amt</th>
              <th className="p-2 text-left border-b w-[140px]">Date Required</th>
              <th className="p-2 text-left border-b w-[120px]">DOW</th>
              {!isOneOff && <th className="p-2 text-left border-b w-[80px]">Interval</th>}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-2 align-top">
                <div className="mt-2 max-w-[360px] relative">
                  <FormSelect
                    name="productDetails.products.0.product"
                    data={[
                      { label: 'Click to select a product', value: '_placeholder_' },
                      ...(customerDetails?.customerPriceList?.map((item) => ({
                        label: `${item.catlogCode} - ${item.description}`,
                        value: item.catlogCode,
                      })) || []),
                    ]}
                    onValueChange={(value) => {
                                          if (value === '_placeholder_') {
                      setValue('carrierDetails.carrier', { label: '', value: '' });
                    } else {
                        handleProductChange(value);
                      }
                    }}
                    readOnly={isProductDropdownReadOnly}
                    label=""
                  />
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {watch('productDetails.products.0.marketDesc') || '-'}
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {watch('productDetails.products.0.depotName') || '-'}
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {watch('productDetails.products.0.uom') || '-'}
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="flex justify-center">
                  <div className="w-16 mt-2 relative">
                    <FormInput 
                      name="productDetails.products.0.qty"  
                      type="number" 
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Handle empty string or invalid input
                        if (inputValue === '' || inputValue === '-') {
                          handleQtyChange(0);
                        } else {
                          const numValue = Number(inputValue);
                          handleQtyChange(numValue);
                        }
                      }} 
                      readOnly={isReadOnly} 
                      label="" 
                    />
                  </div>
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {(Number(watch('productDetails.products.0.price')) || 0).toFixed(2)}
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {(Number(watch('productDetails.products.0.netAmt')) || 0).toFixed(2)}
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="flex justify-center">
                  <div className="mt-2">
                    <FormDate name="productDetails.products.0.dateRequired" dateFormat="dd-MMM-yyyy" returnType="string" minDate={orderNo ? undefined : new Date()} defaultValue={new Date()} onDateChange={handleDateChange} readOnly={isReadOnly} label="" />
                  </div>
                </div>
              </td>
              <td className="p-2 align-top text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="mt-4 flex items-start">
                  {watch('productDetails.products.0.dow') || '-'}
                </div>
              </td>
              {!isOneOff && (
                <td className="p-2 align-top">
                  <div className="flex justify-left">
                    <div className="w-16 mt-2 relative">
                      <FormInput 
                        name="productDetails.products.0.interval" 
                        type="number" 
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Handle empty string or invalid input
                          if (inputValue === '' || inputValue === '-') {
                            handleIntervalChange(0);
                          } else {
                            const numValue = Number(inputValue);
                            handleIntervalChange(numValue);
                          }
                        }}
                        readOnly={isReadOnly} 
                        label="" 
                      />
                    </div>
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </Box>
  );
};

export default SalesOrderProductDetails; 