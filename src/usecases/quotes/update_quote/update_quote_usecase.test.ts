import { Author, AuthorRepository } from "../../../core/entities/Author";
import { Quote, QuoteRepository } from "../../../core/entities/Quote";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { QuoteRepositoryInMemory } from "../../../infra/repository/in-memory/quote_repository_inmemory";
import { UpdateQuoteUseCase } from "./update_quote_usecase";

describe("Update quote usecase", () => {
  let sut: UpdateQuoteUseCase;
  let quoteRepository: QuoteRepository;
  let authorRepository: AuthorRepository;

  beforeEach(() => {
    quoteRepository = new QuoteRepositoryInMemory();
    authorRepository = new AuthorRepositoryInMemory();
    sut = new UpdateQuoteUseCase(quoteRepository, authorRepository);

    const author = new Author("1", "John Doe", "JD", "email@email.com", "password");
    const otherAuthor = new Author("2", "John Doe", "JD", "email2@email.com", "password");
    const quote = new Quote("1", "This is a quote", author, new Date());
    async function createQuote() {
      await authorRepository.save(author);
      await authorRepository.save(otherAuthor);
      await quoteRepository.create(quote);
    }
    createQuote();
  });

  it("should be able to update a quote", async () => {
    const result = await sut.execute("1", { id: "1", quote: "This is a new quote" });
    const quote = await quoteRepository.findById("1");
    expect(result).toBe(true);
    expect((quote as Quote).quote).toBe("This is a new quote");
  });

  it("should not be able to update a quote with an invalid id", async () => {
    const result = await sut.execute("1", { id: "2", quote: "This is a new quote" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Quote not found");
  });

  it("should not be able to update a quote with an invalid quote", async () => {
    const result = await sut.execute("1", { id: "1", quote: "" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Quote cannot be empty");
  });

  it("should not be able to update a quote with an invalid author", async () => {
    const result = await sut.execute("invalid-author", { id: "1", quote: "This is a new quote" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Author not found");
  });

  it("should not be able to update a quote if the author is not the owner", async () => {
    const result = await sut.execute("2", { id: "1", quote: "This is a new quote" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("You cannot update a quote that is not yours");
  });

  it("should not be able to update a quote if the author is not authenticated", async () => {
    const result = await sut.execute("", { id: "1", quote: "This is a new quote" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("You must to be authenticated to update a quote");
  });
});