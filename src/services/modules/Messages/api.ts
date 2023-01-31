import { serverURL } from "../../../../config/Server";

const API = "/api/messages"

const MessagesApi = {
    async reloadMessages(userID: string) {
        return await fetch(`${serverURL}${API}/${userID}`);
    }
};

export default MessagesApi;