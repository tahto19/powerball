import {
    RaffleState,
  } from "@/components/2ndChance_iFrame/Raffles/interface.ts";

export interface MyDialogProps {
    open: boolean;
    data: RaffleState
    onClose: (value: boolean) => void;
    // onSubmit: () => void;
}
