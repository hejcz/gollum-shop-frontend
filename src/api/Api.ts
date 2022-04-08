import { environment } from "../environment";
import { MockApi } from "./MockApi";

export interface CampaignItem {
  name: string;
  price: number;
  uuid: string;
}

export interface Campaign {
  uuid: string;
  title: string;
  img_url?: string;
  url?: string;
  items: CampaignItem[];
  locked: boolean;
}

export interface OrderedItem {
  item_uuid: string;
  amount: number;
}

export interface Order {
  campaign_uuid: string;
  items: OrderedItem[];
  paid_amount: number;
}

export interface AssignedToUser {
  username: string;
}

export interface OrderedCampaign {}

export interface Api {
  fetchCampaign(uuid: string): Promise<Campaign>;
  fetchOrders(uuid: string): Promise<(Order & AssignedToUser)[]>;
  updatePaidAmount(order: Order & AssignedToUser): Promise<Order>;
  fetchOrder(uuid: string): Promise<Order>;
  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order>;
  updateCampaign(campaign: Campaign): Promise<Campaign>;
  fetchCampaigns(
    active: boolean,
    titleLike: string | null
  ): Promise<Campaign[]>;
  lockCampaign(uuid: string): Promise<Campaign>;
  unlockCampaign(uuid: string): Promise<Campaign>;
}

export const api: Api = ["local", "github"].includes(environment())
  ? new MockApi()
  : null;
