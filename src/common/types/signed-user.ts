import { Role } from "src/users/enums/role.enum"

export type SignedUser = {
    _id:string,
    role:Role
}