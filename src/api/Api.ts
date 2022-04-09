import { environment } from "../environment";
import { MockApi } from "./mock_api";

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

export interface CampaignCandidate {
  // game title
  title: string;
  // url to the campaign
  url?: string;
  // nicknames of users who liked this candidate
  liking_users: string[];
}

export interface CampaignsSearchParams {
  active?: boolean;
  titleLike?: string;
  uuids?: string[];
}

export interface Api {
  fetchCampaignOrders(
    campaign_uuid: string
  ): Promise<(Order & AssignedToUser)[]>;
  fetchUserOrders(): Promise<Order[]>;
  fetchOrder(order_uuid: string): Promise<Order>;
  updatePaidAmount(order: Order & AssignedToUser): Promise<Order>;
  fetchCampaign(uuid: string): Promise<Campaign>;
  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order>;
  updateCampaign(campaign: Campaign): Promise<Campaign>;
  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]>;
  lockCampaign(uuid: string): Promise<Campaign>;
  unlockCampaign(uuid: string): Promise<Campaign>;
  fetchCampaignCandidates(
    titleLike: string | null
  ): Promise<CampaignCandidate[]>;
}

export const api: Api = ["local", "github"].includes(environment())
  ? new MockApi()
  : null;
