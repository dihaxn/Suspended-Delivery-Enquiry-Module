import { z } from 'zod';


const dateField = (message: string) =>
  z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .nonempty(message);



// Sales Order Entry Schema
export const salesOrderEntrySchema = z
  .object({
    actionType: z.string().optional(),
    orderDetails: z.object({
      orderNo: z.string().optional(),
      status: z.string().optional(),
      customerCode: z.object({
        label: z.string(),
        value: z.string(),
      }).refine(
        (obj) => obj.label.trim() !== '' && obj.value.trim() !== '',
        { message: 'Please select a Customer' }
      ),
      dateOrdered: dateField('Please select the Ordered Date'),
      customerOrderNo: z.string().max(20, ''),
      orderType: z.string(),
      orderTypeVal: z.string().optional(),
      plistNo: z.string().optional(),
      contractNo: z.string().optional(),
    }),
    addressDetails: z.object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
    }),
    customerDetails: z.object({
      contact: z.string().optional(),
      telephone: z.string().optional(),
      repName: z.string().optional(),
      fax: z.string().optional(),
      crStatus: z.string().optional(),
    }),
    carrierDetails: z
      .object({
        carrier: z
          .union([
            z.object({
              label: z.string(),
              value: z.string()
            }).passthrough(),
            z.string(),
          ]),
        reason: z.string().max(99, ''),
        specialInstruction: z.string().max(255, '').optional(),
      }),
    productDetails: z.object({
      products: z
        .array(
          z.object({
            product: z.string(),
            price: z.number().min(0, 'Price must be 0 or greater'),
            interval: z.coerce.number({
              required_error: 'Please enter the Interval',
              invalid_type_error: 'Please enter a valid number for Interval',
            }).min(1, 'Please enter Interval (days)').optional(),
            dateRequired: dateField('Please select the Date Required'),
            uom: z.string().optional(),
            dow: z.string().optional(),
            market: z.string().optional(),
            marketDesc: z.string().optional(),
            depot: z.string().optional(),
            depotName: z.string().optional(),
            qty: z.coerce.number({
              required_error: 'Please enter the Qty',
              invalid_type_error: 'Please enter a valid number for Qty',
            }).min(1, 'Please enter the Qty'),
            netAmt: z.number().min(0, 'Net Amount must be 0 or greater'),
            description: z.string().optional(),
            brand: z.string().optional(),
            plistNo: z.union([z.string(), z.number()]).optional(),
          })
        )
        .min(1, 'Product must be added'),
    }),
  })
  .refine(
    (data) => {
      const carrier = data.carrierDetails.carrier;
      const orderStatus = data.orderDetails?.status;
      const orderId = data.orderDetails?.orderNo;
      
      // Skip validation for existing orders that are not editable
      if (orderId && (orderStatus === 'Printed' || orderStatus === 'On Truck' || orderStatus === 'T' || 
          orderStatus === 'Invoiced' || orderStatus === 'I' || orderStatus === 'Cancelled' || 
          orderStatus === 'Cancel' || orderStatus?.toLowerCase() === 'cancelled')) {
        return true;
      }
      
      // For new orders, always validate carrier selection
      if (!orderId) {
        // Check if carrier is selected at all
        if (!carrier || carrier === '') {
          return false;
        }
        
        // Handle case where carrier might be an empty object (for new orders)
        if (typeof carrier === 'object' && (!carrier.label || carrier.label.trim() === '') && 
            (!carrier.value || carrier.value.trim() === '')) {
          return false;
        }
        
        // Handle string format
        if (typeof carrier === 'string') {
          return carrier.trim() !== '';
        }
        
        // Handle object format - check if either label or value has content
        if (typeof carrier === 'object') {
          const hasLabel = carrier.label && carrier.label.trim() !== '';
          const hasValue = carrier.value && carrier.value.trim() !== '';
          return hasLabel || hasValue;
        }
      }
      
      return true;
    },
    {
      message: 'Carrier must be selected',
      path: ['carrierDetails', 'carrier'],
    }
  )
  
  .refine(
    (data) => {
      const isOneOff = data.orderDetails.orderType === 'ONOF';
      if (isOneOff && (!data.carrierDetails.reason || !data.carrierDetails.reason.trim())) {
        return false;
      }
      return true;
    },
    {
      message: 'Reason must be provided for One-Off orders',
      path: ['carrierDetails', 'reason'],
    }
  )
  .refine(
    (data) => {
      // Skip product validation for standing orders from URL (read-only scenarios)
      const contractNo = String(data.orderDetails?.contractNo || '');
      const orderNo = data.orderDetails?.orderNo;
      const products = data.productDetails?.products;
      
      // If this is a standing order from URL (has contractNo but no orderNo), skip product validation
      if (contractNo && contractNo !== '0' && !orderNo) {
        return true;
      }
      
      // Regular product validation
      if (!products || products.length === 0) {
        return false;
      }
      
      const product = products[0];
      if (!product || !product.product || product.product === '_placeholder_') {
        return false;
      }
      
      return true;
    },
    {
      message: 'Please select a Product',
      path: ['productDetails', 'products', 0, 'product'],
    }
  )
  .refine(
    (data) => {
      const isOneOff = data.orderDetails.orderType === 'ONOF';
      const orderStatus = data.orderDetails?.status;
      const orderId = data.orderDetails?.orderNo;
      const contractNo = String(data.orderDetails?.contractNo || '');
      
      // Skip validation for existing orders that are not editable
      if (orderId && (orderStatus === 'Printed' || orderStatus === 'On Truck' || orderStatus === 'T' || 
          orderStatus === 'Invoiced' || orderStatus === 'I' || orderStatus === 'Cancelled' || 
          orderStatus === 'Cancel' || orderStatus?.toLowerCase() === 'cancelled')) {
        return true;
      }
      
      // Skip validation for standing orders from URL (read-only scenarios)
      if (contractNo && contractNo !== '0' && !orderId) {
        return true;
      }
      
      // For standing orders (non-one-off), interval is required
      if (!isOneOff) {
        const products = data.productDetails?.products;
        if (!products || products.length === 0) {
          return false;
        }
        
        const product = products[0];
        if (!product || !product.interval || product.interval < 1) {
          return false;
        }
      }
      
      return true;
    },
    {
      message: 'Interval is required for Standing Orders',
      path: ['productDetails', 'products', 0, 'interval'],
    }
  )
  .refine(
    (data) => {
      const orderId = data.orderDetails?.orderNo;
      const orderStatus = data.orderDetails?.status;
      const contractNo = String(data.orderDetails?.contractNo || '');
      
      // Skip validation for existing orders that are not editable
      if (orderId && (orderStatus === 'Printed' || orderStatus === 'On Truck' || orderStatus === 'T' || 
          orderStatus === 'Invoiced' || orderStatus === 'I' || orderStatus === 'Cancelled' || 
          orderStatus === 'Cancel' || orderStatus?.toLowerCase() === 'cancelled')) {
        return true;
      }
      
      // Skip validation for standing orders from URL (read-only scenarios)
      if (contractNo && contractNo !== '0' && !orderId) {
        return true;
      }
      
      // Only apply "today or future" validation for new orders (no orderId)
      if (!orderId) {
        const products = data.productDetails?.products;
        if (!products || products.length === 0) {
          return true; // Let other validations handle this
        }
        
        const product = products[0];
        if (!product || !product.dateRequired) {
          return true; // Let other validations handle this
        }
        
        const selectedDate = new Date(product.dateRequired);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          return false;
        }
      }
      
      return true;
    },
  )
  .refine(
    (data) => {
      const orderId = data.orderDetails?.orderNo;
      const orderStatus = data.orderDetails?.status;
      const contractNo = String(data.orderDetails?.contractNo || '');
      
      // Skip validation for existing orders that are not editable
      if (orderId && (orderStatus === 'Printed' || orderStatus === 'On Truck' || orderStatus === 'T' || 
          orderStatus === 'Invoiced' || orderStatus === 'I' || orderStatus === 'Cancelled' || 
          orderStatus === 'Cancel' || orderStatus?.toLowerCase() === 'cancelled')) {
        return true;
      }
      
      // Skip validation for standing orders from URL (read-only scenarios)
      if (contractNo && contractNo !== '0' && !orderId) {
        return true;
      }
      
      // Only apply "today or future" validation for new orders (no orderId)
      if (!orderId) {
        const dateOrdered = data.orderDetails?.dateOrdered;
        if (!dateOrdered) {
          return true; // Let other validations handle this
        }
        
        const selectedDate = new Date(dateOrdered);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          return false;
        }
      }
      
      return true;
    },
  )


