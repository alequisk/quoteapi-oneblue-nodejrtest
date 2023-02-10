import crypto from "node:crypto";

class Author {
  id: string;
  name: string;
  nameAsQuote: string;
  email: string;
  password: string;

  constructor(id: string, name: string, nameAsQuote: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.nameAsQuote = nameAsQuote;
    this.email = email;
    this.password = password;
  }

  public static newAuthor(name: string, nameAsQuote: string, email: string, password: string) {
    return new Author(crypto.randomUUID(), name, nameAsQuote, email, password);
  }
}

interface AuthorRepository {
  save(author: Author): Promise<Author | null>;
  findByEmail(email: string): Promise<Author | null>;
  findById(id: string): Promise<Author | null>;
  update(author: Author): Promise<boolean>;
  delete(authId: string): Promise<boolean>;
}

export {
  Author,
  AuthorRepository,
};