export interface SuccessResponse<T> {
    status: string | number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
}
