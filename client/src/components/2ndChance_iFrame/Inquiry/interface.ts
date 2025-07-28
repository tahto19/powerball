
export interface InquiryState {
    email: string;
    name: string;
    mobileNumber: string;
    message: string;
}


export const initialData: InquiryState = {
    email: "",
    name: "",
    mobileNumber: "",
    message: ""
}