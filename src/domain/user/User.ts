import { Entity } from '@domain/Entity';

export type UserArgs = {
  id?: number;
  email: string;
}

export class User extends Entity {
  public email: string;

  constructor(args: UserArgs) {
    super(args.id);
    this.email = args.email;
  }
}