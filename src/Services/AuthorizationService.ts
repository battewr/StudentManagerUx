import { IRestGateway } from "../Gateways/RestGateway";
import { RestRequest } from "../shared/RestRequest";
import { Constants } from "../shared/Constants";
import { injectable, inject } from "inversify";
import { Gateway_Types } from "../Types";

export interface IAuthorizationService {
    LoadSecurityContext(authToken: string): Promise<boolean>;
    TryLogin(userName: string, password: string): Promise<string>;
}

@injectable()
export class AuthorizationService {

    constructor(
        @inject(Gateway_Types.IRestGateway) private _restEngine: IRestGateway) { }

    public LoadSecurityContext(authToken: string): Promise<boolean> {
        const securityContextResult = new Promise<boolean>((resolve, reject) => {

            const restRequest = new RestRequest(Constants.BackendUri)
                .asCommand("sc")
                .contentTypeJson()
                .withSmAuthHeader(authToken);

            this._restEngine.Get(restRequest).then(() => {
                resolve(true);
            }).catch((err) => {
                // TODO: i dont think we can display an Error like this... fix me!
                console.error(err);
                resolve(false);
            });
        });
        return securityContextResult;
    }

    public TryLogin(userName: string, password: string): Promise<string> {
        const loginResult = new Promise<string>((resolve, reject) => {
            const restRequest = new RestRequest(Constants.BackendUri)
                .asCommand("login")
                .withBody(JSON.stringify({ userName, password }))
                .contentTypeJson();
            this._restEngine.Post(restRequest).then((result) => {

                const handleBodyParse = (body: any) => {
                    if (!body || !body.token || !body.expires) {
                        reject(new Error(`Post Error Bad Response Invalid`));
                        return;
                    }
                    console.log(`Finished: ${result.response.status.toString()} : ${result.response.statusText}`);
                    resolve(body.token);
                };

                result.response.json().then(handleBodyParse).catch((err) => { reject(err); });
            }).catch((err) => {
                reject(err);
            });
        });
        return loginResult;
    }
}
