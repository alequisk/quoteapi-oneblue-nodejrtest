import crypto from "node:crypto";
import { Author } from "./Author";

type QuoteAuthorView = Partial<Pick<Author, "password" | "email">> & Omit<Author, "password" | "email">;

class Quote {
  id: string;
  quote: string;
  createdAt: Date;
  author: QuoteAuthorView;

  constructor(id: string, quote: string, author: QuoteAuthorView, createdAt: Date) {
    this.id = id;
    this.quote = quote;
    this.author = author;
    this.createdAt = createdAt;
    this.author = author;

    // remove sensitive data
    delete this.author.email;
    delete this.author.password;
  }

  public static newQuote(quote: string, author: QuoteAuthorView) {
    return new Quote(crypto.randomUUID(), quote, author, new Date());
  }
}

type IQuoteItem = {
  quotes: Quote[];
  total: number;
};

type IQuoteWithLikes = Quote & { likes: number };

type IQuoteItemWithLikes = {
  quotes: IQuoteWithLikes[];
  total: number;
};

interface QuoteRepository {
  findOwnerOfQuote(quoteId: string): Promise<string | null>;
  create(quote: Quote): Promise<Quote | null>;
  findById(id: string): Promise<Quote | null>;
  update(quote: Quote): Promise<boolean>;
  delete(quoteId: string): Promise<boolean>;
  list(offset: number, limit: number): Promise<IQuoteItem>;
  listWithLikes(offset: number, limit: number): Promise<IQuoteItemWithLikes>;
  likeQuote(quoteId: string, authorId: string): Promise<boolean>;
  dislikeQuote(quoteId: string, authorId: string): Promise<boolean>;
  checkIfQuoteIsLiked(quoteId: string, authorId: string): Promise<boolean>;
}

export {
  Quote,
  QuoteRepository,
  IQuoteItem,
  IQuoteWithLikes,
  IQuoteItemWithLikes,
};