import { get } from "svelte/store";
import { user } from "../stores";
import type {
  Api,
  AssignedToUser,
  Campaign,
  CampaignCandidate,
  CampaignsSearchParams,
  Order,
  OrderedItem,
} from "./Api";
import { campaigns, orders } from "./mock_data";

function mutateCampaign(uuid: string, mutator: (c: Campaign) => void): void {
  const campaign = campaigns.find((c) => c.uuid === uuid);
  if (campaign != null) {
    mutator(campaign);
  }
}

export class MockApi implements Api {
  fetchUserOrders(): Promise<Order[]> {
    return (async () => {
      return orders[get(user)] ?? [];
    })();
  }

  fetchCampaignCandidates(titleLike: string): Promise<CampaignCandidate[]> {
    return (async () => {
      return [];
    })();
  }

  fetchCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const campaign = campaigns.find((c) => c.uuid === uuid);
      if (campaign == null) {
        return Promise.reject("no such campaign");
      } else {
        return Promise.resolve(JSON.parse(JSON.stringify(campaign)));
      }
    })();
  }

  fetchCampaignOrders(
    campaign_uuid: string
  ): Promise<(Order & AssignedToUser)[]> {
    return (async () => {
      const fetched_orders = [];
      for (const user in orders) {
        const order: Order = orders[user]?.find(
          (o: Order) => o.campaign_uuid === campaign_uuid
        );
        if (order == null) {
          continue;
        }
        fetched_orders.push({ username: user, ...order });
      }
      return JSON.parse(JSON.stringify(fetched_orders));
    })();
  }

  updatePaidAmount(order: Order & AssignedToUser): Promise<Order> {
    return (async () => {
      const index = orders[order.username].findIndex(
        (o) => o.campaign_uuid === order.campaign_uuid
      );
      orders[order.username][index] = { ...order };
      return JSON.parse(JSON.stringify(orders[order.username][index]));
    })();
  }

  fetchOrder(campaign_uuid: string): Promise<Order> {
    return (async () => {
      const order: Order = orders[get(user)]?.find(
        (o) => o.campaign_uuid === campaign_uuid
      ) ?? { campaign_uuid: campaign_uuid, items: [], paid_amount: 0 };
      return JSON.parse(JSON.stringify(order));
    })();
  }

  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order> {
    return (async () => {
      const username = get(user);
      if (orders[username] == null) {
        orders[username] = [];
      }
      const user_orders: Order[] = orders[username];
      let order: Order | undefined = user_orders?.find(
        (o) => o.campaign_uuid === uuid
      );
      if (order == null) {
        order = { campaign_uuid: uuid, items: items, paid_amount: 0 };
        user_orders.push(order);
      }
      order.items = items;
      return { ...order };
    })();
  }

  updateCampaign(campaign: Campaign): Promise<Campaign> {
    return (async () => {
      const index = campaigns.findIndex((c) => c.uuid === campaign.uuid);
      if (index === -1) {
        campaigns.push(campaign);
      } else {
        campaigns[index] = campaign;
      }
      return { ...campaign };
    })();
  }

  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]> {
    return (async () => {
      const filtered_campaigns = campaigns.filter(
        (c) =>
          (params.active == null || params.active ? !c.locked : c.locked) &&
          (params.titleLike == null ||
            params.titleLike.length === 0 ||
            c.title.toLowerCase().includes(params.titleLike.toLowerCase())) &&
          (params.uuids == null || params.uuids.includes(c.uuid))
      );
      filtered_campaigns.sort((a, b) =>
        a.title < b.title ? -1 : a.title === b.title ? 0 : 1
      );
      return JSON.parse(JSON.stringify(filtered_campaigns));
    })();
  }

  lockCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      mutateCampaign(uuid, (c) => (c.locked = true));
      return this.fetchCampaign(uuid);
    })();
  }

  unlockCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      mutateCampaign(uuid, (c) => (c.locked = false));
      return this.fetchCampaign(uuid);
    })();
  }
}
