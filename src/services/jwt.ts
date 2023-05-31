import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JWTUser } from "../interfaces";

const JWT_SECRET = process.env.JWT_SECRET!;

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email,
        };
        const token = JWT.sign(payload, "#*%secretii9382$2jaishreeram");
        return token;
    }

    public static decodeToken(token: string) {
        try {
            return JWT.verify(token, "#*%secretii9382$2jaishreeram") as JWTUser;
        } catch (error) {
            return null;
        }
    }
}

export default JWTService;
