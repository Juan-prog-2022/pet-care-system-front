# Pet Care System — Agent Guide

## Project structure

```
pet-care-system/src/
  auth/            auth (api, hooks, pages, types)
  pets/            pets module
  products/        products module
  appointments/    appointments (types so far)
  orders/          orders (types so far)
  admin/           empty
  context/         AuthContext
  routes/          AppRoutes, ProtectedRoute (empty), AdminRoute (empty)
  shared/          api client, types, utils
```

## Setup

Node project under `pet-care-system/`. All commands must be run from that directory.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` (typecheck then bundle) |
| `npm run lint` | `eslint .` |
| `npm run preview` | Vite preview |

No test framework configured.

## Architecture

- **Vite + React 19 + TypeScript 6 + Tailwind v4 + react-router-dom v7**
- **No axios** — uses a centralized `fetch`-based client (`shared/api/apiClient.ts`) that auto-attaches JWT from `localStorage` and redirects to `/login` on 401.
- **Auth**: `AuthContext` in `context/AuthContext.tsx`; provides `user`, `loading`, `isAuthenticated`, `login`, `logout`.
- **Token**: stored in `localStorage` under key `token` via `shared/utils/tokenService.ts`.
- **Roles**: `CUSTOMER | VETERINARIAN | ADMIN`
- **Pagination**: Spring Boot-style `Page<T>` interface in `shared/types/`.
- **Error handling**: `ApiError` class with `status` and `message`.
- **API base URL**: `VITE_API_BASE_URL` env var, defaults to `/api`.

## TSConfig quirks

- `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- `erasableSyntaxOnly: true` — no enums, no `namespace`, no `constructor parameter properties`.
- `noUnusedLocals` / `noUnusedParameters` — both on.

## Backend (`petCareSystemAPI/`)

Java 21, Spring Boot 3.5.10, Maven, PostgreSQL, JPA + Hibernate, Lombok.

**Security:** Spring Security + JWT (jjwt 0.12.6). All endpoints except `/api/auth/**` require a `Bearer` token.

### How to run

```bash
docker compose up -d          # PostgreSQL on port 5433
./mvnw spring-boot:run        # or: ./mvnw compile && ./mvnw exec:java
```

| Command | What it does |
|---------|-------------|
| `./mvnw compile` | Compile only |
| `./mvnw test` | Run tests |
| `./mvnw spring-boot:run` | Run dev server on :8080 |
| `./mvnw clean package -DskipTests` | Build fat JAR |

`.mvn/wrapper/maven-wrapper.properties` controls the embedded Maven version (3.9+).

### API surface

All under `/api/` — `Customer`, `Pet`, `Product`, `Appointment`, `Order`, `Auth`.

| Endpoint | Public | Description |
|----------|--------|-------------|
| `POST /api/auth/login` | ✅ | Returns `{ token, user }` |
| `POST /api/auth/register` | ✅ | Registers user (role `CUSTOMER`) |
| `GET /api/auth/me` | ❌ | Current user info |
| `/*` (other) | ❌ | Requires valid JWT |

### Architecture notes

- **Soft delete** on all entities via `active` boolean. Services filter `active = true` on reads.
- **DTOs**: strict Request/Response split; Lombok `@Data` on all DTOs.
- **Validation**: `jakarta.validation` constraints on DTOs + entities; messages in `messages.properties`.
- **Error handling**: `@ControllerAdvice` returns `ApiError` JSON (`{ status, error, message, timestamp }`).
- **IDs**: `Integer` (auto-increment) on all entities.
- **No Spring Data REST** — explicit controllers with constructor injection.
- **No tests yet** — just a single `contextLoads()` smoke test.

### Entities and relationships

```
Customer 1 ──── * Pet
Customer 1 ──── * Appointment
Customer 1 ──── * Order
Pet      1 ──── * Appointment
Order    1 ──── * OrderItem
Product  1 ──── * OrderItem
```

### Envs / config

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Frontend API base URL |
| `SPRING_DATASOURCE_URL` | (required) | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | (required) | DB user |
| `SPRING_DATASOURCE_PASSWORD` | (required) | DB password |
| `app.jwt.secret` | (hardcoded) | Base64-encoded HS256 key |
| `app.jwt.expiration-ms` | `86400000` | Token TTL |

## State (Session 1 — Auth & RBAC complete)

What was done:
- Spring Security + JJWT: `JwtUtils`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `SecurityConfig`
- `User` entity (Role: ADMIN / VETERINARIAN / CUSTOMER), `Role` enum, `UserRepository`
- `AuthService` + `AuthController` (login/register/me); vet register creates inactive + unapproved
- `Veterinarian` entity + repository + `AdminController` (approve/reject/pending list)
- `DataInitializer` seeds admin, vet (pre-approved), customer, 3 pets, 8 products, 1 appointment
- `GlobalExceptionHandler` handles `BadCredentialsException` and `AccessDeniedException`
- `ErrorControllerConfig` for JSON 404 on unknown API paths
- Frontend `NotFound` page + catch-all route
- Fixed: `Pet.active` type from `Boolean` → `boolean`; all DataInitializer builders now set `.active(true)` explicitly
- `application.properties` has default values for PostgreSQL env vars so local dev works with defaults

Frontend side still needs register/login forms, ProtectedRoute/AdminRoute wiring, and alignment with backend DTOs.
