import { AuthorRepository } from "../../core/entities/Author";
import { TokenGenerator } from "../../core/util/TokenGenerator";
import { PasswordHasher } from "../../core/util/PasswordHasher";

type AuthenticateUseCaseDtoInput = {
  email: string;
  password: string;
};

class AuthenticateUseCase {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute({ email, password }: AuthenticateUseCaseDtoInput): Promise<string | Error> {
    if (!email || !password) {
      return new Error("Missing required fields");
    }
    const author = await this.authorRepository.findByEmail(email);
    if (!author) {
      return new Error("Email or password incorrect");
    }
    const passwordMatch = await this.passwordHasher.compare(password, author.password);
    if (!passwordMatch) {
      return new Error("Email or password incorrect");
    }
    const token = this.tokenGenerator.generate(author.id);
    return token;
  }
}

export {
  AuthenticateUseCase,
};