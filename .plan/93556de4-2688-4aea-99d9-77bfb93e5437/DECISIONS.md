# Locked Decisions for Story 93556de4-2688-4aea-99d9-77bfb93e5437

## Implementation Approach
Build one vertical slice with a Spring Boot 3 REST backend and a minimal Next.js frontend. Use Maven, Java 21, Spring Data JPA, Flyway, and the PostgreSQL JDBC driver. The backend service in preview.manifest.json must run Flyway migrations before starting. No authentication, reports, audit features, or production deployment.

## Data Mapping
Treat orders-source as immutable input and orders-target as the only application database. Preserve IDs 1001-1004 plus customer_name, customer_email, item_description, quantity, unit_price_cents, status, notes, created_at, and updated_at. Store money as integer cents and preserve NEW, PAID, SHIPPED, and CANCELLED statuses.

## UI/UX
Provide only an Orders list and simple create, edit, and delete interactions in Next.js. Show important order fields and validation errors. Do not add dashboards, CSV export, authentication, reports, or visual redesign work beyond a usable responsive CRUD screen.

## Validation
Run the complete Maven backend tests and Next.js production build. Verify migrated IDs 1001-1004, then POST, GET, PUT, and DELETE through HTTP while independently querying orders-target. Restart Spring Boot without resetting PostgreSQL and prove rows persist. Reject H2, SQLite, or any embedded fallback.
