# Validation

Run the complete Maven backend tests and Next.js production build. Verify migrated IDs 1001-1004, then POST, GET, PUT, and DELETE through HTTP while independently querying orders-target. Restart Spring Boot without resetting PostgreSQL and prove rows persist. Reject H2, SQLite, or any embedded fallback.
