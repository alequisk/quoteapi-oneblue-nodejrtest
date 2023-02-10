import { Author, AuthorRepository } from "../../../core/entities/Author";
import { PasswordHasher } from "../../../core/util/PasswordHasher";

type CreateAuthorDtoInput = {
  name: string;
  nameAsQuote: string;
  email: string;
  password: string;
};

type CreateAuthorDtoOutput = {
  id: string;
  name: string;
  nameAsQuote: string;
  email: string;
  password: string;
};

class CreateAuthorUseCase {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(authorInput: CreateAuthorDtoInput): Promise<CreateAuthorDtoOutput | Error> {
    if (authorInput.email === "" || authorInput.password === "" || authorInput.name === "" || authorInput.nameAsQuote === "") {
      return new Error("Missing required fields");
    }
    const findAlreadyAuthorEmailUsed = await this.authorRepository.findByEmail(authorInput.email);
    if (findAlreadyAuthorEmailUsed) {
      return new Error("Email already in use");
    }
    const hashPassword = await this.passwordHasher.hash(authorInput.password);
    const author = Author.newAuthor(authorInput.name, authorInput.nameAsQuote, authorInput.email, hashPassword);
    const authorCreated = await this.authorRepository.save(author);
    if (!authorCreated) {
      return new Error("Error to create author");
    }
    return {
      id: authorCreated.id,
      name: authorCreated.name,
      nameAsQuote: authorCreated.nameAsQuote,
      email: authorCreated.email,
      password: authorCreated.password,
    } as CreateAuthorDtoOutput;
  }
}

export {
  CreateAuthorUseCase,
  CreateAuthorDtoInput
};