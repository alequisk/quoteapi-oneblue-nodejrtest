import { Request, Response, NextFunction } from "express";
import { TokenGeneratorJWT } from "../util/implementation/TokenGeneratorJwt";

const tokenGenerator = new TokenGeneratorJWT();

function authenticateAuthorMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const [, token] = authorization.split(" ");
  const decoded = tokenGenerator.validate(token);
  if (decoded instanceof Error) {
    return res.status(401).json({ error: decoded.message });
  }
  delete req.body.authorId;
  req.body.authorId = decoded.authorId;
  return next();
}

export {
  authenticateAuthorMiddleware,
};