import { CreateTempUserDTO } from "./create.tempUser.dto"

export interface PutTempUserDTO extends CreateTempUserDTO {
    _id: string,
}