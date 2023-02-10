import { AuthorRepository } from "../../../core/entities/Author";

class DeleteAuthorUseCase {
  constructor(
    private authorRepository: AuthorRepository
  ) { }

  // authorId is the id of the author that is trying to delete the account
  async execute(authId: string, id: string): Promise<Error | null> {
    if (!id || !authId) {
      return new Error("Missing required fields");
    }
    if (authId !== id) {
      return new Error("You can only delete your own account");
    }
    const author = await this.authorRepository.findById(id);
    if (!author) {
      return new Error("Author not found");
    }
    await this.authorRepository.delete(id);
    return null;
  }
}

export {
  DeleteAuthorUseCase,
};