export type tokenType = {
  token: string | null;
};
export type adminType = {
  firstname: string | null
  lastname: string | null
  password: string | null
  emailAddress: string | null
  mobileNumber: string | null
  isAdmin: boolean | null
}

export type getData = {
  limit:number | null
  offset:number | null
  filter:string | null
  sort:string | null
}

export type DataProps ={
  id: number | null,
  first_name: string,
  last_name: string,
  mobile_number: string,
  email: string,
  status: string,
  password: string | null,
}