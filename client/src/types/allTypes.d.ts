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
  row:number | null
  limit:number | null
  offset:number | null
  filter:string | null
  sort:string | null
}