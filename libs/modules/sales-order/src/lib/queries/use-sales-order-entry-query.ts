import { SalesOrderMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useQuery } from '@tanstack/react-query';
import { SalesOrderFormSchemaApiType, SalesOrderFormSchemaType } from '../schema';
import { useCustomerDetailsQuery } from './use-customer-details-query';
import { useMemo } from 'react';


interface SalesOrderApiResponse {
  orderHeader: {
    sOrderNo: number;
    status: string;
    statusName: string;
    custCode: string;
    custOrderNo: string;
    orderDate: string;
    carrierCode: string;
    reason: string;
    version: number;
    contractNo?: number;
  };
  orderDetailList: Array<{
    catlogCode: string;
    depotCode: string;
    market: string;
    marketDesc: string;
    orderQty: number;
    price: number;
    netAmount: number;
    dateRequired: string;
    dateDespatched: string;
    payPeriodCode: number;
    uom: string;
    dow: string;
    interval: string;
    plistNo: number;
  }>;
  requestCreatedDateTime: string;
  specialInst: string;
  assigneeNo: number;
  isOneOff: boolean;
  isStanding: boolean;
}

const fetchSalesOrderFormData = async (salesOrderId: number): Promise<SalesOrderApiResponse> => {
  const response = await getAxiosInstance().get<SalesOrderApiResponse>(`orders/${salesOrderId}`);
  return response.data;
};

export const useSalesOrderFormQuery = (salesOrderId: number) => {
  const { masterData } = useStoreSelector(STORE.SalesOrder);

  // First fetch the sales order data
  const salesOrderQuery = useQuery<SalesOrderApiResponse, Error>({
    queryKey: ['sales-order-entry-query', salesOrderId],
    queryFn: () => fetchSalesOrderFormData(salesOrderId),
    enabled: !!salesOrderId,
    staleTime: 0,
    retryDelay: 1000,
  });

  // Then fetch the customer details if we have the customer code
  const customerDetailsQuery = useCustomerDetailsQuery(
    salesOrderQuery.data?.orderHeader.custCode || null
  );

  // Transform the data once we have both sales order and customer details
  const transformedData: SalesOrderFormSchemaType | undefined = useMemo(() => {
    if (!salesOrderQuery.data) return undefined;

    const data = salesOrderQuery.data;
    const customerDetails = customerDetailsQuery.data;

    // Find the matching address from addressList using assigneeNo from order
    let addressData = null;
    if (customerDetails?.addressList && data.assigneeNo) {
      addressData = customerDetails.addressList.find(addr => addr.assigneeNo === data.assigneeNo);
    }
    
    // If no matching address found in addressList, fallback to streetAddress
    if (!addressData && customerDetails?.streetAddress) {
      addressData = customerDetails.streetAddress;
    }

    // Get customer name from either streetAddress or customerDetails
    const customerName = customerDetails?.streetAddress?.name || addressData?.name || data.orderHeader.custCode;

    // Extract orderTypeVal logic to a separate variable
    let orderTypeVal = 'Auto Generated';
    if (data.isStanding) {
      orderTypeVal = 'Standing Order';
    } else if (data.isOneOff) {
      orderTypeVal = 'One-Off';
    }

    return {
      orderDetails: {
        orderNo: data.orderHeader.sOrderNo.toString(),
        status: data.orderHeader.statusName || data.orderHeader.status,
        customerCode: {
          label: `${data.orderHeader.custCode} - ${customerName}`,
          value: data.orderHeader.custCode,
        },
        dateOrdered: data.orderHeader.orderDate,
        customerOrderNo: data.orderHeader.custOrderNo.trim(),
        orderType: data.isStanding ? 'STAN' : 'ONOF',
        orderTypeVal: orderTypeVal,
        plistNo: data.orderDetailList[0]?.plistNo?.toString() || '',
        contractNo: data.orderHeader.contractNo?.toString() || '',
      },
      customerDetails: {
        contact: addressData?.contact?.trim() || '',
        telephone: addressData?.telephone?.trim() || '',
        fax: addressData?.fax?.trim() || '',
        bdm: customerDetails?.customerDetails?.repName || '',
        crStatus: customerDetails?.customerDetails?.creditStatus || '',
      },
      addressDetails: {
        address1: addressData?.address1 || '',
        address2: addressData?.address2 || '',
        city: addressData?.city || '',
        state: addressData?.state || '',
        postalCode: addressData?.postcode || '',
      },
      carrierDetails: {
        carrier: data.orderHeader.carrierCode.trim() ? { label: data.orderHeader.carrierCode.trim(), value: data.orderHeader.carrierCode.trim() } : { label: '', value: '' },
        reason: data.orderHeader.reason,
        specialInstruction: data.specialInst,
      },
      productDetails: {
        product: '',
        price: 0,
        interval: '',
        dateRequired: '',
        uom: '',
        dow: '',
        market: '',
        depot: '',
        qty: 0,
        netAmt: 0,
        products: data.orderDetailList.map((product) => {
          // Find matching product in customer price list to get additional details
          const priceListItem = customerDetails?.customerPriceList?.find((item) => item.catlogCode.trim() === product.catlogCode.trim());

          return {
            product: product.catlogCode.trim(),
            price: product.price,
            interval: product.payPeriodCode || undefined,
            dateRequired: product.dateRequired || '',
            uom: priceListItem?.uomOrder || product.uom || '',
            // Calculate DOW from dateRequired
            dow: product.dateRequired ? new Date(product.dateRequired).toLocaleDateString('en-US', { weekday: 'long' }) : '',
            //market: product.market || customerDetails?.customerDetails?.custMarket || '',
            //marketDesc: product.marketDesc || customerDetails?.customerDetails?.custMarket || '',
            market: product.market || priceListItem?.market || '',
            marketDesc: priceListItem?.marketDesc || '',
            depot: product.depotCode || (customerDetails?.customerDetails?.depotName || '').split(' - ')[0] || '',
            qty: product.orderQty || 0,
            netAmt: product.netAmount || 0,
            description: priceListItem?.description || undefined,
            brand: priceListItem?.brand || undefined,
            plistNo: product.plistNo || undefined,
          };
        }),
      },
    };
  }, [salesOrderQuery.data, customerDetailsQuery.data]);
  return {
    salesOrderData: transformedData,
    rawApiData: salesOrderQuery.data as SalesOrderApiResponse | undefined,
    error: salesOrderQuery.error || customerDetailsQuery.error,
    isLoading: salesOrderQuery.isLoading || customerDetailsQuery.isLoading,
    isFetching: salesOrderQuery.isFetching || customerDetailsQuery.isFetching,
    refetch: () => {
      salesOrderQuery.refetch();
      customerDetailsQuery.refetch();
    },
  };
}; 