export enum school {
    YORK = "york",
    UOFT = "uoft",
    SENECA = "seneca",
    CENTENNIAL = "centennial",
    GEORGE_BROWN = "georgebrown",
    T_METROPOLITAN = "torontometropolitan",
}

export interface CreatePrelaunchUser {
    firstName: string;
    email: string;
    school: string;
}