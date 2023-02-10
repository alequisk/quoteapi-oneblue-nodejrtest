import { Author, AuthorRepository } from "../../core/entities/Author";
import { PasswordHasher } from "../../core/util/PasswordHasher";
import { TokenGenerator } from "../../core/util/TokenGenerator";
import { AuthorRepositoryInMemory } from "../../infra/repository/in-memory/author_repository_inmemory";
import { PasswordHasherBcrypt } from "../../infra/util/implementation/PasswordHasherBctypt";
import { TokenGeneratorJWT } from "../../infra/util/implementation/TokenGeneratorJwt";
import { AuthenticateUseCase } from "./authenticate_usecase";

process.env = Object.assign(process.env, {
  JWT_SECRET: "secret",
});

describe("Auth usecase", () => {
  let sut: AuthenticateUseCase;
  let authorRepository: AuthorRepository;
  let tokenGenerator: TokenGenerator;
  let passwordHasher: PasswordHasher;

  beforeEach(() => {
    passwordHasher = new PasswordHasherBcrypt();
    tokenGenerator = new TokenGeneratorJWT();
    authorRepository = new AuthorRepositoryInMemory();
    sut = new AuthenticateUseCase(authorRepository, tokenGenerator, passwordHasher);
  });

  it("should authenticate user", async () => {
    const password = "password";
    const hashedPassword = await passwordHasher.hash(password);
    const author = Author.newAuthor("John Doe", "JD", "email@email.com", hashedPassword);
    await authorRepository.save(author);

    const token = await sut.execute({ email: author.email, password });
    expect(token).not.toBeInstanceOf(Error);
    expect(token).toBeTruthy();
  });

  it("should not authenticate user with wrong password", async () => {
    const author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);

    const token = await sut.execute({ email: author.email, password: "wrong-password" });
    expect(token).toBeInstanceOf(Error);
    expect((token as Error).message).toEqual("Email or password incorrect");
  });

  it("should not authenticate user with wrong email", async () => {
    const author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);

    const token = await sut.execute({ email: "wrong-email", password: author.password });
    expect(token).toBeInstanceOf(Error);
    expect((token as Error).message).toEqual("Email or password incorrect");
  });

  it("should not authenticate user with wrong email and password", async () => {
    const author = Author.newAuthor("John Doe", "JD", "email@email.com", "password");
    await authorRepository.save(author);

    const token = await sut.execute({ email: "wrong-email", password: "wrong-password" });
    expect(token).toBeInstanceOf(Error);
    expect((token as Error).message).toEqual("Email or password incorrect");
  });
});