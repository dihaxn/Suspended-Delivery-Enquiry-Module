export interface SalesOrderFilters {
    duration: string;
    dateFrom: string;
    dateTo: string;
    orderType: string;
    productType: string;
    orderStatus: string;
    checkedOutstandingOrders: boolean;
    parentCustomer: string;
    custGroup: string;
    carrierCode: string;
    originator: string;
    proxyUser: string;
    columnFilters: string;
}

export const DefaultSalesOrderFilters: SalesOrderFilters = {
    duration: 'week',
    dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    dateTo: new Date().toISOString(),
    orderType: 'ONOF',
    productType: 'all',
    orderStatus: 'all',
    checkedOutstandingOrders: false,
    parentCustomer: 'all',
    custGroup: 'all',
    carrierCode: 'All',
    originator: '',
    proxyUser: '',
    columnFilters: ''
};