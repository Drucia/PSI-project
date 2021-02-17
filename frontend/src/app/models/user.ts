export class User {
    accessToken: string;
    name: string;
    email: string;
    role: Role;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
      }
}

export enum Role {
    Student,
    Teacher,
    Error
}
