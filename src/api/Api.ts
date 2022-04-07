import { user } from "../stores";
import { delay } from "../utils/delay";
import data from "./data";

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

let userInfo: string = null;
user.subscribe((u) => (userInfo = u));

function mutateCampaign(uuid: string, mutator: (c: Campaign) => void): void {
  const campaign = data.campaigns.find((c) => c.uuid === uuid);
  if (campaign != null) {
    mutator(campaign);
  }
}

export async function fetchCampaign(uuid: string): Promise<Campaign> {
  const campaign = data.campaigns.find((c) => c.uuid === uuid);
  if (campaign == null) {
    return Promise.reject("no such campaign");
  } else {
    return Promise.resolve(JSON.parse(JSON.stringify(campaign)));
  }
}

export async function fetchOrders(
  uuid: string
): Promise<(Order & AssignedToUser)[]> {
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
  return Promise.resolve(JSON.parse(JSON.stringify(orders)));
}

export async function updatePaidAmount(
  order: Order & AssignedToUser
): Promise<Order> {
  await delay(2000);
  const index = data.orders[order.username].findIndex(
    (o) => o.campaign_uuid === order.campaign_uuid
  );
  data.orders[order.username][index] = { ...order };
  return Promise.resolve(
    JSON.parse(JSON.stringify(data.orders[order.username][index]))
  );
}

export async function fetchOrder(uuid: string): Promise<Order> {
  const order: Order = data.orders[userInfo]?.find(
    (o) => o.campaign_uuid === uuid
  ) ?? { campaign_uuid: uuid, items: [], paid_amount: 0 };
  return Promise.resolve(JSON.parse(JSON.stringify(order)));
}

export async function orderCampaign(
  uuid: string,
  items: OrderedItem[]
): Promise<Order> {
  await delay(2000);
  if (data.orders[userInfo] == null) {
    data.orders[userInfo] = [];
  }
  const orders: Order[] = data.orders[userInfo];
  let order: Order | undefined = orders?.find((o) => o.campaign_uuid === uuid);
  if (order == null) {
    order = { campaign_uuid: uuid, items: items, paid_amount: 0 };
    orders.push(order);
  }
  order.items = items;
  return Promise.resolve({ ...order });
}

export async function updateCampaign(campaign: Campaign): Promise<Campaign> {
  await delay(2000);
  const index = data.campaigns.findIndex((c) => c.uuid === campaign.uuid);
  if (index === -1) {
    data.campaigns.push(campaign);
  } else {
    data.campaigns[index] = campaign;
  }
  return Promise.resolve({ ...campaign });
}

export async function fetchActiveCampaigns(
  titleLike: string | null = null
): Promise<Campaign[]> {
  return Promise.resolve(
    JSON.parse(
      JSON.stringify(
        data.campaigns.filter(
          (c) =>
            !c.locked &&
            (titleLike == null ||
              titleLike.length === 0 ||
              c.title.toLowerCase().includes(titleLike.toLowerCase()))
        )
      )
    )
  );
}

export async function lockCampaign(uuid: string): Promise<Campaign> {
  mutateCampaign(uuid, (c) => (c.locked = true));
  return fetchCampaign(uuid);
}

export async function unlockCampaign(uuid: string): Promise<Campaign> {
  mutateCampaign(uuid, (c) => (c.locked = false));
  return fetchCampaign(uuid);
}
