import { TypeOptions } from "react-toastify";

export type ToasterI = {
  message: string | null;
  show: boolean | null;
  variant: TypeOptions | null;
  icon: string | null;
  count: number;
};
