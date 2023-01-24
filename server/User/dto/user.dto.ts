export interface CreateUserDto {
    _id?: string;
    username?: String,
    birthday?: { type: Date },
    gender?: { type: String, enum: ["m", "f", "o"] },
    preference?: { type: String, enum: ["m", "f", "o"] },
    picture?: { type: String, required: false, default: "" },
    auth0: {
        created_at: string,
        email: string,
        email_verified: boolean,
        identities: [
            {
                connection: string,
                provider: string,
                user_id: string,
                isSocial: boolean,
            }
        ],
        name: string,
        nickname: string,
        picture: string,
        updated_at: string,
        user_id: string,
        last_ip: string,
        last_login: string,
        logins_count: number,
    }
}

export interface PutUserDto {
    _id: string;
    username: String,
    birthday: { type: Date },
    gender: { type: String, enum: ["m", "f", "o"] },
    preference: { type: String, enum: ["m", "f", "o"] },
    picture: { type: String, required: false, default: "" },
    auth0: {
        created_at: string,
        email: string,
        email_verified: boolean,
        identities: [
            {
                connection: string,
                provider: string,
                user_id: string,
                isSocial: boolean,
            }
        ],
        name: string,
        nickname: string,
        picture: string,
        updated_at: string,
        user_id: string,
        last_ip: string,
        last_login: string,
        logins_count: number,
    }
}

export interface PatchUserDto extends Partial<PutUserDto> { }