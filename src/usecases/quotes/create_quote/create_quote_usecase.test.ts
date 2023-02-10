import { Author, AuthorRepository } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { QuoteRepositoryInMemory } from "../../../infra/repository/in-memory/quote_repository_inmemory";
import { CreateQuoteUsecase } from "./create_quote_usecase";

describe("Create quote usecase", () => {
  let sut: CreateQuoteUsecase;
  let quoteRepository: QuoteRepository;
  let authorRepository: AuthorRepository;

  beforeEach((done) => {
    authorRepository = new AuthorRepositoryInMemory();
    quoteRepository = new QuoteRepositoryInMemory();
    sut = new CreateQuoteUsecase(quoteRepository, authorRepository);

    const author = new Author("author-id", "John Doe", "JD", "email@email.com", "password");
    authorRepository.save(author).then(() => done());
  });

  it("should create quote", async () => {
    const quote = {
      quote: "Quote",
      author_id: "author-id",
    };
    const createdQuote = await sut.execute(quote);
    expect(createdQuote).toBeInstanceOf(Quote);
  });

  it("should return error when quote is empty", async () => {
    const quote = {
      quote: "",
      author_id: "author-id",
    };
    const createdQuote = await sut.execute(quote);
    expect(createdQuote).toBeInstanceOf(Error);
    expect((createdQuote as Error).message).toBe("Missing required fields");
  });

  it("should return error when author is not authenticated", async () => {
    const quote = {
      quote: "Quote",
      author_id: "",
    };
    const createdQuote = await sut.execute(quote);
    expect(createdQuote).toBeInstanceOf(Error);
    expect((createdQuote as Error).message).toBe("You must to be authenticated to create a quote");
  });

  it("should return error when author is not found", async () => {
    const quote = {
      quote: "Quote",
      author_id: "author-id-not-found",
    };
    const createdQuote = await sut.execute(quote);
    expect(createdQuote).toBeInstanceOf(Error);
    expect((createdQuote as Error).message).toBe("Author not found to create quote");
  });

});