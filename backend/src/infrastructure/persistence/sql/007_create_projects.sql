CREATE TABLE projects (
    id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID             NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id       UUID             NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    quote_id        UUID             REFERENCES quotes(id) ON DELETE SET NULL,
    name            VARCHAR(255)     NOT NULL,
    description     TEXT,
    status          project_status   NOT NULL DEFAULT 'DRAFT',
    priority        project_priority NOT NULL DEFAULT 'UNKNOWN',
    budget_amount   NUMERIC(12, 2),
    budget_currency currency,
    start_date      DATE,
    due_date        DATE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ      NOT NULL DEFAULT now()
);
