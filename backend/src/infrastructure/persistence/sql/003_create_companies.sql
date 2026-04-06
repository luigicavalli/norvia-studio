CREATE TABLE companies (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name         VARCHAR(255) NOT NULL,
    tax_code     VARCHAR(100),
    email        VARCHAR(255),
    phone        BIGINT,
    address      TEXT,
    city         VARCHAR(100),
    zip_code     INTEGER,
    country      VARCHAR(100),
    website      VARCHAR(255),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
