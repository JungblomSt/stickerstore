
export class ApiError extends Error {
    status: number | 'FETCH_ERROR';
    
    constructor(status: number | 'FETCH_ERROR', message: string) {
        super(message);
        this.status = status;
    }
}