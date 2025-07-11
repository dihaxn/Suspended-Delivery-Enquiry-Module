import { InvoiceStatus } from "./invoice-master-data.model";

export interface InvoiceListItem {
  ivceNo: number;
  dateShippedOn: string; // ISO date string
  custCode: string;
  custName: string;
  catlogCode: string;
  description: string;
  repCode: string;
  despQty: number;
  tonnes: number;
  price: number;
  custBusArea: string;
  netAmount: number;
  plistNo: number;
  sorderNo: number;
  carrierCode: string;
  ivceDate: string; // ISO date string
  conNote: string;
  status: keyof typeof InvoiceStatus;
  repName: string;
  market: string;
  depotCode: string;
  batchNum: string;
  assigneeNo: number;
  custOrderNo: string;
  delTime: string;
  ivceType: string;
  marketDesc: string;
  sOrderReason: string;
  createdByName: string;
  sigReason: string;
  overallCount: number;
  invoiceType:string;
  custEmail: string;
}

export interface InvoiceList {
  data: InvoiceListItem[];
  totalRowCount: number;
}

export const defaultInvoiceListItem: InvoiceListItem = {
  ivceNo: 0,
  dateShippedOn: "",
  custCode: "",
  custName: "",
  catlogCode: "",
  description: "",
  repCode: "",
  despQty: 0,
  tonnes: 0,
  price: 0,
  custBusArea: "",
  netAmount: 0,
  plistNo: 0,
  sorderNo: 0,
  carrierCode: "",
  ivceDate: "",
  conNote: "",
  status: "N",
  repName: "",
  market: "",
  depotCode: "",
  batchNum: "",
  assigneeNo: 0,
  custOrderNo: "",
  delTime: "",
  ivceType: "",
  marketDesc: "",
  sOrderReason: "",
  createdByName: "",
  sigReason: "",
  overallCount: 0,
  invoiceType:'',
  custEmail:''
};