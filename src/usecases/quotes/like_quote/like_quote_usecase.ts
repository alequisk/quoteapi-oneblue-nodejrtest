import { AuthorRepository } from "../../../core/entities/Author";
import { QuoteRepository } from "../../../core/entities/Quote";

type LikeQuoteUseCaseParams = {
  authorId: string;
  quoteId: string;
};

class LikeQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private authorRepository: AuthorRepository
  ) { }

  async execute({ quoteId, authorId }: LikeQuoteUseCaseParams): Promise<boolean | Error> {
    if (!authorId) {
      return new Error("You must to be authenticated to like a quote");
    }
    if (!quoteId) {
      return new Error("Missing required fields");
    }
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      return new Error("Quote not found");
    }
    const author = await this.authorRepository.findById(authorId);
    if (!author) {
      return new Error("Author not found");
    }
    if (await this.quoteRepository.checkIfQuoteIsLiked(quoteId, authorId)) {
      return new Error("Quote already liked");
    }
    return await this.quoteRepository.likeQuote(quoteId, authorId);
  }
}

export {
  LikeQuoteUseCase
};