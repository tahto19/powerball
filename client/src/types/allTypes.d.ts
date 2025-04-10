export type tokenType = {
  token: string | null;
};
export type adminType = {
  firstname: string | null;
  lastname: string | null;
  password: string | null;
  emailAddress: string | null;
  mobileNumber: string | null;
  isAdmin: boolean | null;
  id: number | null | undefined;
};

export type fetchAll = {
  filter: string | null;
  sort: string | null;
};

export type getData = {
  limit: number | null;
  offset: number | null;
  filter: string | null;
  sort: string | null;
};

export type DataProps = {
  id: number | null;
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  status: string;
  password: string | null;
};

export const postAdminType = {
  data: adminType,
  dialogType: string | null | undefined,
};

export type raffle = {
  ticketID: string | null;
};
export interface IDetectedBarcode {
  boundingBox: IBoundingBox | undefined;
  cornerPoints: IPoint[] | undefined;
  format: string | undefined;
  rawValue: string | undefined;
}
