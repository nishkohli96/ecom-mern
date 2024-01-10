export interface CSC_City {
  id: number;
  name: string;
}

export interface CSC_Country_State extends CSC_City {
  iso2: string;
}
