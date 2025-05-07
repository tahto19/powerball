
export interface ProfileDialogProps {
    open: boolean;
    fileInfo: ImageState;
    onClose: (value: boolean) => void;
    onSubmit: () => void;
}



export interface ImageState {
    id: number | null;
      name: string;
      description: string;
      file_location: string;
      status: boolean;
      category: string;
      file: File[]
}


export const initialImageData: ImageState = {
    id: null,
    name: "",
    description: "",
    file_location: "",
    status: true,
    category: 'user-image',
    file: []
}

