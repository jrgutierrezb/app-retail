export interface BaseResponse<T = any> {
    error: boolean;
    errorCode: number;
    message: string;
    status: number;
    data?: T;
}