export enum revealStatus {
    WAITING = "WAITING",
    ACCEPTED = "ACCEPTED",
    STANDBY = "REVEAL",
    CONFIRM = "CONFIRM",
}

export enum matchStatus {
    WAITING = "WAITING",
    ACCEPTED = "ACCEPTED",
    STANDBY = "MATCH",
    CONFIRM = "CONFIRM",
}

export enum peerMsgInfo {
    WAITING = "Waiting for user",
    CONNECTING = "Connecting",
    FINDING = "Finding potential matches hold tight...",
    DISCONNECT = "User left",
}