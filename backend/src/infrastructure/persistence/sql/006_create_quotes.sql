CREATE TABLE quotes (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_id    UUID         NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    number       INTEGER      NOT NULL,
    status       quote_status NOT NULL DEFAULT 'DRAFT',
    issue_date   DATE         NOT NULL,
    expires_at   DATE         NOT NULL,
    notes        TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),

    UNIQUE (workspace_id, number)
);
