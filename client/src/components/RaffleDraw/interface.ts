import {
    RaffleState,
  } from "@/components/2ndChance_iFrame/Raffles/interface.ts";

export interface MyDialogProps {
    open: boolean;
    data: RaffleState
    onClose: (value: boolean) => void;
    // onSubmit: () => void;
}

export interface PrizeTypeDialogProps {
  open: boolean;
  allowCloseDialog: boolean;
  onChange: (value: string) => void;
  onClose: (value: boolean) => void;
}

export interface TimeProps {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface Time {
  time: TimeProps
}

export const initailTimeData = {
  days: "0",
  hours: "0",
  minutes: "0",
  seconds: "0"
}

export interface WinnerDetailState {
  id: number | null;
  raffle_id: number | null;
  ticket_history_generate: string;
  ticket_id: number | null;
  wining_draw_detail: string;
}


export interface WinnerDialogProps {
  ticket: string; 
  open: boolean;
  name: string;
  onClose: (value: boolean) => void;
}


export const initailWinnerData = {
  id: null,
  raffle_id: null,
  ticket_history_generate: "",
  ticket_id: null,
  wining_draw_detail: ""
}
