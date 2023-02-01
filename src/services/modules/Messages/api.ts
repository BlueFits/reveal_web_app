import { serverURL } from "../../../../config/Server";

const API = "/api/messages"

const MessagesApi = {
    async reloadMessages(userID: string) {
        return await fetch(`${serverURL}${API}/${userID}`);
    },
    async deepMessageReload(userID: string, otherUserID: string) {
        return await fetch(`${serverURL}${API}/${userID}/?with=${otherUserID}`);
    }
};

export default MessagesApi;