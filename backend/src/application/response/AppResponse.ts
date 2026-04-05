import type { Response } from "express";


interface AppResponseBody<T> {
    data?:    T       | undefined;
    message?: string  | undefined;
    error?:   string  | undefined;
    hasMore?: boolean | undefined;
};

export class AppResponse {

    public static ok<T>(res: Response, data?: T, message?: string): void {                                                                          
        res.status(200).json(AppResponse.build({ data, message }));
    };
                  
    public static created<T>(res: Response, data?: T, message?: string): void {                                                                     
        res.status(201).json(AppResponse.build({ data, message }));
    };

    public static noContent(res: Response): void {
        res.status(204).send();
    };

    public static paginated<T>(res: Response, data: T[], hasMore: boolean): void {                                                                  
        res.status(200).json(AppResponse.build({ data, hasMore }));
    };

    private static build<T>(body: AppResponseBody<T>): AppResponseBody<T> {                                                                  
        return Object.fromEntries(
            Object.entries(body).filter(([_, v]) => {
                void _;

                return v !== undefined;
            })
        );
    };

}