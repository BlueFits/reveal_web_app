import { serverURL } from "../../../../config/Server";

const API = "/api/messages"

const MessagesApi = {
    async reloadMessages(userID: string) {
        return await fetch(`${serverURL}${API}/${userID}`);
    },
    async deepMessageReload(userID: string, otherUserID: string) {
        return await fetch(`${serverURL}${API}/${userID}/?with=${otherUserID}`);
    },
    async initiateMsg(fromID: string, toID: string) {
        return await fetch(`${serverURL}${API}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromID,
                to: toID,
            }),
        });
    },
    async sendMsg(messageID: string, fromID: string, message: string) {
        return await fetch(`${serverURL}${API}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromID,
                messageID,
                message,
            }),
        });
    }
};

export default MessagesApi;