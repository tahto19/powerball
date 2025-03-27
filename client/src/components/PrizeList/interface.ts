export interface MyDialogProps {
    open: boolean;
    data: PrizeState;
    dialogType: string;
    onClose: (value: boolean) => void;
}

export interface PrizeState {
    id: number | null;
    name: string;
    value: number;
    type: string;
}

export interface PrizePaginationState {
    offset: number;
    limit: number;
    sort: string;
}