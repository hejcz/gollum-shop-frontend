import type {
  Api,
  AssignedToUser,
  Campaign,
  CampaignCandidate,
  CampaignsSearchParams,
  CampaignStatus,
  CampaignUpdate,
  Order,
  OrderUpdate,
  User,
  UserProfile,
} from "./Api";
import { campaigns, candidates, orders } from "./mock_data";
import { users } from "./mock_data/users";

function mutateCampaign(uuid: string, mutator: (c: Campaign) => void): void {
  const campaign = campaigns.find((c) => c.uuid === uuid);
  if (campaign != null) {
    mutator(campaign);
  }
}

function test_title_like(title: string, titleLike: string | null) {
  return (
    titleLike == null ||
    titleLike.length === 0 ||
    title.toLowerCase().includes(titleLike.toLowerCase())
  );
}

export class MockApi implements Api {
  fetchUserProfile(): Promise<UserProfile> {
    throw new Error("Method not implemented.");
  }
  updateUserProfile(updated_profile: UserProfile): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  addCandidate(draft: CampaignCandidate): Promise<CampaignCandidate> {
    throw new Error("Method not implemented.");
  }

  fetchUsers(): Promise<User[]> {
    return (async () => {
      return users.map((it) => ({ ...it }));
    })();
  }

  activateUser(user_uuid: string): Promise<User> {
    return (async () => {
      const user = users.find((u) => u.uuid === user_uuid);
      user.activated = true;
      return { ...user };
    })();
  }

  deactivateUser(user_uuid: string): Promise<User> {
    return (async () => {
      const user = users.find((u) => u.uuid === user_uuid);
      user.activated = false;
      return { ...user };
    })();
  }

  likeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const candidate = candidates.find((c) => c.uuid === uuid);
      const liking_users = new Set<string>(candidate.liking_users);
      liking_users.add("test-user");
      candidate.liking_users = Array.from(liking_users.values());
      return { ...candidate };
    })();
  }

  unlikeCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      const candidate = candidates.find((c) => c.uuid === uuid);
      const liking_users = new Set<string>(candidate.liking_users);
      liking_users.delete("test-user");
      candidate.liking_users = Array.from(liking_users.values());
      return { ...candidate };
    })();
  }

  fetchCampaignCandidate(uuid: string): Promise<CampaignCandidate> {
    return (async () => {
      return candidates.find((c) => c.uuid === uuid);
    })();
  }

  fetchUserOrders(): Promise<Order[]> {
    return (async () => {
      return orders["test-user"] ?? [];
    })();
  }

  fetchCampaignCandidates(titleLike: string): Promise<CampaignCandidate[]> {
    return (async () => {
      return candidates.filter((c) => test_title_like(c.title, titleLike));
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
      const order: Order =
        orders["test-user"]?.find((o) => o.campaign_uuid === campaign_uuid) ??
        null;
      return JSON.parse(JSON.stringify(order));
    })();
  }

  orderCampaign(uuid: string, update: OrderUpdate): Promise<Order> {
    return (async () => {
      const username = "test-user";
      if (orders[username] == null) {
        orders[username] = [];
      }
      const user_orders: Order[] = orders[username];
      let order: Order | undefined = user_orders?.find(
        (o) => o.campaign_uuid === uuid
      );
      if (order == null) {
        return null;
      }
      order.items = update.items;
      return { ...order };
    })();
  }

  updateCampaign(update: CampaignUpdate): Promise<Campaign> {
    return (async () => {
      const campaign = update.campaign;
      const index = campaigns.findIndex((c) => c.uuid === campaign.uuid);
      if (index === -1) {
        campaigns.push(campaign);
      } else {
        campaigns[index] = campaign;
      }
      if (update.candidate_uuid != null) {
        const index = candidates.findIndex(
          (c) => c.uuid === update.candidate_uuid
        );
        if (index !== -1) {
          candidates.splice(index, 1);
        }
      }
      return { ...campaign };
    })();
  }

  fetchCampaigns(params: CampaignsSearchParams): Promise<Campaign[]> {
    return (async () => {
      const filtered_campaigns = campaigns.filter(
        (c) =>
          (params.status == null || params.status === c.status) &&
          test_title_like(c.title, params.titleLike) &&
          (params.uuids == null || params.uuids.includes(c.uuid))
      );
      filtered_campaigns.sort((a, b) =>
        a.title < b.title ? -1 : a.title === b.title ? 0 : 1
      );
      return JSON.parse(JSON.stringify(filtered_campaigns));
    })();
  }

  changeStatus(uuid: string, newStatus: CampaignStatus): Promise<Campaign> {
    return (async () => {
      mutateCampaign(uuid, (c) => (c.status = newStatus));
      return this.fetchCampaign(uuid);
    })();
  }
}
