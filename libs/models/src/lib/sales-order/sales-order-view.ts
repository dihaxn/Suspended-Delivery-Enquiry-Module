export interface orderHeader{
    sOrderNo: number;
    custCode: string;
    customerName: string;
    orderDate: string;
    statusName: string;
    status: string;
    custOrderNo: string;
    carrierCode: string;
    reason: string;
}

export interface orderDetail{
    pListNo: number;
    catlogCode: string;
    catlogName: string;
    depotName: string;
    market: string;
    marketDesc: string;
    uomOrder: string;
    price: number;
    netAmount: number;
    payPeriodCode: number;
    dateRequired: string;
    dateDispatched: string;
    orderQty: number;
    repName: string;
}


export interface SalesOrderView{
    specialInst: string;
    isOneOff: boolean;
    isStanding: boolean;
    assigneeNo: number;
    orderHeader: orderHeader;
    orderDetailList: orderDetail[];

}
 