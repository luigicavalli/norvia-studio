CREATE TABLE clients (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID          NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_id   UUID          REFERENCES companies(id) ON DELETE SET NULL,
    first_name   VARCHAR(100)  NOT NULL,
    last_name    VARCHAR(100)  NOT NULL,
    email        VARCHAR(255),
    phone        BIGINT,
    vat_number   VARCHAR(50),
    status       client_status NOT NULL DEFAULT 'UNKNOWN',
    notes        TEXT,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);
