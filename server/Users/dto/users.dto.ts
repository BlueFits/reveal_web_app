export interface CreateUserDto {
    _id?: string;
    username?: String,
    birthday?: { type: Date },
    gender?: { type: String, enum: ["m", "f", "o"] },
    preference?: { type: String, enum: ["m", "f", "o"] },
    picture?: { type: String, required: false, default: "" },
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
    username: String,
    birthday: { type: Date },
    gender: { type: String, enum: ["m", "f", "o"] },
    preference: { type: String, enum: ["m", "f", "o"] },
    picture: { type: String, required: false, default: "" },
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