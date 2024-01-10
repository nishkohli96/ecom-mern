export interface UserName {
  name: { first: string; last: string };
  email: string;
}

/**
 * The bare minimum user info I would store in redux-store
 * when the user logs in. The fields that will be shown in
 * user profile page. Remaining info will be fetched from
 * api when required.
 */
export interface UserProfileDetails extends UserName {
  avatar: string;
  phone: string;
}

export type VerifyUserEmail = Pick<UserName, 'email'>;

/* For requests where I pass customer_id in query params */
export interface GetCustomerQuery {
  customer_id: string;
}
