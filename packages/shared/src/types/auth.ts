export interface UserLogin {
  email: string;
  password: string;
}

export interface ConfirmPasswordType {
  new_password: string;
  confirm_password: string;
}

export interface UserPasswordChange extends ConfirmPasswordType {
  password: string;
}

export interface PasswordResetQueryParams {
  token: string;
  id: string;
}
