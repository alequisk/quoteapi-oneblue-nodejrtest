import { Author } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";
import { QuoteRepositoryInMemory } from "../../../infra/repository/in-memory/quote_repository_inmemory";
import { ListQuotesUseCase, ListQuoteUseCaseResult } from "./list_quotes_usecase";

describe("List quotes usecase", () => {
  let sut: ListQuotesUseCase;
  let quotesRepository: QuoteRepository;

  beforeEach(() => {
    quotesRepository = new QuoteRepositoryInMemory();
    sut = new ListQuotesUseCase(quotesRepository);

    async function createQuote() {
      for (let i = 0; i < 15; i++) {
        const author = Author.newAuthor("Author " + i, "author" + i, "author" + i + "@email.com", "password");
        await quotesRepository.create(Quote.newQuote("Quote " + i, author));
      }
    }
    createQuote();
  });

  it("should return a list of quotes", async () => {
    const result = await sut.execute({ page: 1, limit: 10 });
    expect((result as ListQuoteUseCaseResult).quotes).toBeInstanceOf(Array);
  });

  it("should return a list of quotes with the correct number of items", async () => {
    const result = await sut.execute({ page: 1, limit: 10 });
    expect((result as ListQuoteUseCaseResult).quotes).toHaveLength(10);
  });

  it("should return a list of quotes with the correct number of items when page is 2", async () => {
    const result = await sut.execute({ page: 2, limit: 10 });
    expect((result as ListQuoteUseCaseResult).quotes).toHaveLength(5);
  });

  it("should return a list of quotes with the correct number of items when page is 3", async () => {
    const result = await sut.execute({ page: 3, limit: 10 });
    expect((result as ListQuoteUseCaseResult).quotes).toHaveLength(0);
  });

  it("should return a list of quotes with the correct number of items when page is 0", async () => {
    const result = await sut.execute({ page: 0, limit: 10 });
    expect((result as ListQuoteUseCaseResult).quotes).toHaveLength(10);
  });
});