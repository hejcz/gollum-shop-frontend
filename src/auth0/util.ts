import { auth0_client, user, role } from "../stores";
import { get } from "svelte/store";

export function switchToLoggedUser() {
  role.set(new LoggedUser());
}

export function switchToAdmin() {
  role.set(new Admin());
}

export interface Role {
  might_modify_campaign(): boolean;
  is_anonymous(): boolean;
}

export class Anonymous implements Role {
  might_modify_campaign(): boolean {
    return false;
  }

  is_anonymous(): boolean {
    return true;
  }
}

class LoggedUser implements Role {
  might_modify_campaign(): boolean {
    return false;
  }

  is_anonymous(): boolean {
    return false;
  }
}

class Admin implements Role {
  might_modify_campaign(): boolean {
    return true;
  }

  is_anonymous(): boolean {
    return false;
  }
}

export const auth0_audience = { audience: "http://localhost:8090" };
export const roles_key = "https://localhost:8090/roles";

export async function store_credentials() {
  const client = get(auth0_client);
  let user_info = await client.getUser({ ...auth0_audience });
  if (user_info != null) {
    user.set(user_info.nickname);
    const roles: string[] = user_info[roles_key] ?? [];
    if (roles.includes("admin")) {
      role.set(new Admin());
    } else if (roles.includes("user")) {
      role.set(new LoggedUser());
    } else {
      role.set(new Anonymous());
    }
  }
}
