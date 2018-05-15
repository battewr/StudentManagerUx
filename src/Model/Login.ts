import { observable } from "mobx";

export class Login {

    @observable userName: string;
    @observable password: string;
    @observable restResponse: string;

    constructor() {
        this.userName = "";
        this.password = "";
        this.restResponse = null;
    }

};