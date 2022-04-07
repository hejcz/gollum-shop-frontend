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

export class LoggedUser implements Role {
  might_modify_campaign(): boolean {
    return false;
  }

  is_anonymous(): boolean {
    return false;
  }
}

export class Admin implements Role {
  might_modify_campaign(): boolean {
    return true;
  }

  is_anonymous(): boolean {
    return false;
  }
}
