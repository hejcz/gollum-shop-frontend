import { MockApi } from "./mock_api";
import { RestApi } from "./rest_api";

export interface CampaignItem {
  ordinal: number;
  name: string;
  price: number;
  // null for new items. Server should always send not null value.
  uuid?: string;
}

export enum CampaignStatus {
  // open for new orders
  ACTIVE,
  // not delivered and closed for new orders
  CLOSED,
  // a proposal from users
  DRAFT,
  // delivered
  ARCHIVED,
}

export interface Campaign {
  uuid: string;
  title: string;
  img_url: string;
  url: string;
  items: CampaignItem[];
  status: CampaignStatus;
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

export interface OrderUpdate {
  items: OrderedItem[];
  is_new: boolean;
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
  status?: CampaignStatus;
  titleLike?: string;
  uuids?: string[];
}

export interface CampaignUpdate {
  campaign: Campaign;
  candidate_uuid?: string;
  is_new: boolean;
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
  orderCampaign(uuid: string, items: OrderUpdate): Promise<Order>;
  updateCampaign(update: CampaignUpdate): Promise<Campaign>;
  addCandidate(draft: CampaignCandidate): Promise<CampaignCandidate>;
  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]>;
  changeStatus(uuid: string, newStatus: CampaignStatus): Promise<Campaign>;
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

export const api: Api = new RestApi();
