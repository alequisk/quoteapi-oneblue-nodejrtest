import { ITokenGeneratorPayload, TokenGenerator } from "../../../core/util/TokenGenerator";
import jwt from "jsonwebtoken";

class TokenGeneratorJWT implements TokenGenerator {
  generate(id: string): string {
    const token = jwt.sign(
      { "authorId": id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" });
    return token;
  }
  validate(token: string): ITokenGeneratorPayload | Error {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return decoded as ITokenGeneratorPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return new Error("Token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return new Error("Invalid token");
      }
      if (error instanceof jwt.NotBeforeError) {
        return new Error("Token not active yet");
      }
      return new Error((error as Error).message);
    }
  }
}

export {
  TokenGeneratorJWT,
};