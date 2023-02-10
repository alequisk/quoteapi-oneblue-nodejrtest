import { Author, AuthorRepository } from "../../../core/entities/Author";

class ViewAuthorUseCase {
  constructor(private authorRepository: AuthorRepository) { }

  async execute(id: string): Promise<Author | Error> {
    if (!id) {
      return new Error("Missing required fields");
    }
    const author = await this.authorRepository.findById(id);
    if (!author) {
      return new Error("Author not found");
    }
    return author;
  }
}

export {
  ViewAuthorUseCase
};