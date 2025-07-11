export interface SalesOrderList {
    sOrderNo: number;
    pListNo: number;
    custCode: string;
    customerName: string;
    orderDate: string;
    orderedBy: string;
    orderType: string;
    dateRequired: string;
    dateDispatched: string;
    status: string;
    isOneOff: boolean;
    market: string;
    marketDesc: string;
    depotName: string;
    repCode: string;
    repName: string;
    orderQty: number;
    overallCount: number;
    catlogCode: string;
    catlogDesc: string;
    statusName: string;
}