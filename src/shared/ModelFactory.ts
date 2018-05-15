import { App } from "../Model/App";
import { Layout } from "../Model/Layout";
import { Login } from "../Model/Login";
import { injectable } from "inversify";
export enum ModelType {
    App = "App",
    Layout = "Layout",
    Login = "Login",
};

interface Map<T> {
    [key: string]: T;
}

export interface IModelFactory {
    Get<T>(type: ModelType): T;
}

@injectable()
export class ModelFactory {
    private static _models: Map<any>;

    constructor() {
        ModelFactory.Init();
    }

    public static Get<T>(type: ModelType): T {
        ModelFactory.Init();

        if (!ModelFactory._models.hasOwnProperty(type)) {
            let model = null;
            switch (type) {
                case ModelType.App:
                    model = new App();
                    break;
                case ModelType.Layout:
                    model = new Layout();
                    break;
                case ModelType.Login:
                    model = new Login();
                    break;
            }

            ModelFactory._models[type] = model;
        }
        return ModelFactory._models[type];
    }

    public Get<T>(type: ModelType): T {
        return ModelFactory.Get<T>(type);
    }

    private static Init() {
        if (!ModelFactory._models) {
            ModelFactory._models = {};
        }
    }
}
