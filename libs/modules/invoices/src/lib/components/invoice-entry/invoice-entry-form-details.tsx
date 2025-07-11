import React, { useEffect } from 'react';
import { Box, FormInputAutoCompleteVirtualized, FormInput, FormDate, Heading } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { InvoiceEntryInterface } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';

export const InvoiceEntryFormDetails: React.FC = () => {
  const { watch, setValue } = useFormContext<InvoiceEntryInterface>();
  const { masterData } = useStoreSelector(STORE.Invoice);
  
  const customerCode = watch('invoiceDetails.customer');

  // Watch for customer changes to populate address and customer details
  useEffect(() => {
    if (customerCode && typeof customerCode === 'object' && customerCode.value) {
      // Find customer details from masterData
      const customer = masterData.customerList?.find(c => c.custCode === customerCode.value);
      if (customer) {
        // For now, we'll just set empty values since the customer object only has name and custCode
        setValue('customerDetails.contact', '');
        setValue('customerDetails.telephone', '');
        setValue('customerDetails.fax', '');
        setValue('customerDetails.bdm', '');
        setValue('customerDetails.creditStatus', '');
        
        // Populate address details
        setValue('addressDetails.address1', '');
        setValue('addressDetails.address2', '');
        setValue('addressDetails.suburb', '');
        setValue('addressDetails.state', '');
        setValue('addressDetails.postalCode', '');
      }
    }
  }, [customerCode, setValue, masterData.customerList]);

  return (
    <Box className="form-section-2x-grid-block w-full">
      <Heading size="4" className="col-span-2 mb-4">Invoice Details</Heading>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <FormInputAutoCompleteVirtualized
            label="Product Type"
            name="invoiceDetails.productType"
            options={masterData.productType || []}
          />
          
          <FormInputAutoCompleteVirtualized
            label="Customer"
            name="invoiceDetails.customer"
            options={masterData.customerList?.map(customer => ({
              label: `${customer.custCode} - ${customer.name}`,
              value: customer.custCode,
            })) || []}
          />
          
          <FormDate
            label="Date Shipped"
            name="invoiceDetails.dateShipped"
          />
          
          <FormInput
            label="Invoice No"
            name="invoiceDetails.invoiceNo"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <FormInputAutoCompleteVirtualized
            label="Invoice Type"
            name="invoiceDetails.invoiceType"
            options={[
              { label: 'Standard', value: 'standard' },
              { label: 'Credit', value: 'credit' },
              { label: 'Debit', value: 'debit' },
            ]}
          />
          
          <FormInput
            label="Customer Order No"
            name="invoiceDetails.customerOrderNo"
          />
          
          <FormInputAutoCompleteVirtualized
            label="Carrier Code"
            name="invoiceDetails.carrierCode"
            options={masterData.carrierList ?? []}
          />
        </div>
      </div>

      {/* Address Details Section */}
      <Heading size="4" className="col-span-2 mb-4 mt-6">Address Details</Heading>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <FormInput
            label="Address 1"
            name="addressDetails.address1"
          />
          <FormInput
            label="Suburb"
            name="addressDetails.suburb"
          />
          <FormInput
            label="Postal Code"
            name="addressDetails.postalCode"
          />
        </div>
        <div className="space-y-4">
          <FormInput
            label="Address 2"
            name="addressDetails.address2"
          />
          <FormInput
            label="State"
            name="addressDetails.state"
          />
        </div>
      </div>

      {/* Customer Details Section */}
      <Heading size="4" className="col-span-2 mb-4 mt-6">Customer Details</Heading>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <FormInput
            label="Contact"
            name="customerDetails.contact"
          />
          <FormInput
            label="BDM"
            name="customerDetails.bdm"
          />
          <FormInput
            label="Credit Status"
            name="customerDetails.creditStatus"
          />
        </div>
        <div className="space-y-4">
          <FormInput
            label="Telephone"
            name="customerDetails.telephone"
          />
          <FormInput
            label="Fax"
            name="customerDetails.fax"
          />
        </div>
      </div>
    </Box>
  );
};

export default InvoiceEntryFormDetails;