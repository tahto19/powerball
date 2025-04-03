
export interface MyDialogProps {
    open: boolean;
    data: PrizeState;
    dialogType: string;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}

export type PrizeListAll = {
    list: PrizeState[];
    count: number;
}

export interface PrizeState {
    id: string | null;
    name: string;
    value: number;
    type: string;
}

export interface PrizePaginationState {
    offset: number;
    limit: number;
    sort: string;
    filter: string;
}

export const initialPrizeListData: PrizeListAll = {
    list: [],
    count: 0
}

export const initialData: PrizeState = {
    id: null,
    name: "",
    value: 0,
    type: ""
}