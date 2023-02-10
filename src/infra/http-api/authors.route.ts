import { Router } from "express";
import { Request, Response } from "express";
import { authenticateAuthorMiddleware } from "./authenticate.middleware";

import { AuthorService } from "../../services/AuthorService";
import { PasswordHasherBcrypt } from "../util/implementation/PasswordHasherBctypt";
import InMemoryRepository from "../repository/in-memory";

const repository = InMemoryRepository.getInstance().authorRepository;
const passwordHasher = new PasswordHasherBcrypt();
const { createAuthorUseCase, deleteAuthorUseCase, updateAuthorUseCase, viewAuthorUseCase } = new AuthorService(repository, passwordHasher);

const router = Router();
router
  .post("/author", async (req: Request, res: Response) => {
    const { name, nameAsQuote, email, password } = req.body;
    const author = await createAuthorUseCase.execute({ name, nameAsQuote, email, password });
    if (author instanceof Error) {
      return res.status(400).json({ error: author.message });
    }
    return res.status(201).json(author);
  })
  .get("/author", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
    const { authorId } = req.body;
    const author = await viewAuthorUseCase.execute(authorId);
    if (author instanceof Error) {
      return res.status(400).json({ error: author.message });
    }
    return res.status(200).json(author);
  }).patch("/author", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
    const { authorId, id, name, nameAsQuote, email, password } = req.body;
    const author = await updateAuthorUseCase.execute(authorId, { id, name, nameAsQuote, email, password });
    if (author instanceof Error) {
      return res.status(400).json({ error: author.message });
    }
    return res.status(200).json({ message: "Author updated" });
  }).delete("/author", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
    const { authorId, id } = req.body;
    const author = await deleteAuthorUseCase.execute(authorId, id);
    if (author instanceof Error) {
      return res.status(400).json({ error: author.message });
    }
    return res.status(200).json({
      message: "Author deleted",
    });
  });

export {
  router as authorRouter
};