import moment from "moment";

export interface DialogProps {
    open: boolean;
    data: RaffleState;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}

export interface RaffleState {
    id: number | null;
      name: string;
      raffleSchedule: RaffleScheduleState[];
}

export interface RaffleScheduleState {
    schedule_type: boolean;
    starting_date: string;
}


export const initialRaffleData: RaffleState = {
      id: null,
      name: "",
      raffleSchedule: [],
}

