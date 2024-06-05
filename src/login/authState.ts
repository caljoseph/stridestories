export class AuthState {

    static Unknown = new AuthState('unknown');
    static Authenticated = new AuthState('authenticated');
    static Unauthenticated = new AuthState('unauthenticated');

    public name: string;

    constructor(name: string) {
      this.name = name;
    }
}
