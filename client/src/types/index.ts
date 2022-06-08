export type User = {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  coverImage?: string;
  status?: string;
  gender?: string;
};

export type Register = {
  name: string;
  phone: string;
  countryCode: string;
  gender: string;
  email: string;
  password: string;
  isToken: string;
};

export type Login = {
  phone: string;
  idToken: string;
};
export type Response = {
  data: object;
  error: string | boolean;
  message: string;
};

export type SELECTOR_TYPE = {
  userDetail: User;
};
