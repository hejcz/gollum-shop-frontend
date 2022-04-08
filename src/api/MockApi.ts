import { get } from "svelte/store";
import { user } from "../stores";
import type { Api, AssignedToUser, Campaign, Order, OrderedItem } from "./Api";
import data from "./data";

function mutateCampaign(uuid: string, mutator: (c: Campaign) => void): void {
  const campaign = data.campaigns.find((c) => c.uuid === uuid);
  if (campaign != null) {
    mutator(campaign);
  }
}

export class MockApi implements Api {
  fetchCampaign(uuid: string): Promise<Campaign> {
    return (async () => {
      const campaign = data.campaigns.find((c) => c.uuid === uuid);
      if (campaign == null) {
        return Promise.reject("no such campaign");
      } else {
        return Promise.resolve(JSON.parse(JSON.stringify(campaign)));
      }
    })();
  }

  fetchOrders(uuid: string): Promise<(Order & AssignedToUser)[]> {
    return (async () => {
      const orders = [];
      for (const user in data.orders) {
        const order: Order = data.orders[user]?.find(
          (o) => o.campaign_uuid === uuid
        );
        if (order == null) {
          continue;
        }
        orders.push({ username: user, ...order });
      }
      return JSON.parse(JSON.stringify(orders));
    })();
  }

  updatePaidAmount(order: Order & AssignedToUser): Promise<Order> {
    return (async () => {
      const index = data.orders[order.username].findIndex(
        (o) => o.campaign_uuid === order.campaign_uuid
      );
      data.orders[order.username][index] = { ...order };
      return JSON.parse(JSON.stringify(data.orders[order.username][index]));
    })();
  }

  fetchOrder(uuid: string): Promise<Order> {
    return (async () => {
      const order: Order = data.orders[get(user)]?.find(
        (o) => o.campaign_uuid === uuid
      ) ?? { campaign_uuid: uuid, items: [], paid_amount: 0 };
      return JSON.parse(JSON.stringify(order));
    })();
  }

  orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order> {
    return (async () => {
      const username = get(user);
      if (data.orders[username] == null) {
        data.orders[username] = [];
      }
      const orders: Order[] = data.orders[username];
      let order: Order | undefined = orders?.find(
        (o) => o.campaign_uuid === uuid
      );
      if (order == null) {
        order = { campaign_uuid: uuid, items: items, paid_amount: 0 };
        orders.push(order);
      }
      order.items = items;
      return { ...order };
    })();
  }

  updateCampaign(campaign: Campaign): Promise<Campaign> {
    return (async () => {
      const index = data.campaigns.findIndex((c) => c.uuid === campaign.uuid);
      if (index === -1) {
        data.campaigns.push(campaign);
      } else {
        data.campaigns[index] = campaign;
      }
      return { ...campaign };
    })();
  }

  fetchCampaigns(active: boolean, titleLike: string): Promise<Campaign[]> {
    return (async () => {
      const campaigns = data.campaigns.filter(
        (c) =>
          (active ? !c.locked : c.locked) &&
          (titleLike == null ||
            titleLike.length === 0 ||
            c.title.toLowerCase().includes(titleLike.toLowerCase()))
      );
      campaigns.sort((a, b) =>
        a.title < b.title ? -1 : a.title === b.title ? 0 : 1
      );
      return JSON.parse(JSON.stringify(campaigns));
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
