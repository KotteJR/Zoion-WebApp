import { Pet } from './pet';

export enum UserType {
  USER = 'user',
  KENNEL = 'kennel',
}

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  type?: UserType;
  profilePicture?: string;
  userRole?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  pets: Pet[];
  preferredBreeds: string[];
}


