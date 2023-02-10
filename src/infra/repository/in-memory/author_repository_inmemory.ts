import { Author, AuthorRepository } from "../../../core/entities/Author";

class AuthorRepositoryInMemory implements AuthorRepository {
  private authors: Author[] = [];

  public save = async (author: Author): Promise<Author | null> => {
    this.authors.push(author);
    return new Promise((resolve) => resolve(author));
  };

  public findByEmail = async (email: string): Promise<Author | null> => {
    const author = this.authors.find((author) => author.email === email) || null;
    return new Promise((resolve) => resolve(structuredClone(author)));
  };

  public findById = async (id: string): Promise<Author | null> => {
    const author = this.authors.find((author) => author.id === id) || null;
    return new Promise((resolve) => resolve(author));
  };

  public update = async (author: Author): Promise<boolean> => {
    const index = this.authors.findIndex((a) => a.id === author.id);
    if (index < 0) {
      return new Promise((resolve) => resolve(false));
    }
    this.authors[index] = author;
    return new Promise((resolve) => resolve(true));
  };

  public delete = async (authId: string): Promise<boolean> => {
    const index = this.authors.findIndex((a) => a.id === authId);
    if (index < 0) {
      return new Promise((resolve) => resolve(false));
    }
    this.authors.splice(index, 1);
    return new Promise((resolve) => resolve(true));
  };
}

export {
  AuthorRepositoryInMemory,
};