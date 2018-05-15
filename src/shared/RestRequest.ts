
interface KeyValue {
    [key: string]: string;
}

export class RestRequest {
    private _url: string;
    public get Url(): string { return this._url; }

    private _command: string;
    public get Command(): string { return this._command; }

    private _headers: KeyValue;
    public get Headers(): KeyValue { return this._headers; }

    private _body: string;
    public get Body(): string { return this._body; }

    constructor(baseUrl: string) {
        this._url = baseUrl;
    }

    public asCommand(command: string): RestRequest {
        this._command = command;
        this._headers = {};
        return this;
    }

    public withHeader(key: string, value: string, overrideIfExists: boolean = true): RestRequest {
        if (!overrideIfExists) {
            if (this._headers.hasOwnProperty(key)) {
                throw "Header already exists!";
            }
        }
        this._headers[key] = value;
        return this;
    }

    public withSmAuthHeader(authroizationKey: string): RestRequest {
        this._headers["sm-authorization-header"] = authroizationKey;
        return this;
    }

    public contentTypeJson(): RestRequest {
        this._headers["content-type"] = "application/json; charset=utf-8";
        return this;
    }

    public withBody(body: string | Object): RestRequest {
        let newBody: string;
        if (typeof body === "object") {
            newBody = JSON.stringify(body);
        } else {
            newBody = body;
        }

        this._body = newBody;
        return this;
    }
}