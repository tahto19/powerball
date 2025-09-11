export interface MediaState {
    id: number | null;
      file: File | null;
      name: string;
      category: string;
}

export const mediaInitialData: MediaState = {
    id: null,
    file: null,
    name: "",
      category: "",
}