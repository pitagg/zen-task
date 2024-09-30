# Zen Task
A ferramenta mais simples de gerenciamento de projetos. :)

[![CI](https://github.com/pitagg/zen-task/actions/workflows/ci.yml/badge.svg)](https://github.com/pitagg/zen-task/actions/workflows/ci.yml)

> [!TIP]
> Do you prefer reading in English? Go to [README](/README.md).


## Configuração e execução

### Back-end

**Instalar dependências:**

A API foi construída em `ruby-3.3.4` com `Rails 7.2`, então primeiro instale esta versão do Ruby da maneira que preferir.
Para configurar o projeto, clone o repositório, abra a pasta `zen-task` no seu terminal, execute `gem install bundler` e `bundle install` para instalar todas as gems.

**Configurar banco de dados:**

Devido a natureza simples e momento desse preto, ele está rodando com SQLite3 por enquanto.
Além das migrações, algumas seeds foram implementadas, então você não precisa perder tempo criando registros no banco de dados.
Para configurar o banco de dados, basta executar `bundle exec rails db:prepare` para criar o banco, aplicar o schema e rodar todas as seeds.

> [!TIP]
> `db:prepare` é idempotente, então ele só executará as tarefas necessárias uma vez. Se for necessário redefinir, use `db:setup`, que limpará e reconstruirá o banco de dados. Use com cuidado!

**Master Key:**

Por razões de segurança, o arquivo `credentials.yml` está criptografado com uma chave mestra secreta, que deve estar na pasta `/config`. Esta chave mestra não pode ser exposta no repositório, então se você não recebeu o arquivo, basta pedir.

Após salvar a chave mestra na pasta de configuração, o seguinte comando deve descriptografar com sucesso e abrir o `credentials.yml` para edição (essa é uma boa maneira de confirmar que a chave está correta):

```
VISUAL="code --wait" bundle exec rails credentials:edit
```

> [!TIP]
> Você pode substituir `code` pelo editor de sua preferência.

**Iniciar o servidor**

Tudo pronto! Basta executar `bundle exec rails s` para iniciar o servidor.
Confira as coleções de requisições Thunder/Postman em `docs/api-requests/` para obter exemplos de uso da API.


### Front-end

O front-end é um SPA em React (versão `^18.3.1`) construído dentro do projeto Rails, na pasta `frontend`.
Para iniciá-lo, primeiramente abra uma nova aba no seu terminal, vá para a pasta frontend com `cd zen-task/frontend/` e instale as dependências com `npm install`.

Se tudo estiver correto, você está pronto para rodar `npm start`. Uma nova aba será aberta no seu navegador em `http://localhost:3001/`. Divirta-se!


## Fluxo de Desenvolvimento

Esta é uma explicação rápida do fluxo de desenvolvimento adotado durante este projeto para cada nova implementação:

- Crie uma nova branch com um nome descritivo (por exemplo, `feat-api-activities`);
- Faça pequenas mudanças e commit delas;
- Envie para a nova branch no repositório (`push`);
- Abra um Pull Request para 'main';
- Peça por revisão de código, tenha discussões ricas e torne o mundo melhor (infelizmente eu não tive essa etapa);
- Feche o PR com a estratégia de `squash`, pois mantém o histórico muito mais limpo, focado na feature e fácil de reverter, se necessário.

### Commits

As mensagens de commit devem seguir o [Conventional Commits](https://www.conventionalcommits.org).
Os squash commits, ao mesclar os PRs, devem seguir as mesmas regras.

## Qualidade do Código

Este projeto utiliza RSpec, FactoryBot e SimpleCov para garantir que tudo está funcionando bem.
Por enquanto, a cobertura de linha é de 100%, o que é ótimo, mas uma pequena redução pode ser aceita se houver uma boa razão.

Também usa Rubocop para manter a estilização de código limpa e consistente ao longo da aplicação.
Guia de Estilo RSpec: https://github.com/rubocop/rspec-style-guide

**Executar testes com relatório de cobertura:**

O SimpleCov está ativado por padrão, então basta rodar `bundle exec rspec` para executar todos os testes e gerar o relatório de cobertura.
Após a conclusão, basta abrir o arquivo `/coverage/index.html` no seu navegador para ver o relatório.

**Executar testes sem relatório de cobertura:**

Para desativar o relatório do SimpleCov, basta passar a variável de ambiente `COVERAGE=false` ao comando rspec: `COVERAGE=false bundle exec rspec`.

## Informações gerais sobre funcionalidades

- Após configurar a base de dados com as seeds, você pode logar com o usuário "user_1@domain.com" e senha "12345678" para tetar a aplicação.
- Autenticação com JWT (POST /login com email e senha).
- Rota /me para verificar os dados do usuário logado (GET /me com header Authorization + JWT).
- JWT expira em 24 horas.
- Versionamento da API: `/api/v1/...`. Exemplos de requisições em `docs/api-requests/`, nas coleções Thunder e Postman.


## Pendência

- Refatorar componentes do React para melhor organizá-los e reutilizá-los.
- Traduzir mensagens de error e validações da API.
- Criação e remoção de conta do usuário.
- Escrever testes de frontend e de integração;
- Configurar build do front-end e completar o deploy;


## Futuras implementações

- Prover rotas de Edit e Show no react app (link direto para o projeto).
- Migrar para PostgreSQL;
- Melhorias de UI/UX;
- Lidar com paginação nas listas de Projetos e Atividades.
- Considerar melhorias de desempenho para os cálculos de conclusão. Ambos os valores são persistidos no banco de dados para evitar problemas de desempenho, mas algumas melhorias podem ser consideradas no futuro, como:
    - Mover os cálculos para um job em background para evitar afetar a experiência do usuário ao salvar a atividade;
    - Mover os valores para um cache (Redis), já que eles recebem muito mais operações de escrita.
