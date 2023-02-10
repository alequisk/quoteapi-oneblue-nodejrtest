import { IQuoteItem, IQuoteItemWithLikes, IQuoteWithLikes, Quote, QuoteRepository } from "../../../core/entities/Quote";

class QuoteRepositoryInMemory implements QuoteRepository {
  private quotes: Quote[] = [];
  private likedQuotes: Map<string, string[]> = new Map();

  async create(quote: Quote): Promise<Quote | null> {
    this.quotes.push(quote);
    return quote;
  }

  async findById(id: string): Promise<Quote | null> {
    return this.quotes.find((quote) => quote.id === id) || null;
  }

  async update(quote: Quote): Promise<boolean> {
    const index = this.quotes.findIndex((q) => q.id === quote.id);
    if (index < 0) {
      return false;
    }
    this.quotes[index] = quote;
    return true;
  }

  async delete(quoteId: string): Promise<boolean> {
    const index = this.quotes.findIndex((q) => q.id === quoteId);
    if (index < 0) {
      return false;
    }
    this.likedQuotes.delete(quoteId);
    this.quotes.splice(index, 1);
    return true;
  }

  async list(offset: number, limit: number): Promise<IQuoteItem> {
    this.quotes.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
    const quotes: Quote[] = [];
    for (let i = 0; i < limit; i++) {
      const quote = this.quotes[offset + i];
      if (!quote) {
        break;
      }
      quotes.push(structuredClone(quote));
    }
    return {
      quotes,
      total: this.quotes.length,
    };
  }

  async listWithLikes(offset: number, limit: number): Promise<IQuoteItemWithLikes> {
    this.quotes.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    }); // find by createdAt sort
    const quotes: IQuoteWithLikes[] = [];
    for (let i = 0; i < limit; i++) {
      const quote = this.quotes[offset + i];
      if (!quote) {
        break;
      }
      quotes.push({ ...structuredClone(quote), likes: this.likedQuotes.get(quote.id)?.length || 0 });
    }
    return {
      quotes,
      total: this.quotes.length,
    };
  }

  async likeQuote(quoteId: string, authorId: string): Promise<boolean> {
    const quote = this.quotes.find((q) => q.id === quoteId);
    if (!quote) {
      return false;
    }
    const likedQuotes = this.likedQuotes.get(quoteId) || [];
    if (likedQuotes.includes(authorId)) {
      return false;
    }
    likedQuotes.push(authorId);
    this.likedQuotes.set(quoteId, likedQuotes);
    return true;
  }

  async dislikeQuote(quoteId: string, authorId: string): Promise<boolean> {
    const quote = this.quotes.find((q) => q.id === quoteId);
    if (!quote) {
      return false;
    }
    const likedQuotes = this.likedQuotes.get(quoteId) || [];
    if (!likedQuotes.includes(authorId)) {
      return false;
    }
    const index = likedQuotes.findIndex((id) => id === authorId);
    likedQuotes.splice(index, 1);
    this.likedQuotes.set(quoteId, likedQuotes);
    return true;
  }

  async checkIfQuoteIsLiked(quoteId: string, authorId: string): Promise<boolean> {
    const likedQuotes = this.likedQuotes.get(quoteId) || [];
    return likedQuotes.includes(authorId);
  }

  async findOwnerOfQuote(quoteId: string): Promise<string | null> {
    const quote = this.quotes.find((q) => q.id === quoteId);
    if (!quote) {
      return null;
    }
    return quote.author.id;
  }
}

export {
  QuoteRepositoryInMemory,
};