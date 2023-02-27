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
    WAITING = "No one is availble at the moment, waiting for someone to find you",
    CONNECTING = "Connecting",
    FINDING = "Finding potential matches hold tight...",
    DISCONNECT = "User left",
}