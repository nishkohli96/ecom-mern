export interface CountryStateInfo {
  name: string;
  iso2: string;
}

export const defaultCountryState: CountryStateInfo = { name: '', iso2: '' };
export const fallbackCountryState: CountryStateInfo = {
  name: 'N/A',
  iso2: '-'
};

export interface UserAddress {
  recipientName: string;
  recipientPhone: string;
  houseNo: string;
  street: string;
  landmark: string;
  city: string;
  state: CountryStateInfo;
  country: CountryStateInfo;
  zipCode: string;
  isDefault: boolean;
}

export interface UserAddressInfo extends UserAddress {
  _id: string;
}

export interface SetDefaultAddress {
  address_id: string;
}
