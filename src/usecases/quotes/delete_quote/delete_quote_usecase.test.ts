import { Author, AuthorRepository } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { QuoteRepositoryInMemory } from "../../../infra/repository/in-memory/quote_repository_inmemory";
import { DeleteQuoteUseCase } from "./delete_quote_usecase";

describe("Delete quote usecase", () => {
  let sut: DeleteQuoteUseCase;
  let quoteRepository: QuoteRepository;
  let authorRepository: AuthorRepository;

  beforeEach(done => {
    authorRepository = new AuthorRepositoryInMemory();
    quoteRepository = new QuoteRepositoryInMemory();
    sut = new DeleteQuoteUseCase(quoteRepository);

    const author = new Author("author-id", "John Doe", "JD", "email@email.com", "password");
    authorRepository.save(author).then(() => done());
  });

  it("should delete quote", async () => {
    const author = await authorRepository.findById("author-id");
    const createdQuote = new Quote("quote-id", "Quote", author as Author, new Date());
    await quoteRepository.create(createdQuote);
    const deletedQuote = await sut.execute("author-id", "quote-id");
    expect(deletedQuote).toBe(true);
  });

  it("should return a error when id is not provided", async () => {
    const deletedQuote = await sut.execute("author-id", "");
    expect(deletedQuote).toBeInstanceOf(Error);
    expect((deletedQuote as Error).message).toBe("Missing required field");
  });

  it("should return error when quote is not found", async () => {
    const deletedQuote = await sut.execute("author-id", "quote-id-not-found");
    expect(deletedQuote).toBeInstanceOf(Error);
    expect((deletedQuote as Error).message).toBe("Quote not found");
  });

  it("should return error when author is not authenticated", async () => {
    const deletedQuote = await sut.execute("", "quote-id");
    expect(deletedQuote).toBeInstanceOf(Error);
    expect((deletedQuote as Error).message).toBe("You must to be authenticated to delete a quote");
  });

  it("should return error when author is not the owner of the quote", async () => {
    const author = await authorRepository.findById("author-id");
    const createdQuote = new Quote("quote-id", "Quote", author as Author, new Date());
    await quoteRepository.create(createdQuote);
    const deletedQuote = await sut.execute("author-id-not-owner", "quote-id");
    expect(deletedQuote).toBeInstanceOf(Error);
    expect((deletedQuote as Error).message).toBe("You are not authorized to delete this quote");
  });
});