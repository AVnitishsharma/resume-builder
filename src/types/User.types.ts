export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IregisterUser {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export interface IloginUser {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email?: string;
}