import {PrizeListAll} from "@/components/PrizeList/interface";
import moment from "moment";

export interface MyDialogProps {
    open: boolean;
    prizeList: PrizeListAll;
    data: RaffleState;
    dialogType: string;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}

export interface PrizeListDialogProps {
    open: boolean;
    selectedPrize: number[];
    prizeList: PrizeListAll;
    onClose: (value: boolean) => void;
    onSubmit: (value: number[]) => void;
}


export interface RaffleScheduleState {
    id: number | null;
    prizeInfo: PrizeInfoState[]
}
export interface PrizeInfoState {
    id: number | null;
    prize_id: number;
}

export interface RaffleState {
    id: number | null;
    details: string;
    name: string;
    more_details: string;
    active: boolean;
    starting_date: string | null;
    end_date: string | null;
    schedule_type: number | null;
    raffleSchedule: RaffleScheduleState[]
}

export interface PayloadState {
    formData: RaffleState
    newPrizeList: {id: number, value: number}[]
}


export interface RafflePaginationState {
    offset: number;
    limit: number;
    sort: string;
    filter: string;
}

export const initialRaffleData: RaffleState = {
      id: null,
        details: "",
        name: "",
        more_details: "",
        active: true,
        starting_date: moment().toISOString(),
        end_date: null,
        schedule_type: 1,
        raffleSchedule: [{id: null, prizeInfo: [{id: null, prize_id: -1}]}],
}