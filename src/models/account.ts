import { Gender, SocialMedia } from "@models"

export interface Account {
    id: number | string,
    code: string,
    name: string,
    gender: Gender,
    email: string,
    address: string,
    phone: string,
    secondary_phone: string,
    social_medias: SocialMedia[]
}