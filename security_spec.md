# Security Specification — TEKY BAZAR Firestore Rules

## 1. Data Invariants & Relationship Mapping
- **Master Source of Truth**:
  - Storefront products live in `/products/{productId}`.
  - Verified customer reviews live in `/reviews/{reviewId}` where `{reviewId} == request.auth.uid` (1 review per verified Google user, zero PII such as email or phone).
  - Administrative roles are rooted in the bootstrapped verified store owner (`kethelyn.fonseca9@gmail.com` with `email_verified == true`) and optional delegated records in `/admins/{adminId}`.
- **Core Invariants**:
  1. **Default-Deny Catch-All**: Every path outside `/products/{productId}`, `/admins/{adminId}`, and `/reviews/{reviewId}` is unconditionally denied (`allow read, write: if false;`).
  2. **Safe Existence Check & Public Query Enforcer**:
     - `allow get` on `/products/{productId}` and `/reviews/{reviewId}` validates `isValidId(...)` and safely allows `resource == null` (returning `exists() == false` with zero data leakage so client `getDoc` pre-checks never fail with `NullValueError`), or `existing().publicado == true`, or owner/admin access.
     - Unauthenticated visitors may only `list` `/products/{productId}` and `/reviews/{reviewId}` documents where `resource.data.publicado == true`. Blanket queries without `where('publicado', '==', true)` fail for non-admins. Zero `get()` or `exists()` calls exist inside `allow list`.
  3. **Admin-Only Product Mutations & Verified Email**: Creating, updating, or deleting `/products/{productId}` requires a verified user (`request.auth.token.email_verified == true`) who satisfies `isAdmin()`. On `create`, `incoming().authorId == request.auth.uid`; on `update`, `incoming().authorId == existing().authorId` so delegated admins can update stock/prices without altering original authorship.
  4. **One-Per-UID Verified Customer Reviews & Anti-Moderation-Bypass**:
     - Creating `/reviews/{reviewId}` requires `isVerifiedUser()`, `reviewId == request.auth.uid`, `incoming().authorId == request.auth.uid`, `incoming().publicado == true`, integer `nota` in `[1..5]`, bounded strings (`autorNome <= 60`, `bairro <= 60`, `comentario <= 400`), and server timestamps (`request.time`).
     - Updating `/reviews/{reviewId}` preserves `authorId` and `createdAt`, sets `updatedAt == request.time`, and partitions permissions into Tier 1 (`isAdmin()` moderating `['publicado', 'updatedAt']` or full admin override) and Tier 2 (review owner `existing().authorId == request.auth.uid` editing `['autorNome', 'bairro', 'nota', 'comentario', 'updatedAt']` while keeping `incoming().publicado == existing().publicado` so moderated reviews cannot self-republish).
     - Deletion is restricted to the review owner (`existing().authorId == request.auth.uid`) or `isAdmin()`.
  5. **Identity & Temporal Immutability**: On `/products/{productId}` and `/reviews/{reviewId}`, `createdAt` and `updatedAt` must equal `request.time` on creation, and `authorId` + `createdAt` are strictly immutable on update while `updatedAt == request.time`.
  6. **Strict Schema & No Shadow Fields**: `data.keys().hasAll(...)` and `data.keys().hasOnly(...)` block all extra/ghost properties on both `create` and `update`, and `affectedKeys().hasOnly(...)` restricts update actions.
  7. **PII Isolation & Privilege Escalation Guard**: Neither `/admins/{adminId}` nor `/reviews/{reviewId}` stores email/phone/address PII. `/admins/{adminId}` forbids `list` and `update`, restricts `get` to `request.auth.uid == adminId || isBootstrappedAdmin()`, and restricts `create`/`delete` exclusively to `isBootstrappedAdmin()`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Product or Review Write**: Anonymous client attempts to create `/products/prod-1` or `/reviews/anon`.
2. **Spoofed Unverified Admin/Reviewer Email**: Authenticated user with `email_verified: false` attempts to create `/products/prod-1` or `/reviews/uid`.
3. **Non-Admin Verified User Product Write**: Verified user `attacker@example.com` attempts to create or update price on `/products/prod-1`.
4. **Identity Spoofing (`authorId` or `reviewId` mismatch)**: Verified user creates `/products/prod-1` with `authorId: 'someone-else'` or `/reviews/other-uid` to spam multiple reviews.
5. **Shadow / Ghost Field Injection**: Client sends valid product or review payload plus `isFeatured: true` (`hasOnly` violation).
6. **ID Poisoning Attack**: Client targets `/products/bad$id!with spaces` or 200-char ID (`isValidId` violation).
7. **Value / String Overflow Poisoning**: Client sends a 1,200-character `descricao` / `comentario` or invalid `nota: 99` / float `nota: 4.5`.
8. **Invalid Pricing / Promotion Logic**: Admin sets `promocao: true` with `precoPromocional: 35` when `preco: 30` (`precoPromocional >= preco`), or negative `preco: -10`.
9. **Immutable Field Tampering**: User updates `/products/prod-1` or `/reviews/uid` while modifying `createdAt` or `authorId`.
10. **Forged Client Timestamp**: Client creates or updates `/products/prod-1` or `/reviews/uid` with a past/future `Timestamp` instead of `request.time`.
11. **Blanket Unfiltered Public List Scrape**: Unauthenticated visitor executes `getDocs(collection(db, 'products'))` or `getDocs(collection(db, 'reviews'))` without `where('publicado', '==', true)` when unpublished items exist.
12. **Self-Assigned Admin Escalation & Moderation Bypass**: Verified non-admin attempts `setDoc(doc(db, 'admins', uid), ...)`, attempts to delete another user's review `/reviews/other_uid`, or attempts to re-publish (`publicado: true`) their own review after an admin hid it (`publicado: false`).
