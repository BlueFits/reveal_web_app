export enum gender {
    Male = "m",
    Female = "f",
    Other = "o",
}

export interface CreateUserDto {
    _id?: string;
    username?: string,
    birthday?: string,
    gender?: gender,
    showMe?: gender,
    preference?: Array<string>,
    picture?: string,
    auth0: {
        name: string,
        email: string,
        user_id: string,
        nickname: string,
        picture: string,
        email_verified: Boolean,
    }
}

export interface PutUserDto {
    _id: string;
    username: string,
    birthday: number,
    gender: gender,
    showMe: gender,
    preference: Array<string>,
    picture: string,
    auth0: {
        name: string,
        email: string,
        user_id: string,
        nickname: string,
        picture: string,
        email_verified: Boolean,
    }
}

export interface PatchUserDto extends Partial<PutUserDto> { }