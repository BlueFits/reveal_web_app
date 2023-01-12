export enum tempUserStatus {
    WAITING =  "waiting",
    IN_CALL = "incall",
}

export interface CreateTempUserDTO {
    preference: Array<string>,
    username: string,
    socketID: string,
    status: tempUserStatus,
}