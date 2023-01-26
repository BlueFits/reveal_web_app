import { serverURL } from "../../../../config/Server";
import { gender } from "../../../../server/Users/dto/users.dto";

const API = "/api/users";

export interface IUpdateUserByForm {
    _id?: string;
    id: string;
    birthday: Date;
    gender: gender;
    showMe: string;
    username: string;
}

const UsersApi = {
    async getUserByAuthID(id: string): Promise<Response> {
        return await fetch(`${serverURL}${API}/${id}`);
    },
    async updateUserByForm(data: IUpdateUserByForm): Promise<Response> {
        return await fetch(`${serverURL}${API}/${data.id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                gender: data.gender,
                showMe: data.showMe,
                birthday: data.birthday,
            }),
        });
    }
};

export default UsersApi;