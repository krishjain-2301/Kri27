# Provider Flow Architecture

This diagram illustrates the core data pipeline for CyberVault's synchronization engine. This guarantees deterministic behavior and shields the local SQLite database from upstream API changes.

```mermaid
graph TD
    A[HackTheBox API] -->|Raw JSON| B(HTTP Client)
    B -->|Schema Parsing| C{Zod Validation}
    
    C -->|Fails| D[Throw API Schema Error]
    C -->|Passes| E[Mapper]
    
    E -->|Transforms| F((CyberVaultItem))
    
    F -->|Upsert| G[(SQLite Database)]
    G -->|Queries| H[UI Dashboard & Timeline]

    classDef valid fill:#2e7d32,stroke:#1b5e20,color:white;
    classDef invalid fill:#c62828,stroke:#b71c1c,color:white;
    
    class C valid;
    class D invalid;
```

### Components
1. **HTTP Client**: Fetches raw data from versioned, hardcoded endpoints.
2. **Zod Validation**: Validates the payload against expected shapes. Strips out unused fields using `.pick()` or `.passthrough()`.
3. **Mapper**: Converts the strictly validated JSON into the generic `CyberVaultItem` model, applying any normalization (e.g., mapping "Very Easy" to our enum).
4. **Repository**: Executes `upsert` queries into the SQLite database based on `providerId`.
