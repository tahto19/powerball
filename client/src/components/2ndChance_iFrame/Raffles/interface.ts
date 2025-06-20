
export interface DialogProps {
  open: boolean;
  data: RaffleState;
  // totalUsedEntries: number | null;
  // totalEntries: number | null;
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
  id: number | null;
  schedule_type: boolean;
  starting_date: string;
}

export interface WinnerState {
  totalWinners: number | null;
  prize: string,
}

export const initialRaffleData: RaffleState = {
  id: null,
  name: "",
  raffleSchedule: [],
};

export const initialWinnerData: WinnerState[]= [{
  totalWinners: null,
  prize: "",
}];
