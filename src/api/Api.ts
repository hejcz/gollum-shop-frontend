import { user } from "../stores";
import data from "./data";

export interface CampaignItem {
    name: string,
    price: number,
    min_amount?: number,
    uuid: string
}

export interface Campaign {
    uuid: string,
    title: string,
    img_url?: string,
    url?: string,
    likes: string[],
    items: CampaignItem[],
    locked: boolean
}

export interface OrderedItem {
    order_uuid: string,
    amount: number
}

export interface Order {
    campaign_uuid: string,
    items: OrderedItem[],
    paid_amount: number,
}

let userInfo: string = null
user.subscribe(u => userInfo = u);

function mutateCampaign(uuid: string, mutator: (c: Campaign) => void): void {
    const campaign = data.campaigns.find(c => c.uuid === uuid);
    if (campaign != null) {
        mutator(campaign)
    }
}

export async function fetchCampaign(uuid: string): Promise<Campaign> {
    const campaign = data.campaigns.find(c => c.uuid === uuid);
    if (campaign == null) {
        return Promise.reject("no such campaign");
    } else {
        return Promise.resolve(JSON.parse(JSON.stringify(campaign)) );
    }
}

export async function fetchOrder(uuid: string): Promise<Order> {
    const order: Order = data.orders[userInfo]
        ?.find(o => o.campaign_uuid === uuid)
        ?? {campaign_uuid: uuid, items: [], paid_amount: 0};
    return Promise.resolve(JSON.parse(JSON.stringify(order)));
}

export async function orderCampaign(uuid: string, items: OrderedItem[]): Promise<Order> {
    if (data.orders[userInfo] == null) {
        data.orders[userInfo] = [];
    }
    const orders: Order[] = data.orders[userInfo]
    let order: Order | undefined = orders?.find(o => o.campaign_uuid === uuid);
    if (order == null) {
        order = {campaign_uuid: uuid, items: items, paid_amount: 0}
        orders.push(order)
    }
    order.items = items;
    return Promise.resolve({...order});
}

export async function updateCampaign(campaign: Campaign): Promise<Campaign> {
    const index = data.campaigns.findIndex(c => c.uuid === campaign.uuid);
    if (index === -1) {
        data.campaigns.push(campaign)
    } else {
        data.campaigns[index] = campaign
    }
    return Promise.resolve({...campaign})
}

export async function fetchActiveCampaigns(titleLike: string | null = null): Promise<Campaign[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(data.campaigns
        .filter(c => !c.locked
            && (titleLike == null || titleLike.length === 0 || c.title.toLowerCase().includes(titleLike.toLowerCase()))))));
}

export async function likeCampaign(uuid: string): Promise<Campaign> {
    mutateCampaign(uuid, c => {
        user.subscribe(u => {
            const index = c.likes.indexOf(u);
            if (index === -1) {
                c.likes.push(u);
            }
        })();
    });
    return fetchCampaign(uuid);
}

export async function unlikeCampaign(uuid: string): Promise<Campaign> {
    mutateCampaign(uuid, c => {
        const index = c.likes.indexOf(userInfo);
        if (index !== -1) {
            c.likes.splice(index, 1);
        }
    });
    return fetchCampaign(uuid);
}

export async function lockCampaign(uuid: string): Promise<Campaign> {
    mutateCampaign(uuid, c => c.locked = true);
    return fetchCampaign(uuid);
}

export async function unlockCampaign(uuid: string): Promise<Campaign> {
    mutateCampaign(uuid, c => c.locked = false);
    return fetchCampaign(uuid);
}