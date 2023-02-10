import { AuthorRepository } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";

type QuoteInput = {
  quote: string;
  author_id: string;
};

class CreateQuoteUsecase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly authorRepository: AuthorRepository,
  ) { }

  async execute(quote: QuoteInput) {
    if (!quote.quote) {
      return new Error("Missing required fields");
    }
    if (!quote.author_id) {
      return new Error("You must to be authenticated to create a quote");
    }
    const author = await this.authorRepository.findById(quote.author_id);
    if (!author) {
      return new Error("Author not found to create quote");
    }
    const newQuote = Quote.newQuote(quote.quote, author);
    const insertedQuote = await this.quoteRepository.create(newQuote);
    if (!insertedQuote) {
      return new Error("Error to create quote");
    }
    return newQuote;
  }
}

export {
  CreateQuoteUsecase,
};