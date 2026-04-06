CREATE TABLE invoices (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID           NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id    UUID           NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    project_id   UUID           REFERENCES projects(id) ON DELETE SET NULL,
    number       INTEGER        NOT NULL,
    status       invoice_status NOT NULL DEFAULT 'DRAFT',
    issue_date   DATE           NOT NULL,
    due_date     DATE           NOT NULL,
    paid_at      TIMESTAMPTZ,
    notes        TEXT,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),

    UNIQUE (workspace_id, number)
);