export type SalesOrderFormSchemaType = z.infer<typeof salesOrderEntrySchema>;

export interface SalesOrderFormSchemaApiType {
  orderDetails: {
    orderNo?: string;
    status?: string;
    customerCode: { label: string; value: string } | string;
    dateOrdered: string;
    customerOrderNo: string;
    orderType: string;
    orderTypeVal: string;
    pListNo?: string;
    contractNo?: string;
  };
  customerDetails: {
    contact?: string;
    telephone?: string;
    bdm?: string;
    fax?: string;
    crStatus?: string;
  };
  addressDetails: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  carrierDetails?: {
    carrier: string;
    reason?: string;
    specialInstruction?: string;
  };
  productDetails?: {
    product?: string;
    price?: number;
    interval?: string;
    dateRequired?: string;
    uom?: string;
    dow?: string;
    market?: string;
    marketDesc?: string;
    depot?: string;
    qty?: number;
    netAmt?: number;
    products?: Array<{
      product?: string;
      price?: number;
      interval?: string;
      dateRequired?: string;
      uom?: string;
      dow?: string;
      market?: string;
      marketDesc?: string;
      depot?: string;
      depotName?: string;
      qty?: number;
      netAmt?: number;
      brand?: string;
      pListNo?: number;
    }>;
  };
} 