import { Author, AuthorRepository } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { QuoteRepositoryInMemory } from "../../../infra/repository/in-memory/quote_repository_inmemory";
import { LikeQuoteUseCase } from "./like_quote_usecase";

describe("Like quote usecase", () => {
  let sut: LikeQuoteUseCase;
  let quotesRepository: QuoteRepository;
  let authorRepository: AuthorRepository;

  beforeEach(() => {
    quotesRepository = new QuoteRepositoryInMemory();
    authorRepository = new AuthorRepositoryInMemory();
    sut = new LikeQuoteUseCase(quotesRepository, authorRepository);
    async function createQuote() {
      for (let i = 0; i < 15; i++) {
        const author = new Author("" + i, "Author " + i, "author" + i, "author" + i + "@email.com", "password");
        const quote = new Quote("" + i, "Quote " + i, author, new Date());
        await authorRepository.save(author);
        await quotesRepository.create(quote);
      }
    }
    createQuote();
  });

  it("should be able to like a quote", async () => {
    const result = await sut.execute({ quoteId: "1", authorId: "1" });
    expect(result).toBe(true);
  });

  it("should return an error when authorId is not provided", async () => {
    const result = await sut.execute({ quoteId: "quoteId", authorId: "" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("You must to be authenticated to like a quote");
  });

  it("should return an error when quoteId is not provided", async () => {
    const result = await sut.execute({ quoteId: "", authorId: "authorId" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Missing required fields");
  });

  it("Should return a error when quote is not found", async () => {
    const result = await sut.execute({ quoteId: "quoteId", authorId: "authorId" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Quote not found");
  });

  it("should return an error when quote already liked", async () => {
    await sut.execute({ quoteId: "1", authorId: "1" });
    const result = await sut.execute({ quoteId: "1", authorId: "1" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Quote already liked");
  });

  it("should return an error when author is not found", async () => {
    const result = await sut.execute({ quoteId: "1", authorId: "authorId" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Author not found");
  });

});