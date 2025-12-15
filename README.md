# API Cadê a Luz, Marabá

##  Sobre o Projeto

API REST desenvolvida para gerenciar denúncias relacionadas a problemas de energia elétrica na cidade de Marabá, Pará. O sistema permite o registro, acompanhamento e gerenciamento de ocorrências como falta de energia, oscilações, incêndios e necessidades de manutenção.

###  Propósito

A API fornece endpoints para:
- **Autenticação e autorização** de usuários com JWT
- **CRUD de usuários** com diferentes níveis de permissão (ADMIN/MEMBER)
- **Gerenciamento de denúncias** com geolocalização
- **Upload de imagens** via Cloudinary
- **Controle de status** das denúncias (Aberto, Em Andamento, Resolvido)

---

##  Tecnologias Utilizadas

### Core
- **[Fastify](https://fastify.io/) v5.6.1** - Framework web de alta performance para Node.js
- **[TypeScript](https://www.typescriptlang.org/) v5.9.3** - Superset JavaScript com tipagem estática
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Prisma ORM](https://www.prisma.io/) v7.0.1** - ORM TypeScript-first
- **[@prisma/client](https://www.npmjs.com/package/@prisma/client) v7.0.1** - Cliente Prisma
- **[pg](https://www.npmjs.com/package/pg) v8.16.3** - Driver PostgreSQL para Node.js

### Autenticação e Segurança
- **[@fastify/jwt](https://github.com/fastify/fastify-jwt) v10.0.0** - Plugin JWT para Fastify
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs) v3.0.3** - Biblioteca para hash de senhas
- **[dotenv](https://www.npmjs.com/package/dotenv) v17.2.3** - Gerenciamento de variáveis de ambiente

### Validação
- **[Zod](https://zod.dev/) v4.1.12** - Schema validation TypeScript-first
- **[fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) v6.0.0** - Integração Zod + Fastify

### Upload e Armazenamento
- **[Cloudinary](https://cloudinary.com/) v2.8.0** - Serviço de armazenamento e otimização de imagens
- **[@cloudinary/url-gen](https://www.npmjs.com/package/@cloudinary/url-gen) v1.22.0** - Geração de URLs Cloudinary
- **[@fastify/multipart](https://github.com/fastify/fastify-multipart) v9.3.0** - Suporte para multipart/form-data

### Middlewares e Plugins
- **[@fastify/cors](https://github.com/fastify/fastify-cors) v11.1.0** - CORS para Fastify
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger) v9.5.2** - Geração de documentação OpenAPI
- **[@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui) v5.2.3** - Interface Swagger UI

### Ferramentas de Desenvolvimento
- **[tsx](https://github.com/esbuild-kit/tsx) v4.20.6** - TypeScript executor e watcher
- **[@types/node](https://www.npmjs.com/package/@types/node) v24.9.0** - Tipos TypeScript para Node.js

### DevOps
- **[Docker](https://www.docker.com/)** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

---

##  Estrutura do Projeto

```
src/
├── controllers/           # Controllers com lógica de negócio
│   ├── auth.controller.ts    # Login e autenticação
│   ├── user.controller.ts    # CRUD de usuários
│   ├── complaint.controller.ts # Gerenciamento de denúncias
│   └── index.ts
├── main/                  # Configuração principal
│   ├── server.ts             # Inicialização do servidor Fastify
│   ├── prisma.ts             # Configuração do Prisma Client
│   └── types.ts              # Tipos TypeScript customizados
├── middlewares/           # Middlewares de autenticação/autorização
│   ├── auth.middleware.ts    # Verificação JWT
│   └── index.ts
├── routes/                # Definição de rotas
│   ├── auth.routes.ts        # Rotas de autenticação
│   ├── user.routes.ts        # Rotas de usuários
│   ├── complaint.routes.ts   # Rotas de denúncias
│   ├── upload.routes.ts      # Rotas de upload
│   └── index.ts
├── schema/                # Schemas Zod para validação
│   ├── login-schema.ts
│   ├── user-schema.ts
│   ├── complaint-schema.ts
│   └── complement-schema.ts
├── services/              # Serviços externos
│   ├── cloudinary.ts         # Upload/delete de imagens
│   ├── user.ts               # Lógica de usuários
│   ├── login.ts              # Lógica de login
│   └── complaint.ts          # Lógica de denúncias
├── types/                 # Definições de tipos
│   ├── user.ts
│   ├── login.ts
│   ├── complaint.ts
│   ├── complement.ts
│   └── fastify-jwt.d.ts
└── utils/                 # Utilitários
    └── argon2.ts             # Funções de hash (nota: agora usa bcryptjs)

prisma/
├── schema.prisma             # Schema do banco de dados
├── migrations/               # Migrations do Prisma
└── prisma.config.ts
```

---

##  Modelagem do Banco de Dados

### Models

#### **User**
```prisma
model User {
  id         String      @id
  name       String
  email      String      @unique
  password   String      // Hash bcrypt
  cpf        String      @unique
  role       Role        @default(MEMBER)
  createAt   DateTime    @default(now())
  updateAt   DateTime    @updatedAt
  Complement Complement?
  complaints Complaint[]
}
```

#### **Complement**
```prisma
model Complement {
  id           String   @id
  neighborhood String
  address      String
  createAt     DateTime @default(now())
  updateAt     DateTime @updatedAt
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
}
```

#### **Complaint**
```prisma
model Complaint {
  id           String   @id
  img          String?
  title        String
  description  String
  neighborhood String
  address      String
  latitude     Float?
  longitude    Float?
  hour         DateTime
  createAt     DateTime @default(now())
  updateAt     DateTime @updatedAt
  option       Option   @default(FALTOUENERGIA)
  status       Status   @default(ABERTO)
  userId       String
  user         User     @relation(fields: [userId], references: [id])
}
```

### Enums

| Enum | Valores |
|------|---------|
| **Role** | `ADMIN`, `MEMBER` |
| **Status** | `ABERTO`, `EM_ANDAMENTO`, `RESOLVIDO` |
| **Option** | `FALTOUENERGIA`, `OSCILACAO`, `INCENDIO`, `MANUTENCAO` |

---

##  Rotas da API

###  Autenticação

#### POST `/login`
Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/me`
 **Protegido** - Retorna dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "cpf": "12345678900",
  "role": "MEMBER",
  "createAt": "2024-01-01T00:00:00.000Z",
  "updateAt": "2024-01-01T00:00:00.000Z"
}
```

---

###  Usuários

#### POST `/users`
Cria um novo usuário.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "cpf": "12345678900",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "cpf": "12345678900",
  "role": "MEMBER"
}
```

#### GET `/users`
 **Protegido** - Lista todos os usuários.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "cpf": "12345678900",
    "role": "MEMBER"
  }
]
```

#### GET `/users/:id`
 **Protegido** - Retorna um usuário específico por ID.

#### PATCH `/users/:id`
 **Protegido** - Atualiza dados de um usuário.

**Body (campos opcionais):**
```json
{
  "name": "Novo Nome",
  "email": "novoemail@email.com",
  "password": "novaSenha123"
}
```

#### DELETE `/users/:id`
 **Protegido** - Remove um usuário.

---

###  Denúncias (Complaints)

#### POST `/complaints`
 **Protegido** - Cria uma nova denúncia.

**Body:**
```json
{
  "title": "Título da Denúncia",
  "description": "Descrição detalhada",
  "img": "https://cloudinary.com/image.jpg",
  "address": "Rua Exemplo, 123",
  "neighborhood": "Bairro Centro",
  "latitude": -5.3686,
  "longitude": -49.1178,
  "option": "FALTOUENERGIA"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "Título da Denúncia",
  "description": "Descrição detalhada",
  "status": "ABERTO",
  "option": "FALTOUENERGIA",
  "userId": "uuid"
}
```

#### GET `/complaints`
 **Protegido** - Lista todas as denúncias.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Falta de energia",
    "description": "Descrição",
    "status": "ABERTO",
    "option": "FALTOUENERGIA",
    "latitude": -5.3686,
    "longitude": -49.1178,
    "user": {
      "name": "Nome",
      "email": "email@example.com"
    }
  }
]
```

#### GET `/complaints/my`
 **Protegido** - Lista denúncias do usuário autenticado.

#### GET `/complaints/:id`
Retorna uma denúncia específica por ID.

#### PUT `/complaints/:id`
 **Protegido** - Atualiza uma denúncia (apenas proprietário).

**Body (campos opcionais):**
```json
{
  "title": "Novo Título",
  "description": "Nova Descrição",
  "img": "nova-url",
  "address": "Novo Endereço",
  "neighborhood": "Novo Bairro",
  "latitude": -5.3686,
  "longitude": -49.1178,
  "option": "OSCILACAO"
}
```

#### PATCH `/complaints/:id`
 **Protegido** - Atualiza status da denúncia.

**Body:**
```json
{
  "status": "EM_ANDAMENTO"
}
```

#### DELETE `/complaints/:id`
 **Protegido** - Remove uma denúncia.

---

###  Upload de Imagens

#### POST `/upload`
 **Protegido** - Faz upload de uma imagem para o Cloudinary.

**Content-Type:** `multipart/form-data`

**Body:**
- `file`: Arquivo de imagem (JPG, PNG, WEBP, GIF)
- Tamanho máximo: 5MB

**Response (200):**
```json
{
  "message": "Upload realizado com sucesso",
  "url": "https://res.cloudinary.com/.../image.jpg",
  "publicId": "complaints/abc123"
}
```

#### DELETE `/upload/:publicId`
 **Protegido** - Remove uma imagem do Cloudinary.

---

##  Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Ambiente (opcional)
NODE_ENV="development"
```

---

##  Instalação e Execução

### Pré-requisitos

- Node.js 16+ 
- PostgreSQL
- npm ou yarn

### Instalação Local

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd API_Cade_a_Luz_Maraba
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute as migrations do Prisma:**
```bash
npm run migrate
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

A API estará disponível em: `http://localhost:8080`

---

##  Executando com Docker

### Docker Compose

O projeto inclui configuração Docker Compose para facilitar a execução.

**Iniciar containers:**
```bash
docker-compose up -d
```

**Parar containers:**
```bash
docker-compose down
```

**Visualizar logs:**
```bash
docker-compose logs -f
```

### Configuração Docker

- **API**: Porta `8080`
- **PostgreSQL**: Porta `5433` (host) → `5432` (container)

---

##  Scripts Disponíveis

```bash
npm run dev           # Inicia servidor em modo desenvolvimento (hot reload)
npm run build         # Compila TypeScript e gera Prisma Client
npm run start         # Inicia servidor de produção
npm run migrate       # Executa migrations do Prisma
npm run studio        # Abre Prisma Studio (UI do banco)
npm run vercel-build  # Build para deploy na Vercel
```

---

##  Autenticação e Autorização

### JWT Token

- Tokens são gerados no login e têm validade configurável
- Devem ser enviados no header: `Authorization: Bearer {token}`
- O middleware `authenticate` valida o token em rotas protegidas

### Roles de Usuário

| Role | Descrição | Permissões |
|------|-----------|------------|
| **MEMBER** | Usuário comum | Criar/editar/deletar próprias denúncias |
| **ADMIN** | Administrador | Todas as permissões + gerenciar usuários |

---

##  Segurança

- **Hash de senhas**: bcryptjs com salt rounds
- **Validação de dados**: Zod schemas em todas as rotas
- **CORS configurado**: Permite origens específicas
- **JWT**: Tokens assinados e verificados
- **Upload seguro**: Validação de tipo e tamanho de arquivo
- **SQL Injection**: Proteção via Prisma ORM

---

##  Exemplos de Uso (cURL)

### Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123"
  }'
```

### Criar Denúncia
```bash
curl -X POST http://localhost:8080/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Falta de energia",
    "description": "Energia faltando há 3 horas",
    "address": "Rua ABC, 123",
    "neighborhood": "Centro",
    "latitude": -5.3686,
    "longitude": -49.1178,
    "option": "FALTOUENERGIA"
  }'
```

### Upload de Imagem
```bash
curl -X POST http://localhost:8080/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/imagem.jpg"
```

---

##  Testes

Para testar a API, você pode usar:
- **[Prisma Studio](https://www.prisma.io/studio)**: `npm run studio`
- **[Insomnia](https://insomnia.rest/)** ou **[Postman](https://www.postman.com/)**
- **Swagger UI**: Acesse `/documentation` (se configurado)

---

##  Deploy

### Vercel

O projeto está configurado para deploy na Vercel:

1. Configure as variáveis de ambiente no painel Vercel
2. O script `vercel-build` será executado automaticamente
3. A API será servida como Serverless Function

### Outras Plataformas

- **Heroku**: Suporte nativo para Node.js e PostgreSQL
- **Railway**: Deploy simples com PostgreSQL incluído
- **AWS/GCP/Azure**: Use Docker para containerização

---

##  Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

##  Licença

Este projeto está sob a licença MIT.

---

##  Equipe

Desenvolvido para facilitar o gerenciamento de denúncias de energia elétrica em Marabá, PA.

---
