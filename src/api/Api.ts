import { RestApi } from "./rest_api";

export interface CampaignItem {
  ordinal: number;
  name: string;
  price: number;
  uuid: string;
}

export interface Campaign {
  uuid: string;
  title: string;
  img_url: string;
  url: string;
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
  uuid: string;
  title: string;
  url: string;
  img_url: string;
  liking_users: string[];
}

export interface CampaignsSearchParams {
  active?: boolean;
  titleLike?: string;
  uuids?: string[];
}

export interface CampaignUpdate {
  campaign: Campaign;
  candidate_uuid?: string;
}

export interface User {
  uuid: string;
  username: string;
  activated: boolean;
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
  updateCampaign(update: CampaignUpdate): Promise<Campaign>;
  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]>;
  lockCampaign(uuid: string): Promise<Campaign>;
  unlockCampaign(uuid: string): Promise<Campaign>;
  fetchCampaignCandidate(uuid: string): Promise<CampaignCandidate>;
  fetchCampaignCandidates(
    titleLike: string | null
  ): Promise<CampaignCandidate[]>;
  likeCandidate(uuid: string): Promise<CampaignCandidate>;
  unlikeCandidate(uuid: string): Promise<CampaignCandidate>;
  fetchUsers(): Promise<User[]>;
  activateUser(user_uuid: string): Promise<User>;
  deactivateUser(user_uuid: string): Promise<User>;
}

export const api: Api = new RestApi()
