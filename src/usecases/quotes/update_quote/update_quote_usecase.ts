import { AuthorRepository } from "../../../core/entities/Author";
import { QuoteRepository } from "../../../core/entities/Quote";

type UpdateQuoteUseCaseParams = {
  id: string;
  quote?: string;
};

class UpdateQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private authorRepository: AuthorRepository
  ) { }

  async execute(authorId: string, { id, quote }: UpdateQuoteUseCaseParams): Promise<boolean | Error> {
    if (!authorId) {
      return new Error("You must to be authenticated to update a quote");
    }
    if (!id) {
      return new Error("Missing required field");
    }
    if (!quote) {
      return new Error("Quote cannot be empty");
    }
    const author = await this.authorRepository.findById(authorId);
    if (!author) {
      return new Error("Author not found");
    }
    const quoteToUpdate = await this.quoteRepository.findById(id);
    if (!quoteToUpdate) {
      return new Error("Quote not found");
    }
    if (quoteToUpdate.author.id !== authorId) {
      return new Error("You cannot update a quote that is not yours");
    }
    quoteToUpdate.quote = quote;
    const updatedQuote = await this.quoteRepository.update(quoteToUpdate);
    return updatedQuote;
  }
}

export {
  UpdateQuoteUseCase,
};