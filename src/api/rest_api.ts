import { get } from "svelte/store";
import { access_token, api_url as url, user_uuid } from "../stores";
import type {
  Api,
  AssignedToUser,
  Campaign,
  CampaignCandidate,
  CampaignsSearchParams,
  CampaignUpdate,
  Order,
  OrderUpdate,
  User,
} from "./Api";

const api_url = get(url);

function backend_campaign_to_frontend_campaign(campaign: any): Campaign {
  return {
    uuid: campaign.uuid,
    title: campaign.name,
    img_url: campaign.img_url,
    locked: !campaign.active,
    items: campaign.items?.map((i, index) => ({
      uuid: i.uuid,
      ordinal: i.ordinal,
      name: i.name,
      price: i.price,
    })),
    url: campaign.url,
  };
}

function backend_draft_to_frontend_draft(draft: any): CampaignCandidate {
  return {
    uuid: draft.uuid,
    title: draft.name || draft.campaign_name,
    img_url: draft.img_url,
    url: draft.url,
    // todo - Piotr should fix it soon
    liking_users: draft?.liking_users?.filter((it) => it != null),
  };
}

function backend_user_to_frontend_user(user: any): User {
  return {
    uuid: user.uuid,
    activated: user.active,
    username: user.username,
  };
}

function backend_order_to_frontend_order(order: any): Order {
  return {
    campaign_uuid: order.uuid,
    paid_amount: Number.parseInt(order.paid_amount),
    items: order.items?.map((i) => ({
      item_uuid: i.uuid,
      amount: Number.parseInt(i.amount),
    })),
  };
}

export class RestApi implements Api {
  addCandidate(draft: CampaignCandidate): Promise<CampaignCandidate> {
    return (async () => {
      const payload = { ...draft };
      payload["draft"] = true;
      const response = await fetch(
        api_url + "campaigns",
        options("POST", payload)
      );
      if (response.ok) {
        const response_json = await response.json();
        return backend_draft_to_frontend_draft(response_json);
      }
    })();
  }

