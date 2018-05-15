import "reflect-metadata";
import { Container } from "inversify";
import { ViewModel_Types, Service_Types, Gateway_Types, Factory_Types } from "./Types";
import { IAuthorizationService, AuthorizationService } from "./Services/AuthorizationService";
import { IModelFactory, ModelFactory } from "./shared/ModelFactory";
import { ILayoutViewModel, LayoutViewModel } from "./ViewModels/Base/LayoutViewModel";
import { IRestGateway, RestGateway } from "./Gateways/RestGateway";
import { IBodyViewModel, BodyViewModel } from "./ViewModels/Base/BodyViewModel";

const container = new Container();

function bootstrapViewModels() {
    container.bind<ILayoutViewModel>(ViewModel_Types.ILayoutViewModel).to(LayoutViewModel);
    container.bind<IBodyViewModel>(ViewModel_Types.IBodyViewModel).to(BodyViewModel);
}

function bootstrapServices() {
    container.bind<IAuthorizationService>(Service_Types.IAuthorizationService).to(AuthorizationService).inSingletonScope();
}

function bootstrapGateways() {
    container.bind<IRestGateway>(Gateway_Types.IRestGateway).to(RestGateway).inSingletonScope();
}

function bootstrapFactories() {
    container.bind<IModelFactory>(Factory_Types.IModelFactory).to(ModelFactory).inSingletonScope();
}

bootstrapServices();
bootstrapViewModels();
bootstrapFactories();
bootstrapGateways();

export { container };