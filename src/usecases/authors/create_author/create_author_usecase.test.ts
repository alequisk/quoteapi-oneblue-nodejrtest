import { AuthorRepository } from "../../../core/entities/Author";
import { PasswordHasher } from "../../../core/util/PasswordHasher";
import { AuthorRepositoryInMemory } from "../../../infra/repository/in-memory/author_repository_inmemory";
import { PasswordHasherBcrypt } from "../../../infra/util/implementation/PasswordHasherBctypt";
import { CreateAuthorDtoInput, CreateAuthorUseCase } from "./create_author_usecase";


describe("Create a author usecase", () => {
  let authorRepository: AuthorRepository;
  let passwordHasher: PasswordHasher;
  let sut: CreateAuthorUseCase;

  beforeEach(() => {
    authorRepository = new AuthorRepositoryInMemory();
    passwordHasher = new PasswordHasherBcrypt();
    sut = new CreateAuthorUseCase(authorRepository, passwordHasher);
  });

  it("should create a new author", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "John Doe",
      nameAsQuote: "John Doe",
      email: "email@email.com",
      password: "password",
    };
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toHaveProperty("id");
  });

  it("should not create a new author with email already in use", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "John Doe",
      nameAsQuote: "John Doe",
      email: "email@email.com",
      password: "password",
    };
    await sut.execute(authorInput);
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toBeInstanceOf(Error);
    expect((authorCreated as Error).message).toBe("Email already in use");
  });

  it("should not create a new author with missing required fields (name)", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "",
      nameAsQuote: "John Doe",
      email: "email@email.com",
      password: "password",
    };
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toBeInstanceOf(Error);
    expect((authorCreated as Error).message).toBe("Missing required fields");
  });

  it("should not create a new author with missing required fields (nameAsQuote)", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "John Doe",
      nameAsQuote: "",
      email: "email@email.com",
      password: "password",
    };
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toBeInstanceOf(Error);
    expect((authorCreated as Error).message).toBe("Missing required fields");
  });

  it("should not create a new author with missing required fields (email)", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "John Doe",
      nameAsQuote: "John Doe",
      email: "",
      password: "password",
    };
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toBeInstanceOf(Error);
    expect((authorCreated as Error).message).toBe("Missing required fields");
  });

  it("should not create a new author with missing required fields (password)", async () => {
    const authorInput: CreateAuthorDtoInput = {
      name: "John Doe",
      nameAsQuote: "John Doe",
      email: "email@email.com",
      password: "",
    };
    const authorCreated = await sut.execute(authorInput);
    expect(authorCreated).toBeInstanceOf(Error);
    expect((authorCreated as Error).message).toBe("Missing required fields");
  });

});