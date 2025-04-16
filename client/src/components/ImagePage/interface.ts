
export interface DialogProps {
    open: boolean;
    data: ImageState;
    dialogType: string;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}

export interface ImageState {
    id: number | null;
      name: string;
      description: string;
      file_location: string;
      meta: string; //JSON
      status: boolean;
}

export interface ImageState2 {
    id: number | null;
      name: string;
      description: string;
      file_location: string;
      meta: string; //JSON
      status: boolean;
      file: File[]
}

export const initialImageData: ImageState = {
      id: null,
      name: "",
      description: "",
      file_location: "",
      meta: "",
      status: true,
}

export const initialImageData2: ImageState2 = {
    id: null,
    name: "",
    description: "",
    file_location: "",
    meta: "",
    status: true,
    file: []
}

