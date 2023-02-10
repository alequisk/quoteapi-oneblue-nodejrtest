interface TokenGenerator {
  generate(id: string): string;
  validate(token: string): ITokenGeneratorPayload | Error;
}

type ITokenGeneratorPayload = {
  authorId: string;
};

export {
  TokenGenerator,
  ITokenGeneratorPayload
};