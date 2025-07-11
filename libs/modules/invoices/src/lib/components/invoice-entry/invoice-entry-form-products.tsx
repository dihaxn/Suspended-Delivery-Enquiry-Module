import React, { useEffect } from 'react';
import { Box, FormInputAutoCompleteVirtualized, FormInput, Heading } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { InvoiceEntryInterface } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';

export const InvoiceEntryFormProducts: React.FC = () => {
  const { watch, setValue, getValues } = useFormContext<InvoiceEntryInterface>();
  const { masterData } = useStoreSelector(STORE.Invoice);
  
  const products = watch('productDetails.products') || [];
  const customerCode = watch('invoiceDetails.customer');

  // Get customer's product list based on selected customer
  const getCustomerProducts = () => {
    // For now, return all catalog products since we don't have customer-specific filtering
    return masterData.catalogList || [];
  };

  const handleProductChange = (index: number, productCode: string) => {
    const availableProducts = getCustomerProducts();
    const selectedProduct = availableProducts.find(p => p.catlogCode === productCode);
    
    if (selectedProduct) {
      const currentProducts = getValues('productDetails.products');
      const updatedProducts = [...currentProducts];
      
      updatedProducts[index] = {
        ...updatedProducts[index],
        product: selectedProduct.catlogCode,
        market: '', // Will be populated from product details
        marketDesc: selectedProduct.description ?? '',
        depot: '', 
        depotName: '',
        uom: '',
        price: 0,
        qty: updatedProducts[index]?.qty || 0,
        netAmount: (updatedProducts[index]?.qty || 0) * 0,
        dateShipped: new Date().toISOString().split('T')[0],
        gst: 0,
      };
      
      setValue('productDetails.products', updatedProducts);
      calculateTotals(updatedProducts);
    }
  };

  const handleQtyChange = (index: number, qty: number) => {
    const currentProducts = getValues('productDetails.products');
    const updatedProducts = [...currentProducts];
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      qty: qty,
      netAmount: qty * (updatedProducts[index]?.price || 0),
    };
    
    setValue('productDetails.products', updatedProducts);
    calculateTotals(updatedProducts);
  };

  const handlePriceChange = (index: number, price: number) => {
    const currentProducts = getValues('productDetails.products');
    const updatedProducts = [...currentProducts];
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      price: price,
      netAmount: (updatedProducts[index]?.qty || 0) * price,
    };
    
    setValue('productDetails.products', updatedProducts);
    calculateTotals(updatedProducts);
  };

  const calculateTotals = (products: InvoiceEntryInterface['productDetails']['products']) => {
    const netTotal = products.reduce((sum, product) => sum + (product.netAmount ?? 0), 0);
    const gstAmount = netTotal * 0.1; // 10% GST
    
    setValue('netTotal', netTotal);
    setValue('gstAmount', gstAmount);
  };

  const addProduct = () => {
    const currentProducts = getValues('productDetails.products');
    const newProduct = {
      product: '',
      market: '',
      marketDesc: '',
      depot: '',
      depotName: '',
      uom: '',
      qty: 0,
      price: 0,
      netAmount: 0,
      dateShipped: new Date().toISOString().split('T')[0],
      gst: 0,
    };
    
    setValue('productDetails.products', [...currentProducts, newProduct]);
  };

  const removeProduct = (index: number) => {
    const currentProducts = getValues('productDetails.products');
    const updatedProducts = currentProducts.filter((_, i) => i !== index);
    setValue('productDetails.products', updatedProducts);
    calculateTotals(updatedProducts);
  };

  // Initialize with one product if empty
  useEffect(() => {
    if (products.length === 0) {
      addProduct();
    }
  }, []);

  return (
    <Box className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Heading size="4">Product Details</Heading>
        <button
          type="button"
          onClick={addProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border border-gray-300 min-w-[300px]">Product</th>
              <th className="p-3 text-left border border-gray-300 min-w-[120px]">Market</th>
              <th className="p-3 text-left border border-gray-300 min-w-[150px]">Depot</th>
              <th className="p-3 text-left border border-gray-300 min-w-[80px]">UOM</th>
              <th className="p-3 text-left border border-gray-300 min-w-[100px]">QTY</th>
              <th className="p-3 text-left border border-gray-300 min-w-[100px]">Price</th>
              <th className="p-3 text-left border border-gray-300 min-w-[100px]">Net Amount</th>
              <th className="p-3 text-left border border-gray-300 min-w-[140px]">Date Shipped</th>
              <th className="p-3 text-left border border-gray-300 min-w-[100px]">GST</th>
              <th className="p-3 text-center border border-gray-300 min-w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`product-${index}-${product.product || 'new'}`} className="border-b hover:bg-gray-50">
                <td className="p-3 border border-gray-300">
                  <FormInputAutoCompleteVirtualized
                    name={`productDetails.products.${index}.product`}
                    label=""
                    options={getCustomerProducts().map(p => ({
                      label: `${p.catlogCode} - ${p.description}`,
                      value: p.catlogCode,
                    }))}
                    searchPlaceholder="Select product..."
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.marketDesc`}
                    readOnly
                    placeHolder="Market"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.depotName`}
                    readOnly
                    placeHolder="Depot"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.uom`}
                    readOnly
                    placeHolder="UOM"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.qty`}
                    type="number"
                    placeHolder="0"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.price`}
                    type="number"
                    placeHolder="0.00"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.netAmount`}
                    type="number"
                    readOnly
                    placeHolder="0.00"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.dateShipped`}
                    type="date"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <FormInput
                    label=""
                    name={`productDetails.products.${index}.gst`}
                    type="number"
                    placeHolder="0.00"
                  />
                </td>
                <td className="p-3 border border-gray-300 text-center">
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-start-2">
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">GST Amount:</span>
              <div className="w-24 text-right">
                <FormInput
                  label=""
                  name="gstAmount"
                  type="number"
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-bold">Net Total:</span>
              <div className="w-24 text-right font-bold">
                <FormInput
                  label=""
                  name="netTotal"
                  type="number"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default InvoiceEntryFormProducts;