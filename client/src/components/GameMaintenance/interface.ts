export interface MyDialogProps {
    open: boolean;
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
}


export interface RafflePaginationState {
    offset: number;
    limit: number;
    sort: string;
    filter: string;
}