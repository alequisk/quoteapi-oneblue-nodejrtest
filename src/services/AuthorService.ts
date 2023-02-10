import { AuthorRepository } from "../core/entities/Author";
import { PasswordHasher } from "../core/util/PasswordHasher";
import { CreateAuthorUseCase } from "../usecases/authors/create_author/create_author_usecase";
import { DeleteAuthorUseCase } from "../usecases/authors/delete_author/delete_author_usecase";
import { UpdateAuthorUsecase } from "../usecases/authors/update_author/update_author_usecase";
import { ViewAuthorUseCase } from "../usecases/authors/view_author/view_author_usecase";

class AuthorService {
  createAuthorUseCase: CreateAuthorUseCase;
  deleteAuthorUseCase: DeleteAuthorUseCase;
  viewAuthorUseCase: ViewAuthorUseCase;
  updateAuthorUseCase: UpdateAuthorUsecase;
  constructor(
    authorRepository: AuthorRepository,
    passwordHasher: PasswordHasher,
  ) {
    this.createAuthorUseCase = new CreateAuthorUseCase(authorRepository, passwordHasher);
    this.deleteAuthorUseCase = new DeleteAuthorUseCase(authorRepository);
    this.viewAuthorUseCase = new ViewAuthorUseCase(authorRepository);
    this.updateAuthorUseCase = new UpdateAuthorUsecase(authorRepository, passwordHasher);
  }
}

export {
  AuthorService
};