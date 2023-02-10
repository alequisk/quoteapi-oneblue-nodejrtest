# Quote API, uma api para você armazenar frases e buscar frases motivadoras de outros usuários.

Essa API foi desenvolvida afim de resolver um desafio técnico de vaga JR em NodeJS. Ela tinha a seguinte descrição:

#### Desafio

Desenvolver a API de um produto similar ao <a href="https://www.pensador.com/">Pensador</a>. O objetivo é que usuários possam se cadastrar, e após cadastro publicar seus pensamentos (citações). Essas citações podem ser curtida tanto pelo proprio usuário, como também por outros usuários logados. 


#### Funcionalidades

1. O usuário pode criar, excluir, editar e visualizar sua conta.
2. O usuário pode criar, excluir, editar e visualizar suas citações.
3. O usuário pode visualizar a listagem de todas as citações de todos usuários, ordenadas por data.
4. O usuário logador poderá curtir citações de outros usuários ou de si mesmo.

#### Restrições

1. O usuário NÃO PODE excluir e editar a conta de outros usuários.
2. O usuário NÃO PODE excluir e editar as publicações de outros usuários.

#### Diferenciais

1. Documentação da API
2. Teste na API


## Sobre a construção

Ficava em aberto todos os campos necessários para criar uma conta ou para criar uma citação, então para isso criei um modelo de usuário (Author) e um modelo de citação (Quote).

O usuário *Author* tem os campos:
- __name__, nome do usário
- __nameAsQuote__, nome fictício atrelado a citação
- __email__, usado para autenticação
- __password__, usado para autenticação

A frase *Quote* tem os campos:
- __quote__, a citação/frase
- __author__, o dono/criador da citação
- __createdAt__, a data de criação, que seria utilizada para listagem de mais recente para a mais antiga

Para identificar cada usuário também seria necessário algum tipo de identifição básica, assim foi utilizado através da Basic Authorization do HTTP o método de autenticação *Barear Token*, onde seria possível passar pelos headers de cada requisição a identificação do usuário que estaria realizando aquela requisição.

A seguir tem algumas tasks que seguir para concluir o projeto, usando claro boas práticas de programação e designs patterns como usecases, repositories e singletons.

## Tasks

### Author

- [x] Create a author              (POST /author)
- [x] Delete a author account      (DELETE /author with BT)
- [x] Update a author informations (PATCH /author with BT)
- [x] View a author informations   (GET /author with BT)
- [x] Login in an author account   (POST /auth)

*__BT__ = Barear Token

### Quote

- [x] Create a quote (POST /quotes with BT)
- [x] List quotes of all user order by create date (GET /quotes)
- [x] Update a quote of quote (PATCH /quote with BT)
- [x] Delete a quote (DELETE /quote with BT)
- [x] Like a quote (owner or others users) (PUT /quote/:quoteId/like with BT)
- [x] Dislike a quote (owner or others users) (PUT /quote/:quoteId/dislike with BT)

*__BT__ = Barear Token

### Express
- [x] Create routes for Authors
- [x] Create routes for Quotes

### Units Tests

- [x] Authors units tests
- [x] Quotes units tests

### Documentation

- [ ] Doc the API with SWAGGER


## Como usar esse projeto

É necessário você ter instalado o node na versão v18.14.0 ou superior e o yarn. Caso não tenha o comando yarn, digite `npm i -g yarn` que você terá acesso ao comando yarn no seu terminal.

Após clonar esse repositório na sua máquina, utilize o comando `yarn` para instalar as depedências. Renomei o arquivo .env.example para .env e preencha os campos de JWT_SECRET e PORT para sua preferência.

Para rodar o projeto em modo de produção utilize o comando `yarn start`, para desenvolvimente utilize `yarn dev`e para rodar testes unitários utilize o comando `yarn test`. Todos os dados são salvos In Memory por enquanto.

## Sobre

Projeto feito para vaga em NodeJS júnior da One Blue durante 3 dias. Infelizmente a vaga foi cancelada mas o projeto fica de destaque para meu portifólio backend.

Qualquer dúvida pode entrar em contato comigo pelo email alexsousa1435@gmail.com ou no meu [linkedin](linkedin.com/in/alequisk).