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
  return {
    uuid: campaign.uuid,
    title: campaign.name,
    img_url: campaign.photo,
    locked: !campaign.active,
    items: campaign.items?.map((i, index) => ({
      uuid: i.id + "",
      ordinal: index,
      name: i.name,
      price: 5,
    })),
    url: campaign.url,
  };
}

function backend_draft_to_frontend_draft(draft: any): CampaignCandidate {
  return {
    uuid: draft.uuid,
    title: draft.name || draft.campaign_name,
    img_url: draft.photo,
    url: draft.url,
    // todo - Piotr should fix it soon
    liking_users: draft?.liking_users?.filter(it => it != null)
  };
}

function backend_user_to_frontend_user(user: any): User {
  return {
    uuid: user.id + "",
    activated: user.active,
    username: user.username
  };
}

function backend_orders_to_frontend_orders(orders: any): Order {
  return {
    campaign_uuid: orders.campaign_uuid,
    paid_amount: 0,
    items: orders.items?.map(i => ({
      item_uuid: i.pledge_id + "",
      amount: i.amount
    }))
  }
}

export class RestApi implements Api {
  addCandidate(draft: CampaignCandidate): Promise<CampaignCandidate> {
    throw new Error("Method not implemented.");
  }

  fetchCampaignOrders(
    campaign_uuid: string
  ): Promise<(Order & AssignedToUser)[]> {
    return (async () => {
      const response = await fetch(api_url + "campaigns/" + campaign_uuid + "/orders", options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_orders_to_frontend_orders);
      }
    })();
  }

  fetchUserOrders(): Promise<Order[]> {
    return (async () => {
      const response = await fetch(api_url + "orders", options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_orders_to_frontend_orders);
      }
    })();
  }

  fetchOrder(order_uuid: string): Promise<Order> {
    return (async () => {
      const response = await fetch(api_url + "orders/" + order_uuid, options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_orders_to_frontend_orders);
      }
    })();
  }

  updatePaidAmount(order: Order & AssignedToUser): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  fetchCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const response = await fetch(api_url + "campaigns/" + uuid, options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_campaign_to_frontend_campaign);
      }
    })();
  }

  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  updateCampaign(update: CampaignUpdate): Promise<Campaign> {
    throw new Error("Method not implemented.");
  }

  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]> {
    const fetch_params = new URLSearchParams()
    if (params.active) {
      fetch_params.set("active", "true")
    } else {
      fetch_params.set("active", "false")
    }
    if (params.titleLike) {
      fetch_params.set("like", params.titleLike)
    }
    if (params.uuids) {
      for (let uuid of params.uuids) {
        fetch_params.append("id", uuid)
      }
    }
    return (async () => {
      const response = await fetch(api_url + "campaigns?" + fetch_params.toString(), options("GET"));
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
    return (async () => {
      const response = await fetch(api_url + "campaigns/" + uuid, options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return backend_draft_to_frontend_draft(response_json);
      }
    })();
  }

  fetchCampaignCandidates(titleLike: string): Promise<CampaignCandidate[]> {
    const fetch_params = new URLSearchParams()
    fetch_params.set("draft", "true")
    fetch_params.set("active", "false")
    if (titleLike) {
      fetch_params.set("like", titleLike)
    }
    return (async () => {
      const response = await fetch(api_url + "campaigns?" + fetch_params.toString(), options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_draft_to_frontend_draft);
      }
    })();
  }

  likeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const response = await fetch(api_url + "campaigns/" + uuid + "/like", options("PUT"));
      if (response.ok) {
        // TODO api does not return candidate but we fetch all drafts anyway
        return null
      }
    })();
  }

  unlikeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const response = await fetch(api_url + "campaigns/" + uuid + "/like", options("DELETE"));
      if (response.ok) {
        // TODO api does not return candidate but we fetch all drafts anyway
        return null
      }
    })();
  }

  fetchUsers(): Promise<User[]> {
    return (async () => {
      const response = await fetch(api_url + "users", options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_user_to_frontend_user);
      }
    })();
  }

  activateUser(user_uuid: string): Promise<User> {
    return (async () => {
      const response = await fetch(api_url + "users/" + user_uuid, options("PATCH", {active: true}));
      if (response.ok) {
        const response_json = await response.json();
        return {
          ...backend_user_to_frontend_user(response_json),
          uuid: user_uuid
        };
      }
    })();
  }

  deactivateUser(user_uuid: string): Promise<User> {
    return (async () => {
      const response = await fetch(api_url + "users/" + user_uuid, options("PATCH", {active: false}));
      if (response.ok) {
        const response_json = await response.json();
        return {
          ...backend_user_to_frontend_user(response_json),
          uuid: user_uuid
        };
      }
    })();
  }
}

function options(method, body = null): RequestInit {
  return {
    method,
    mode: "cors",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + get(access_token),
    },
    body: body == null ? null : JSON.stringify(body)
  };
}
