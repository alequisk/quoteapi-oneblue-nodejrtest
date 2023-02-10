import { Router, Request, Response } from "express";
import { AuthenticateUseCase } from "../../usecases/auth/authenticate_usecase";
import { PasswordHasherBcrypt } from "../util/implementation/PasswordHasherBctypt";
import { TokenGeneratorJWT } from "../util/implementation/TokenGeneratorJwt";
import InMemoryRepository from "../repository/in-memory";

const repository = InMemoryRepository.getInstance().authorRepository;
const tokenGenerator = new TokenGeneratorJWT();
const passwordHasher = new PasswordHasherBcrypt();
const authenticateUseCase = new AuthenticateUseCase(repository, tokenGenerator, passwordHasher);

const router = Router();
router.post("/auth", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authenticateUseCase.execute({ email, password });
  if (token instanceof Error) {
    return res.status(400).json({ error: token.message });
  }
  return res.status(200).json({ token });
});

export {
  router as authRouter
};