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



export interface RaffleState {
    id: number | null;
    details: string;
    more_details: string;
    active: boolean;
    starting_date: string | null;
    end_date: string | null;
    schedule_type: number | null;
    prize_id: number | string;
    amount: number | string;
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
        more_details: "",
        active: true,
        starting_date: moment().toISOString(),
        end_date: null,
        schedule_type: 1,
        prize_id: "",
        amount: "",
}