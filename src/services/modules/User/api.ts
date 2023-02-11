import { serverURL } from "../../../../config/Server";
import { gender, PatchUserDto } from "../../../../server/Users/dto/users.dto";

const API = "/api/users";

export interface IUpdateUserByForm {
    _id?: string;
    id: string;
    birthday: Date;
    gender: gender;
    showMe: string;
    username: string;
}

export interface IAddUserToMatches {
    userIdToAdd: string;
    _id: string;
}

export interface IReloadMessages {
    userID: string;
}

const UsersApi = {
    async getUserByEmailPost(email: string): Promise<Response> {
        return await fetch(`${serverURL}${API}/email`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
            }),
        });
    },
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
    },
    async addUserToMatches(data: IAddUserToMatches) {
        return await fetch(`${serverURL}${API}/${data._id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matches: data.userIdToAdd
            }),
        });
    },
    async updateUser({ id, fields }: { id: string, fields: PatchUserDto }) {
        return await fetch(`${serverURL}${API}/${id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields),
        });
    }
};

export default UsersApi;