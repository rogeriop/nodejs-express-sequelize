# Diagrama das Camadas Arquiteturais da API

Aqui está uma representação das camadas arquiteturais da sua API, detalhando o fluxo de uma requisição e a responsabilidade de cada componente:

## 1. Ponto de Entrada / Configuração do Servidor

-   **`server.js`**: O ponto principal de entrada da aplicação Node.js. Ele inicia o servidor Express e o coloca para escutar em uma porta específica (neste caso, 3000).
-   **`src/app.js`**: Inicializa a aplicação Express e, crucialmente, carrega a configuração principal de roteamento, conectando as rotas à instância da aplicação.

## 2. Camada de Roteamento

-   **`src/routes/index.js`**: Este arquivo atua como um agregador de rotas. Ele reúne todos os roteadores específicos da aplicação (como `pessoasRouter`) e aplica middlewares globais (por exemplo, `express.json()`) que afetam todas as requisições.
-   **`src/routes/pessoasRouter.js`**: Representa um roteador específico para o recurso 'pessoas'. Ele define os endpoints da API relacionados a pessoas (ex: `GET /pessoas`, `PUT /pessoas/:id`) e os mapeia para métodos correspondentes no `PessoaController`.

## 3. Camada de Controle (Controller)

-   **`src/controllers/PessoaController.js`**: Um controller específico para o recurso 'pessoas'. Ele estende um `Controller` genérico e tem como principal função instanciar e injetar o serviço correto (`PessoaServices`) no controller genérico, fazendo a ponte entre a requisição web e a lógica de negócio apropriada.
-   **`src/controllers/Controller.js`**: A camada de controle genérica. Ela contém a lógica para manipular requisições e respostas HTTP de forma genérica. Isso inclui extrair parâmetros da URL, o corpo da requisição e chamar o método apropriado da camada de serviço. Em seguida, ela formata e envia a resposta HTTP ao cliente.

## 4. Camada de Serviço (Lógica de Negócio)

-   **`src/services/PessoaServices.js`**: Um serviço específico para o recurso 'pessoas'. Ele estende o `Services` genérico e sua função é especificar qual modelo (entidade) o serviço genérico deve operar, passando o nome do modelo (`'Pessoa'`) para o construtor pai.
-   **`src/services/Services.js`**: A camada de serviço genérica. Contém a lógica de negócio central e a orquestração da manipulação de dados. É responsável por interagir com a camada de acesso a dados (modelos Sequelize) e é completamente independente dos detalhes HTTP.

## 5. Camada de Acesso a Dados (ORM / Interação com Banco de Dados)

-   **`src/models/index.js`**: O coração da camada de acesso a dados. Ele inicializa o Sequelize ORM, configura a conexão com o banco de dados e carrega dinamicamente todos os arquivos de modelo definidos no diretório. Ele exporta um objeto `dataSource` central que contém todos os modelos Sequelize inicializados.
-   **`src/models/pessoa.js`**: Este arquivo define o esquema (estrutura da tabela, colunas, tipos de dados e quaisquer associações com outros modelos) para o modelo específico `Pessoa` usando Sequelize. Representa o nível mais baixo da arquitetura da aplicação antes da interação direta com o banco de dados.

---

### Fluxo de uma Requisição Exemplo (ex: `PUT /pessoas/:id`)

1.  **Requisição chega ao Servidor**: Uma requisição `PUT` para `/pessoas/:id` (onde `:id` é o ID de uma pessoa, ex: `PUT /pessoas/1`) é recebida pelo servidor iniciado por **`server.js`**.
2.  **Configuração da Aplicação**: **`src/app.js`** recebe a requisição e a encaminha para a configuração de roteamento.
3.  **Roteamento Principal**: **`src/routes/index.js`** direciona a requisição para o roteador específico de pessoas, **`src/routes/pessoasRouter.js`**.
4.  **Roteamento Específico**: **`src/routes/pessoasRouter.js`** corresponde o método `PUT` e o padrão de URL `/pessoas/:id`, e então chama o método `atualiza` do **`PessoaController`**.
5.  **Processamento no Controller**: O método `atualiza` do `PessoaController` (cuja implementação reside em **`src/controllers/Controller.js`**) extrai o `id` dos parâmetros da requisição (`req.params`) e os `dadosAtualizados` do corpo da requisição (`req.body`).
6.  **Chamada ao Serviço**: O Controller, então, chama o método `atualizaRegistro` do **`PessoaServices`** (que é uma instância de **`src/services/Services.js`**).
7.  **Lógica de Negócio no Serviço**: O método `atualizaRegistro` do `PessoaServices` (implementado em **`src/services/Services.js`**) utiliza o objeto `dataSource` para interagir com o modelo Sequelize `Pessoa`. Ele executa a operação `update()` no `dataSource[this.model]` (onde `this.model` é `'Pessoa'`), passando os `dadosAtualizados` e o `id`.
8.  **Interação com Banco de Dados**: O modelo `Pessoa` (definido em **`src/models/pessoa.js`**) é usado pelo Sequelize para gerar e executar a consulta SQL apropriada no banco de dados.
9.  **Retorno e Resposta**: O resultado da operação no banco de dados é retornado através da cadeia de serviço e controller. Finalmente, o **`Controller.js`** recebe o resultado e envia uma resposta HTTP apropriada ao cliente (por exemplo, 200 OK para sucesso ou 400 Bad Request em caso de falha de atualização).
