
export interface DialogProps {
    open: boolean;
    data: ImageState;
    dialogType: string;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}

export interface ImageDrawerProps {
    open: boolean;
    onChoose: (value: ImageState) => void;
    onClose: (value: boolean) => void;
}

export interface ImageState {
    id: number | null;
      name: string;
      description: string;
      file_location: string;
      status: boolean;
      type: string;
      category: string;
}

export interface ImageState2 {
    id: number | null;
      name: string;
      description: string;
      file_location: string;
      status: boolean;
      file: File[]
}

export const initialImageData: ImageState = {
      id: null,
      name: "",
      description: "",
      file_location: "",
      status: true,
      type: "",
      category: ""
}

export const initialImageData2: ImageState2 = {
    id: null,
    name: "",
    description: "",
    file_location: "",
    status: true,
    file: []
}