  fetchCampaignOrders(
    campaign_uuid: string
  ): Promise<(Order & AssignedToUser)[]> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + campaign_uuid + "/orders",
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        const results = [];
        for (let username in response_json) {
          results.push({
            username,
            ...backend_order_to_frontend_order(response_json[username]),
          });
        }
        return results;
      }
    })();
  }

  fetchUserOrders(): Promise<Order[]> {
    return (async () => {
      const response = await fetch(api_url + "orders", options("GET"));
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_order_to_frontend_order);
      }
    })();
  }

  fetchOrder(campaign_uuid: string): Promise<Order> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + campaign_uuid + "/order",
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        if (response_json.uuid == null) {
          return null;
        }
        return backend_order_to_frontend_order(response_json);
      }
    })();
  }

  updatePaidAmount(order: Order & AssignedToUser): Promise<Order> {
    return (async () => {
      const payload = {
        paid_amount: order.paid_amount,
        campaign_uuid: order.campaign_uuid,
      };
      const response = await fetch(
        api_url + "campaigns/" + order.campaign_uuid + "/order",
        options("PATCH", payload)
      );
      if (response.ok) {
        const response_json = await response.json();
        return backend_order_to_frontend_order(response_json.result[0]);
      }
    })();
  }

  fetchCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + uuid,
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        if (response_json.length > 0) {
          return backend_campaign_to_frontend_campaign(response_json[0]);
        }
      }
    })();
  }

  orderCampaign(campaign_uuid: string, update: OrderUpdate): Promise<Order> {
    return (async () => {
      const payload = {
        items: update.items.map((it) => ({
          pledge_id: it.item_uuid,
          amount: it.amount,
        })),
      };
      const response = update.is_new
        ? await fetch(
            api_url + "campaigns/" + campaign_uuid + "/order",
            options("POST", payload)
          )
        : await fetch(
            api_url + "campaigns/" + campaign_uuid + "/order",
            options("PATCH", payload)
          );
      if (response.ok) {
        const response_json = await response.json();
        return backend_order_to_frontend_order(response_json.result[0]);
      }
    })();
  }

  updateCampaign(update: CampaignUpdate): Promise<Campaign> {
    return (async () => {
      const payload = { ...update.campaign };
      if (update.is_new) {
        payload["uuid"] = update.candidate_uuid ?? null;
      }
      payload["draft"] = false;
      payload["active"] = !update.campaign.locked;
      const response =
        update.is_new && update.candidate_uuid == null
          ? await fetch(api_url + "campaigns", options("POST", payload))
          : await fetch(api_url + "campaigns", options("PATCH", payload));
      if (response.ok) {
        const response_json = await response.json();
        return backend_campaign_to_frontend_campaign(response_json.result[0]);
      }
    })();
  }

  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]> {
    const fetch_params = new URLSearchParams();
    fetch_params.set("draft", "false");
    if (params.active == null) {
    } else if (params.active) {
      fetch_params.set("active", "true");
    } else {
      fetch_params.set("active", "false");
    }
    if (params.titleLike) {
      fetch_params.set("name", params.titleLike);
    }
    if (params.uuids) {
      for (let uuid of params.uuids) {
        fetch_params.append("id", uuid);
      }
    }
    return (async () => {
      const response = await fetch(
        api_url + "campaigns?" + fetch_params.toString(),
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_campaign_to_frontend_campaign);
      }
    })();
  }

  lockCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns",
        options("PATCH", { active: false, draft: false, archived: true, uuid })
      );
      if (response.ok) {
        const response_json = await response.json();
        if (response_json.result.length > 0) {
          return backend_campaign_to_frontend_campaign(response_json.result[0]);
        }
      }
    })();
  }

  unlockCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns",
        options("PATCH", { active: true, draft: false, archived: false, uuid })
      );
      if (response.ok) {
        const response_json = await response.json();
        if (response_json.result.length > 0) {
          return backend_campaign_to_frontend_campaign(response_json.result[0]);
        }
      }
    })();
  }

  fetchCampaignCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + uuid,
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        if (response_json.length > 0) {
          return backend_draft_to_frontend_draft(response_json[0]);
        }
      }
    })();
  }

  fetchCampaignCandidates(titleLike: string): Promise<CampaignCandidate[]> {
    const fetch_params = new URLSearchParams();
    fetch_params.set("draft", "true");
    fetch_params.set("active", "false");
    if (titleLike) {
      fetch_params.set("name", titleLike);
    }
    return (async () => {
      const response = await fetch(
        api_url + "campaigns?" + fetch_params.toString(),
        options("GET")
      );
      if (response.ok) {
        const response_json = await response.json();
        return response_json.map(backend_draft_to_frontend_draft);
      }
    })();
  }

  likeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + uuid + "/like",
        options("PUT")
      );
      if (response.ok) {
        // TODO api does not return candidate but we fetch all drafts anyway
        return null;
      }
    })();
  }

  unlikeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const response = await fetch(
        api_url + "campaigns/" + uuid + "/like",
        options("DELETE")
      );
      if (response.ok) {
        // TODO api does not return candidate but we fetch all drafts anyway
        return null;
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
      const response = await fetch(
        api_url + "users/" + user_uuid,
        options("PATCH", { active: true })
      );
      if (response.ok) {
        const response_json = await response.json();
        return {
          ...backend_user_to_frontend_user(response_json),
          uuid: user_uuid,
        };
      }
    })();
  }

  deactivateUser(user_uuid: string): Promise<User> {
    return (async () => {
      const response = await fetch(
        api_url + "users/" + user_uuid,
        options("PATCH", { active: false })
      );
      if (response.ok) {
        const response_json = await response.json();
        return {
          ...backend_user_to_frontend_user(response_json),
          uuid: user_uuid,
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
    body: body == null ? null : JSON.stringify(body),
  };
}
