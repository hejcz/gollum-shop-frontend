import { get } from "svelte/store";
import { access_token, api_url as url } from "../stores";
import type {
  Api,
  AssignedToUser,
  Campaign,
  CampaignCandidate,
  CampaignsSearchParams,
  CampaignUpdate,
  Order,
  OrderedItem,
  User,
} from "./Api";

const api_url = get(url);

function backend_campaign_to_frontend_campaign(campaign: any): Campaign {
  // items?
  return {
    uuid: campaign.id + "",
    title: campaign.name,
    img_url: campaign.photo,
    locked: !campaign.active,
    items: [],
    url: campaign.url,
  };
}

export class RestApi implements Api {
  fetchCampaignOrders(
    campaign_uuid: string
  ): Promise<(Order & AssignedToUser)[]> {
    throw new Error("Method not implemented.");
  }

  fetchUserOrders(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }

  fetchOrder(order_uuid: string): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  updatePaidAmount(order: Order & AssignedToUser): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  fetchCampaign(uuid: string): Promise<Campaign> {
    throw new Error("Method not implemented.");
  }

  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  updateCampaign(update: CampaignUpdate): Promise<Campaign> {
    throw new Error("Method not implemented.");
  }

  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]> {
    return (async () => {
      const response = await fetch(api_url + "campaigns", options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_campaign_to_frontend_campaign);
      }
    })();
  }

  lockCampaign(uuid: string): Promise<Campaign> {
    throw new Error("Method not implemented.");
  }

  unlockCampaign(uuid: string): Promise<Campaign> {
    throw new Error("Method not implemented.");
  }

  fetchCampaignCandidate(uuid: string): Promise<CampaignCandidate> {
    throw new Error("Method not implemented.");
  }

  fetchCampaignCandidates(titleLike: string): Promise<CampaignCandidate[]> {
    throw new Error("Method not implemented.");
  }

  likeCandidate(uuid: string): Promise<CampaignCandidate> {
    throw new Error("Method not implemented.");
  }

  unlikeCandidate(uuid: string): Promise<CampaignCandidate> {
    throw new Error("Method not implemented.");
  }

  fetchUsers(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  activateUser(user_uuid: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  deactivateUser(user_uuid: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}

function options(method): RequestInit {
  return {
    method,
    mode: "cors",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + get(access_token),
    },
  };
}
