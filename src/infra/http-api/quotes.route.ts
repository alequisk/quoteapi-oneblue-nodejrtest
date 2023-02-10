import { Router } from "express";
import { Request, Response } from "express";
import { QuoteService } from "../../services/QuoteService";
import { authenticateAuthorMiddleware } from "./authenticate.middleware";

import InMemoryRepository from "../repository/in-memory";

const quoteRepository = InMemoryRepository.getInstance().quoteRepository;
const authorRepository = InMemoryRepository.getInstance().authorRepository;

const {
  createQuoteUsecase,
  listQuotesUseCase,
  updateQuoteUsecase,
  likeQuoteUseCase,
  dislikeQuoteUseCase,
  deleteQuoteUseCase
} = new QuoteService(quoteRepository, authorRepository);

const router = Router();
router.post("/quotes", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
  const { authorId, quote } = req.body;
  const quoteCreated = await createQuoteUsecase.execute({ quote, author_id: authorId });
  if (quoteCreated instanceof Error) {
    return res.status(400).json({ error: quoteCreated.message });
  }
  return res.status(200).json(quoteCreated);
}).get("/quotes", async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageValue = Number(page) || 1;
  const limitValue = Number(limit) || 10;
  const quotes = await listQuotesUseCase.execute({ page: pageValue, limit: limitValue });
  if (quotes instanceof Error) {
    return res.status(400).json({ error: quotes.message });
  }
  return res.status(200).json(quotes);
}).patch("/quote", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
  const { id, quote, authorId } = req.body;
  const owner = await quoteRepository.findOwnerOfQuote(id);
  if (!owner) {
    return res.status(400).json({ error: "Quote not found" });
  }
  if (owner !== authorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const quoteUpdated = await updateQuoteUsecase.execute(authorId, { id: String(id), quote: String(quote) });
  if (quoteUpdated instanceof Error) {
    return res.status(400).json({ error: quoteUpdated.message });
  }
  return res.status(200).json({ message: "Quote updated" });
}).delete("/quote", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
  const { quoteId, authorId } = req.body;
  const quote = await quoteRepository.findById(quoteId);
  if (quote?.author.id !== authorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const quoteDeleted = await deleteQuoteUseCase.execute(authorId, quoteId as string);
  if (quoteDeleted instanceof Error) {
    return res.status(400).json({ error: quoteDeleted.message });
  }
  return res.status(200).json({ message: "Quote deleted" });
}).put("/quote/:quoteId/like", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
  const { quoteId } = req.params;
  const { authorId } = req.body;
  const quoteUpdated = await likeQuoteUseCase.execute({ authorId, quoteId });
  if (quoteUpdated instanceof Error) {
    return res.status(400).json({ error: quoteUpdated.message });
  }
  return res.status(200).json({ message: "Quote liked" });
}).put("/quote/:quoteId/dislike", [authenticateAuthorMiddleware], async (req: Request, res: Response) => {
  const { quoteId } = req.params;
  const { authorId } = req.body;
  const quoteUpdated = await dislikeQuoteUseCase.execute({ authorId, quoteId });
  if (quoteUpdated instanceof Error) {
    return res.status(400).json({ error: quoteUpdated.message });
  }
  return res.status(200).json({ message: "Quote disliked" });
});

export {
  router as quotesRouter
};