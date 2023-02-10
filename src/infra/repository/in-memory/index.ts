import { AuthorRepositoryInMemory } from "./author_repository_inmemory";
import { QuoteRepositoryInMemory } from "./quote_repository_inmemory";

class InMemoryRepository {
  private static instance: InMemoryRepository;

  private constructor(
    public authorRepository: AuthorRepositoryInMemory,
    public quoteRepository: QuoteRepositoryInMemory
  ) { }

  static getInstance(): InMemoryRepository {
    if (!InMemoryRepository.instance) {
      InMemoryRepository.instance = new InMemoryRepository(new AuthorRepositoryInMemory(), new QuoteRepositoryInMemory());
    }
    return this.instance;
  }
}

export default InMemoryRepository;