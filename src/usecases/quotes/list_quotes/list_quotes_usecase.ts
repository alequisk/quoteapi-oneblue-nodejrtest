import { Quote, QuoteRepository } from "../../../core/entities/Quote";

type ListQuoteUseCaseParams = {
  page: number;
  limit: number;
};

type ListQuoteUseCaseResult = {
  quotes: Quote[];
  total: number;
};

class ListQuotesUseCase {
  constructor(private quotesRepository: QuoteRepository) { }

  async execute({ page, limit }: ListQuoteUseCaseParams): Promise<ListQuoteUseCaseResult | Error> {
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0) {
      limit = 10;
    }
    page = page - 1;
    const quotes = await this.quotesRepository.listWithLikes(page * limit, limit);
    if (quotes instanceof Error) {
      return new Error("Error listing quotes");
    }
    return {
      quotes: quotes.quotes,
      total: quotes.total,
    } as ListQuoteUseCaseResult;
  }
}

export {
  ListQuotesUseCase,
  ListQuoteUseCaseResult,
};