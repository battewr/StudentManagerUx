import { RestRequest } from "../shared/RestRequest";
import { injectable } from "inversify";

export interface IRestResponse {
    responseObject?: any;
    responseStatus: number;
    response?: Response;
    error?: Error;
}

export interface IRestGateway {
    Get(restRequest: RestRequest): Promise<IRestResponse>;
    Post(restRequest: RestRequest): Promise<IRestResponse>;
}

@injectable()
export class RestGateway implements IRestGateway {

    constructor() { }

    public Get(restRequest: RestRequest): Promise<IRestResponse> {
        const getPromise = new Promise<IRestResponse>((resolve, reject) => {
            fetch(restRequest.Url + restRequest.Command, {
                headers: restRequest.Headers,
                method: "GET",
            }).then((response) => {
                // this._applicationModel.loading = false;
                if (response.status !== 200) {
                    reject({ responseStatus: response.status, error: new Error("Response from request was not 200") });
                    return;
                }
                resolve({ responseStatus: 200, response });
            }).catch((err) => {
                reject(err);
            });
        });
        return getPromise;
    }

    public Put(): Promise<IRestResponse> {
        return null;
    }

    public Post(restRequest: RestRequest): Promise<IRestResponse> {
        const getPromise = new Promise<IRestResponse>((resolve, reject) => {
            fetch(restRequest.Url + restRequest.Command, {
                headers: restRequest.Headers,
                body: restRequest.Body,
                method: "POST",
            }).then((response: Response) => {
                // this._applicationModel.loading = false;
                if (response.status !== 200) {
                    const rejectMessage: IRestResponse = { responseStatus: response.status, error: new Error("Response from request was not 200") };
                    reject(rejectMessage);
                    return;
                }

                resolve({ responseStatus: 200, response });
            }).catch((err) => {
                reject(err);
            });
        });
        return getPromise;
    }

    public Delete(): Promise<IRestResponse> {
        return null;
    }
}