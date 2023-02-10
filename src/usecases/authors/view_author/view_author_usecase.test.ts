import { Author, AuthorRepository } from "../../../core/entities/Author";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { ViewAuthorUseCase } from "./view_author_usecase";

describe("View author usecase", () => {
  let authorRepository: AuthorRepository;
  let sut: ViewAuthorUseCase;
  beforeEach(() => {
    authorRepository = new AuthorRepositoryInMemory();
    sut = new ViewAuthorUseCase(authorRepository);
  });

  it("should return an author", async () => {
    const author = Author.newAuthor("John Doe", "John Doe", "email@email.com", "password");
    await authorRepository.save(author);

    const result = await sut.execute(author.id);
    expect(result).toBeInstanceOf(Author);
    expect(result).toEqual(author);
  });

  it("should return an error if author is not found", async () => {
    const result = await sut.execute("invalid-id");
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toEqual("Author not found");
  });

  it("should return an error if id is not provided", async () => {
    const result = await sut.execute("");
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toEqual("Missing required fields");
  });

});