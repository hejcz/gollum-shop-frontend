export interface Role {
  is_admin(): boolean;
  is_anonymous(): boolean;
}

export class Anonymous implements Role {
  is_admin(): boolean {
    return false;
  }

  is_anonymous(): boolean {
    return true;
  }
}

export class LoggedUser implements Role {
  is_admin(): boolean {
    return false;
  }

  is_anonymous(): boolean {
    return false;
  }
}

export class Admin implements Role {
  is_admin(): boolean {
    return true;
  }

  is_anonymous(): boolean {
    return false;
  }
}
