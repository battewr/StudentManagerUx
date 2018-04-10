export interface IEligibilityContract {
    availableAttenenceList: IRawStudent[];
    estimatedSize: number;
}
/**
 * This is the data as seen from the backend rest request before mapping the response into
 * the application types...
 * TODO: Gateway/Response Interpretor pattern...
 */
export interface IRawStudent {
    _name: string;
    _id: string;
    _grade: string;
    _profilePictureLink: string;
}

/**
 * This is the data as seen from the backend rest request before mapping the response into
 * the application types...
 * TODO: Gateway/Response Interpretor pattern...
 */
export interface IRawClass {
    _name: string;
    _id: string;
    _semester: string;
    _eligibleToGrade: string;
    _year: string;

    _studentList: IRawStudent[];
}

export interface IRawGuardian {
    _name: string;
    _id: string;
    _email: string;

    _studentList: IRawStudent[];
}