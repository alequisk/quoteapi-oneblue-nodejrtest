import { QuoteRepository } from "../../../core/entities/Quote";

class DeleteQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) { }

  async execute(authorId: string, id: string): Promise<boolean | Error> {
    if (!id) {
      return new Error("Missing required field");
    }
    if (!authorId) {
      return new Error("You must to be authenticated to delete a quote");
    }
    const findQuote = await this.quoteRepository.findById(id);
    if (!findQuote) {
      return new Error("Quote not found");
    }
    if (findQuote.author.id !== authorId) {
      return new Error("You are not authorized to delete this quote");
    }
    return await this.quoteRepository.delete(id);
  }
}

export {
  DeleteQuoteUseCase,
};