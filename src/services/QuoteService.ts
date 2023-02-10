import { AuthorRepository } from "../core/entities/Author";
import { QuoteRepository } from "../core/entities/Quote";
import { CreateQuoteUsecase } from "../usecases/quotes/create_quote/create_quote_usecase";
import { DeleteQuoteUseCase } from "../usecases/quotes/delete_quote/delete_quote_usecase";
import { DislikeQuoteUseCase } from "../usecases/quotes/dislike_quote/dislike_quote_usecase";
import { LikeQuoteUseCase } from "../usecases/quotes/like_quote/like_quote_usecase";
import { ListQuotesUseCase } from "../usecases/quotes/list_quotes/list_quotes_usecase";
import { UpdateQuoteUseCase } from "../usecases/quotes/update_quote/update_quote_usecase";

class QuoteService {
  createQuoteUsecase: CreateQuoteUsecase;
  listQuotesUseCase: ListQuotesUseCase;
  updateQuoteUsecase: UpdateQuoteUseCase;
  likeQuoteUseCase: LikeQuoteUseCase;
  dislikeQuoteUseCase: DislikeQuoteUseCase;
  deleteQuoteUseCase: DeleteQuoteUseCase;
  constructor(
    quoteRepository: QuoteRepository,
    authorRepository: AuthorRepository,
  ) {
    this.createQuoteUsecase = new CreateQuoteUsecase(
      quoteRepository,
      authorRepository,
    );
    this.listQuotesUseCase = new ListQuotesUseCase(quoteRepository);
    this.updateQuoteUsecase = new UpdateQuoteUseCase(quoteRepository, authorRepository);
    this.likeQuoteUseCase = new LikeQuoteUseCase(quoteRepository, authorRepository);
    this.dislikeQuoteUseCase = new DislikeQuoteUseCase(quoteRepository, authorRepository);
    this.deleteQuoteUseCase = new DeleteQuoteUseCase(quoteRepository);
  }
}

export {
  QuoteService
};