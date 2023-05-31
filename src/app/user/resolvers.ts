import axios from "axios";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import JWTService from "../../services/jwt";

interface GoogleTokenResult {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const googleToken = token;
        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        googleOAuthURL.searchParams.set('id_token', googleToken)

        // get user data from google
        const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString(), {
            responseType: 'json'
        })

        // check if user exists
        const user = await prismaClient.user.findUnique({ where: { email: data.email } })

        // if user does not exist, create user
        if (!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email!,
                    firstName: data.given_name!,
                    lastName: data.family_name,
                    profileImageURL: data.picture
                }
            })
        }

        // generate token for user
        const userInDB = await prismaClient.user.findUnique({ where: { email: data.email } })

        if (!userInDB) throw new Error("User with email not found")

        const userToken = JWTService.generateTokenForUser(userInDB!)

        return userToken
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id
        if (!id) return null

        const user = await prismaClient.user.findUnique({ where: { id } })
        return user
    }
}

export const resolvers = { queries }