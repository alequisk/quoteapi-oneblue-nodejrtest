import { Author, AuthorRepository } from "../../../core/entities/Author";
import { PasswordHasher } from "../../../core/util/PasswordHasher";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { PasswordHasherBcrypt } from "../../../infra/util/implementation/PasswordHasherBctypt";
import { UpdateAuthorUsecase } from "./update_author_usecase";

describe("Update a author usecase", () => {
  let authorRepository: AuthorRepository;
  let passwordHasher: PasswordHasher;
  let sut: UpdateAuthorUsecase;

  beforeEach(() => {
    authorRepository = new AuthorRepositoryInMemory();
    passwordHasher = new PasswordHasherBcrypt();
    sut = new UpdateAuthorUsecase(authorRepository, passwordHasher);
  });

  it("should update a author (name)", async () => {
    let author = Author.newAuthor("John Doe", "John Doe", "email@email.com", "password");
    await authorRepository.save(author);

    const authorUpdated = await sut.execute(author.id, { id: author.id, name: "John Doe 2" });
    author = await authorRepository.findById(author.id) as Author;

    expect(authorUpdated).toBeNull();
    expect(author.name).toEqual("John Doe 2");
  });

  it("should update a author (nameAsQuote)", async () => {
    let author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);

    const authorUpdated = await sut.execute(author.id, { id: author.id, nameAsQuote: "JD 2" });
    author = await authorRepository.findById(author.id) as Author;

    expect(authorUpdated).toBeNull();
    expect(author.nameAsQuote).toEqual("JD 2");
  });

  it("should update a author (email)", async () => {
    let author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);

    const authorUpdated = await sut.execute(author.id, { id: author.id, email: "email2@email.com" });
    author = await authorRepository.findById(author.id) as Author;

    expect(authorUpdated).toBeNull();
    expect(author.email).toEqual("email2@email.com");
  });

  it("should update a author (password)", async () => {
    let author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);
    const authorPassword = (await authorRepository.findById(author.id) as Author).password;

    const authorUpdated = await sut.execute(author.id, { id: author.id, password: "another-password" });
    author = await authorRepository.findById(author.id) as Author;

    expect(authorUpdated).toBeNull();
    expect(author.password).not.toEqual(authorPassword);
  });

  it("should return an error if author is not found", async () => {
    const result = await sut.execute("invalid-id", { id: "invalid-id", name: "John Doe" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toEqual("Author not found");
  });

  it("should return an error if id is not provided", async () => {
    const result = await sut.execute("", { id: "", name: "John Doe" });
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toEqual("Missing required fields");
  });

  it("should return an error if email is same that another author", async () => {
    await authorRepository.save(Author.newAuthor("John Doe", "JD", "email@email.com", "password"));
    const author = await authorRepository.save(Author.newAuthor("John Doe 2", "JD 2", "another-email@email.com", "password")) as Author;
    const result = await sut.execute(author.id, { id: author.id, email: "email@email.com" });

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toEqual("Email already in use");
  });
});