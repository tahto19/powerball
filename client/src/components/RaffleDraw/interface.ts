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
  onChange: (value: string) => void;
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
