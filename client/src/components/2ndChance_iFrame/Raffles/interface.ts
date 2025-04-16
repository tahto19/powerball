import moment from "moment";

export interface DialogProps {
  open: boolean;
  data: RaffleState;
  totalUsedEntries: number | null;
  totalEntries: number | null;
  onClose: (value: boolean) => void | null | undefined;
  onSubmit: () => void | null | undefined;
}

export interface RaffleState {
  id: number | null;
  name: string;
  raffleSchedule: RaffleScheduleState[];
}
export interface enterEntries {
  entries: number | null;
  raffle_id: number | null;
}
export interface RaffleScheduleState {
  schedule_type: boolean;
  starting_date: string;
}

export const initialRaffleData: RaffleState = {
  id: null,
  name: "",
  raffleSchedule: [],
};
