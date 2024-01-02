import { PurchaseOrderLineItem } from './purchase-order-line-item';
/**
* Report - interface for PurchaseOrder
*/
export interface PurchaseOrder {
  id: number;
  vendorid: number;
  amount: number;
  podate?: string;
  items: PurchaseOrderLineItem[];
}
