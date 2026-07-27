# Password Manager

Gerenciador de senhas pessoal. Projeto full stack: React no front, Node.js/Express na API e MySQL no banco.

O objetivo de arquitetura é ser **zero-knowledge**: o servidor nunca vê suas senhas em claro.

## Status de segurança

⚠️ **Em construção — ainda não deve receber senhas reais.**

O que falta está rastreado na issue [#25](https://github.com/RafhaellPrates/password-manager/issues/25), que funciona como portão. Quando todos os itens dela estiverem fechados, este aviso é removido e valem as garantias abaixo.

A chave de criptografia é derivada da senha mestra **dentro do navegador** e nunca é enviada para a API — o backend só armazena blobs cifrados que não sabe abrir. Se o banco vazar, o atacante leva dados inúteis.

| Item | Como |
| ---- | ---- |
| Senha mestra | Nunca trafega nem é armazenada — só um hash de autenticação, derivado separadamente da chave |
| Senhas do cofre | AES-256-GCM, cifrado e decifrado no navegador (WebCrypto) |
| Derivação de chave | PBKDF2 (600k+ iterações) ou Argon2id |
| Transporte | HTTPS obrigatório, HSTS, CORS restrito ao domínio do front |
| Força bruta | Rate limit no login + bloqueio temporário da conta |
| Sessão | JWT curto + auto-lock do cofre por inatividade |
| Banco | MySQL fechado para a internet, acessível só pela API |
| Perda de dados | Exportação cifrada + backup automático testado |

**Não há recuperação de senha mestra.** É consequência direta do modelo zero-knowledge: sem ela, nem você nem o servidor conseguem abrir o cofre. Guarde-a também fora do sistema.

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Front | React (Vite), React Router, WebCrypto |
| Back | Node.js, Express |
| Banco | MySQL |
| Auth | bcrypt (hash de autenticação) + JWT + TOTP |
| Cofre | AES-256-GCM no cliente |

## Funcionalidades

- [ ] Cadastro e login com senha mestra
- [ ] Rotas protegidas por JWT
- [ ] CRUD de senhas isolado por usuário
- [ ] Criptografia do cofre no navegador (zero-knowledge)
- [ ] Gerador de senha forte
- [ ] Busca e filtro por categoria
- [ ] Auto-lock por inatividade
- [ ] Exportação e importação cifrada
- [ ] 2FA (TOTP)

## Estrutura

```
password-manager/
├── backend/
│   ├── db/           # pool de conexão + schema.sql
│   ├── middlewares/  # auth, rate limit, tratamento de erro
│   ├── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── crypto/   # derivação de chave, encrypt/decrypt (WebCrypto)
        ├── pages/
        └── services/ # api.js — única camada que fala com o backend
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- MySQL 8+

### 1. Banco de dados

```sql
CREATE DATABASE password_manager;
```

```bash
mysql -u root -p password_manager < backend/db/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # preencha os valores
npm run dev
```

| Variável | Descrição |
| -------- | --------- |
| `DB_HOST` | host do MySQL (ex: `localhost`) |
| `DB_USER` | usuário do MySQL |
| `DB_PASSWORD` | senha do MySQL |
| `DB_NAME` | `password_manager` |
| `JWT_SECRET` | string aleatória longa usada pra assinar o token |
| `PORT` | porta da API (ex: `3001`) |
| `CORS_ORIGIN` | URL do front (ex: `http://localhost:5173`) |
| `ENCRYPTION_KEY` | ⚠️ temporária — só enquanto a criptografia roda no servidor (issue #7). Removida na #18. |

API sobe em `http://localhost:3001`. Teste com `GET /health`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Front sobe em `http://localhost:5173`.

## Endpoints

| Método | Rota | Auth | Descrição |
| ------ | ---- | ---- | --------- |
| `GET` | `/health` | não | Checa API + conexão com o banco |
| `POST` | `/auth/register` | não | Cria conta |
| `POST` | `/auth/login` | não | Retorna o JWT (e exige TOTP se ativo) |
| `GET` | `/items` | sim | Lista os itens do usuário |
| `GET` | `/items/:id` | sim | Retorna o item cifrado |
| `POST` | `/items` | sim | Cria um item |
| `PUT` | `/items/:id` | sim | Edita um item |
| `DELETE` | `/items/:id` | sim | Remove um item |

Depois da issue #18, a API trafega apenas conteúdo já cifrado — decifrar é responsabilidade exclusiva do navegador.

## Decisões de segurança

- **Senha mestra** nunca sai do navegador. O que vai pro servidor é um hash de autenticação, derivado da senha por um caminho **separado** da chave de criptografia. Derivar os dois igual é o erro clássico: acaba entregando a chave ao servidor sem perceber.
- **Senhas do cofre** usam AES-256-GCM, com IV novo a cada item e `authTag` guardado junto — o GCM também detecta adulteração. Precisam ser reversíveis, então não podem ser hash.
- **Isolamento por usuário**: toda query do cofre filtra por `user_id`, não só pelo `id` do item. Sem isso, trocar o id na URL lê o cofre alheio.
- **Item de outro usuário responde 404**, não 403 — 403 confirmaria que o id existe.
- **Senha inválida e email inexistente devolvem a mesma mensagem** — respostas diferentes revelam quais emails estão cadastrados.
- **Repositório público**: segredo commitado por engano fica no histórico do git para sempre. Se acontecer, rotacione o segredo — apagar o commit não basta.

## Backup

Exportação cifrada pela própria interface, mais dump automático do MySQL guardado fora do servidor. Backup que nunca foi restaurado não conta como backup — teste a restauração antes de confiar nele.

## Roadmap

Acompanhe pelas [issues](https://github.com/RafhaellPrates/password-manager/issues). As marcadas com `bloqueador` travam o uso com senhas reais.

## Licença

MIT — ver [LICENSE](LICENSE).
