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

export interface PrizeListState {
    id: number | null;
    type: string;
}
export interface RaffleScheduleState {
    id: number | null;
    raffle_id: number | null;
    prizeInfo: PrizeInfoState[]
    schedule_date: string | null;
}
export interface PrizeInfoState {
    id: number | null;
    prize_id: number;
    amount: string;
    Prize_List: PrizeListState;
    
}

export interface FileState {
    id: number | null;
    name: string;
    description: string;
}


export interface RaffleState {
    id: number | null;
    details: string;
    name: string;
    alpha_code: string;
    more_details: string;
    active: boolean;
    starting_date: string | null;
    end_date: string | null;
    schedule_type: number | null;
    raffleSchedule: RaffleScheduleState[];
    fileInfo: FileState | null
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
        alpha_code: "",
        more_details: "",
        active: true,
        starting_date: moment().toISOString(),
        end_date: moment().toISOString(),
        schedule_type: 1,
        raffleSchedule: [{id: null, raffle_id: null,schedule_date: moment().toISOString(), prizeInfo: [{id: null, prize_id: -1, amount: "", Prize_List: {id: null, type: ""}}]}],
        fileInfo: null,
    }