import {Entity, model, property, hasMany} from '@loopback/repository';
import {Address} from './address.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
    unique: true,
  })
  username: string;

  @property({
    type: 'date',
  })
  birthdate: string;

  @property({
    type: 'string',
  })
  password: string | undefined;

  @property({
    type: 'date',
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updatedAt?: string;

  @property({
    type: 'date',
  })
  deletedAt: string | undefined;

  @hasMany(() => Address)
  addresses: Address[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
