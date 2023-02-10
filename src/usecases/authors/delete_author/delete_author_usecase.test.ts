import { Author, AuthorRepository } from "../../../core/entities/Author";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { DeleteAuthorUseCase } from "./delete_author_usecase";

describe("Delete a author usecase", () => {
  let authorRepository: AuthorRepository;
  let sut: DeleteAuthorUseCase;

  beforeEach(() => {
    authorRepository = new AuthorRepositoryInMemory();
    sut = new DeleteAuthorUseCase(authorRepository);
  });

  it("should be able to delete a author if is itself", async () => {
    const createdAuthor = await authorRepository.save(Author.newAuthor("John Doe", "John Doe", "email@email.com", "password"));
    const idToDelete = (createdAuthor as Author).id;
    const deletedAuthor = await sut.execute(idToDelete, idToDelete);
    expect(deletedAuthor).toBe(null);
  });

  it("should not be able to delete a author if is not itself", async () => {
    const author = await authorRepository.save(Author.newAuthor("John Doe", "John Doe", "email@email.com", "password"));
    const anotherAuthor = await authorRepository.save(Author.newAuthor("John Doe", "John Doe", "email@email.com", "password"));

    const deletedAuthor = await sut.execute((author as Author).id, (anotherAuthor as Author).id);
    expect(deletedAuthor).toBeInstanceOf(Error);
    expect((deletedAuthor as Error).message).toBe("You can only delete your own account");
  });

  it("should not be able to delete a author with missing required fields (id)", async () => {
    const deletedAuthor = await sut.execute("some-id", "");
    expect(deletedAuthor).toBeInstanceOf(Error);
    expect((deletedAuthor as Error).message).toBe("Missing required fields");
  });

  it("should not be able to delete a author with missing required fields (authorId)", async () => {
    const deletedAuthor = await sut.execute("", "some-id");
    expect(deletedAuthor).toBeInstanceOf(Error);
    expect((deletedAuthor as Error).message).toBe("Missing required fields");
  });

  it("should not be able to delete a author with invalid id", async () => {
    const deletedAuthor = await sut.execute("invalid-id", "invalid-id");
    expect(deletedAuthor).toBeInstanceOf(Error);
    expect((deletedAuthor as Error).message).toBe("Author not found");
  });

});