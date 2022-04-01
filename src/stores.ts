import { Readable, readable, writable, Writable } from 'svelte/store';

export interface Role {
    might_modify_campaign(): boolean
}

class Anonymous implements Role {
    might_modify_campaign(): boolean {
        return false
    }
}

class LoggedUser implements Role {
    might_modify_campaign(): boolean {
        return false
    }
}

class Admin implements Role {
    might_modify_campaign(): boolean {
        return true
    }
}

export function switchToLoggedUser() {
    console.log("logged user")
    role.update(last => new LoggedUser())
}

export function switchToAdmin() {
    role.update(last => new Admin())
}

export const user: Readable<string> = readable("userX");

export const role: Writable<Role> = writable(new Admin() as Role);
