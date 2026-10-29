# Security Specification — TEKY BAZAR Firestore Rules

## 1. Data Invariants & Relationship Mapping
- **Master Source of Truth**:
  - Storefront products live in `/products/{productId}`.
  - Administrative roles are rooted in the bootstrapped verified store owner (`kethelyn.fonseca9@gmail.com` with `email_verified == true`) and optional delegated records in `/admins/{adminId}`.
- **Core Invariants**:
  1. **Default-Deny Catch-All**: Every path outside `/products/{productId}` and `/admins/{adminId}` is unconditionally denied (`allow read, write: if false;`).
  2. **Public Query Enforcer**: Unauthenticated Instagram visitors may only `get` or `list` `/products/{productId}` documents where `resource.data.publicado == true`. Blanket queries without `where('publicado', '==', true)` fail for non-admins. Zero `get()` or `exists()` calls exist inside `allow list`.
  3. **Admin-Only Mutations & Verified Email**: Creating, updating, or deleting `/products/{productId}` requires a verified user (`request.auth.token.email_verified == true`) who satisfies `isAdmin()`.
  4. **Identity & Temporal Immutability**: On `/products/{productId}`, `authorId` must equal `request.auth.uid`, `createdAt` and `updatedAt` must equal `request.time` on creation, and `authorId` + `createdAt` are strictly immutable on update while `updatedAt == request.time`.
  5. **Strict Schema & No Shadow Fields**: `data.keys().hasAll(...)` and `data.keys().hasOnly(...)` block all extra/ghost properties on both `create` and `update`, and `affectedKeys().hasOnly(...)` restricts update actions.
  6. **PII Isolation & Privilege Escalation Guard**: `/admins/{adminId}` stores no email/phone/address PII, forbids `list` and `update`, restricts `get` to `request.auth.uid == adminId || isBootstrappedAdmin()`, and restricts `create`/`delete` exclusively to `isBootstrappedAdmin()`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Product Write**: Anonymous client attempts to create `/products/prod-1`.
2. **Spoofed Unverified Admin Email**: Authenticated user with `email: 'kethelyn.fonseca9@gmail.com'` and `email_verified: false` attempts to create `/products/prod-1`.
3. **Non-Admin Verified User Write**: Verified user `attacker@example.com` attempts to update price on `/products/prod-1`.
4. **Identity Spoofing (`authorId` mismatch)**: Verified admin creates `/products/prod-1` with `authorId: 'someone-else'`.
5. **Shadow / Ghost Field Injection**: Verified admin sends valid product payload plus `isFeatured: true` (`hasOnly` violation).
6. **ID Poisoning Attack**: Verified admin targets `/products/bad$id!with spaces` or 200-char ID (`isValidId` violation).
7. **Value / String Overflow Poisoning**: Verified admin sends a 2,000-character `descricao` or invalid `categoria: 'Eletrônicos'`.
8. **Invalid Pricing / Promotion Logic**: Verified admin sets `promocao: true` with `precoPromocional: 50` when `preco: 35` (`precoPromocional >= preco`), or negative `preco: -10`.
9. **Immutable Field Tampering**: Verified admin updates `/products/prod-1` while modifying `createdAt` or `authorId`.
10. **Forged Client Timestamp**: Verified admin creates or updates `/products/prod-1` with a past/future `Timestamp` instead of `request.time`.
11. **Blanket Unfiltered Public List Scrape**: Unauthenticated visitor executes `getDocs(collection(db, 'products'))` without `where('publicado', '==', true)` when unpublished items exist.
12. **Self-Assigned Admin Escalation & Admin Enumeration**: Verified non-admin attempts `setDoc(doc(db, 'admins', uid), ...)` or `getDocs(collection(db, 'admins'))`.
