# Solução: SQLite Explorer não visualiza o banco de dados

## 🎯 Problema
SQLite Explorer não conseguia visualizar o banco de dados do projeto.

## ✅ Solução em 4 passos

### 1️⃣ Instalar dependências
```bash
npm install
```
Necessário para que o `sequelize-cli` esteja disponível.

---

### 2️⃣ Corrigir a configuração do SQLite
**Arquivo:** `src/config/config.json`

Trocar `"database"` por `"storage"` (chave correta para SQLite):

**De:**
```json
{
  "development": {
    "dialect": "sqlite",
    "database": "./database.sqlite"
  }
}
```

**Para:**
```json
{
  "development": {
    "dialect": "sqlite",
    "storage": "./database.sqlite"
  }
}
```

⚠️ **Isso era o problema principal!** SQLite usa `storage`, não `database`.

---

### 3️⃣ Executar as migrations
```bash
npx sequelize-cli db:migrate
```
Cria o arquivo `database.sqlite` com a estrutura de tabelas.

---

### 4️⃣ Verificar o status
```bash
npx sequelize-cli db:migrate:status
```

**Resultado esperado:**
```
up 20260130195737-create-pessoa.js
```

---

## 🎉 Resultado Final
- ✅ Arquivo `database.sqlite` criado corretamente
- ✅ Tabela `Pessoas` criada
- ✅ SQLite Explorer consegue visualizar o banco

---

## 📝 Próximos passos (opcional)
Para popular o banco com dados de exemplo:
```bash
npx sequelize-cli db:seed:all
```
