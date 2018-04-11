import * as React from "React";
import { IGuardian } from "../shared/IGuardian";
import { GradeSelector } from "../shared/GradeSelector";
import { Constants } from "../shared/Constants";
import { EmailInput } from "../shared/Components/EmailInput";

export interface GuardianModifyProperites {
    guardianToEdit: IGuardian;
}

export interface GuardianModifyState {
    guardianToEdit: IGuardian;
    putResponse: string;
}

export class GuardianModify extends React.Component<GuardianModifyProperites, GuardianModifyState> {

    constructor(props: GuardianModifyProperites) {
        super(props);

        this.state = {
            guardianToEdit: Object.assign({}, props.guardianToEdit),
            putResponse: null,
        };

        this.onGuardianEmailInputChanged = this.onGuardianEmailInputChanged.bind(this);
    }

    public render() {
        return <div>
            <h2> Edit Guardian </h2>
            <div className="label-class-id-root">
                <span className="label-class-id-title">Id: </span>
                <span>{this.state.guardianToEdit.id}</span>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.guardianToEdit.name}
                    onChange={this.onGuardianNameInputChanged.bind(this)} />
            </div>
            <EmailInput onEmailChanged={this.onGuardianEmailInputChanged} email={this.state.guardianToEdit.email} />
            <button type="button" onClick={this.onSubmitNewGuardian.bind(this)} className="btn btn-secondary cx-margin-top">Save</button>
            <div>{this.state.putResponse}</div>
        </div>;
    }

    private onGuardianEmailInputChanged(newEmail: string) {
        this.setState((prevState: GuardianModifyState) => {
            const newGuardian = Object.assign({}, prevState.guardianToEdit);
            newGuardian.email = newEmail;
            return {guardianToEdit: newGuardian};
        });
    }

    private onSubmitNewGuardian() {
        this.setState((prevState: GuardianModifyState) => {
            const networkGuardianObject: Object = {
                Name: this.state.guardianToEdit.name,
                Email: this.state.guardianToEdit.email,
                Id: this.state.guardianToEdit.id,
            };
            const guardianId: string = this.state.guardianToEdit.id;

            fetch(Constants.BackendUri + "guardian?Id=" + guardianId, {
                body: JSON.stringify(networkGuardianObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "PUT",
            }).then((response) => {
                this.setState({ putResponse: `Finished: ${response.status.toString()} : ${response.statusText} : ${guardianId}` });
            }).catch((err) => {
                this.setState({ putResponse: `Post Error: ${err}` });
            });
        });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onGuardianNameInputChanged(event: any): void {
        let className: string = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
                className = event.target.value;
        }

        this.setState((prevState: GuardianModifyState) => {
            const guardianToEdit: IGuardian = Object.assign({}, prevState.guardianToEdit);
            guardianToEdit.name = className;
            return { guardianToEdit };
        });
    }
}