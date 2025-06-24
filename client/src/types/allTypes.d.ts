//@ts-nocheck
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
export type getDataV2 = {
  limit: number | null;
  offset: number | null;
  filter: Array<any> | null;
  sort: Array<any> | null;
  location: undefined | null | string;
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
export interface paginationType {
  page: number;
  pageSize: number;
}
export type raffle = {
  ticketID: string | null;
};
export interface IDetectedBarcode {
  boundingBox: IBoundingBox | undefined;
  cornerPoints: IPoint[] | undefined;
  format: string | undefined;
  rawValue: string | undefined;
}

export interface ticketState {
  ticket: string | null | undefined;
  loading: boolean | undefined;
  getData: _getState;
  ticketSubmit: boolean;
}
export interface getTicketState {
  ticket_info: string | null;
  entries: number | null;
  entries_used: number | null;
  createdAt: Date | null;
}
export interface _getState {
  list: Array<any> | null;
  loading: boolean | null;
  limit: number | null;
  offset: number | null;
  sort: Array<any> | null;
  filter: Array<any> | null;
  count: number | null;
  location: string | null;
}
export interface raffleEntriesList {
  _loading: boolean;
  list: Array<any>;
  count: number;
  offset: number;
  limit: number;
  sort: Array<any>;
  filter: Array<any>;
}
export interface raffleEntries {
  btnLoading: boolean;
  overallTotalEntries: number | null;
  totalEntries: number | null;
  totalTicket: number | null;
  totalUsedEntries: number | null;
  loading: boolean;
  raffleEntriesList: raffleEntriesList;
}
export interface LocationState {
  from: {
    pathname: string;
  };
}

export interface TicketDraw {
  raffle_id: number | null;
  prize_id: number | null;
}
export interface totalWinnerInterface {
  t_loading: boolean;
  total_winner: number | null;
  total_entries: number | null;
}
export interface winnerListInterface {
  _loading: boolean;
  list: Array<any>;
  offset: number;
  limit: number;
  count: number;
  sort: Array<any> | null;
  filter: Array<any> | null;
  location: null | undefined | string;
}
export interface winnerInitialState {
  winnerList: winnerListInterface;
  total: totalWinnerInterface;
}
export interface exportDataState {
  type: number | null;
  date_range: Array<any> | undefined | null;
  loading: boolean | undefined;
  show: boolean | undefined;
  title: String | undefined | null;
}
