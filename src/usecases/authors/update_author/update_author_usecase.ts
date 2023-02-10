import { AuthorRepository } from "../../../core/entities/Author";
import { PasswordHasher } from "../../../core/util/PasswordHasher";

type UpdateAuthorDtoInput = {
  id: string;
  name?: string;
  nameAsQuote?: string;
  email?: string;
  password?: string;
}

class UpdateAuthorUsecase {
  constructor(
    private authorRepository: AuthorRepository,
    private passwordHasher: PasswordHasher,
  ) { }

  async execute(authorId: string, author: UpdateAuthorDtoInput): Promise<Error | null> {
    if (!authorId || !author.id) {
      return new Error("Missing required fields");
    }
    if (authorId !== author.id) {
      return new Error("You can only update your own profile");
    }
    const authorExists = await this.authorRepository.findById(author.id);
    if (!authorExists) {
      return new Error("Author not found");
    }
    if (author.name) {
      authorExists.name = author.name;
    }
    if (author.nameAsQuote) {
      authorExists.nameAsQuote = author.nameAsQuote;
    }
    if (author.email) {
      if (authorExists.email !== author.email) {
        const authorExistsWithEmail = await this.authorRepository.findByEmail(author.email);
        if (authorExistsWithEmail) {
          return new Error("Email already in use");
        }
        authorExists.email = author.email;
      }
    }
    if (author.password) {
      const hashPassword = await this.passwordHasher.hash(author.password);
      authorExists.password = hashPassword;
    }
    const authorUpdated = await this.authorRepository.update(authorExists);
    if (!authorUpdated) {
      return new Error(`Error to update author with id ${author.id}`);
    }
    return null;
  }
}

export {
  UpdateAuthorUsecase,
};