CREATE TABLE team_members (
    id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID             NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id      TEXT             NOT NULL,
    role         team_member_role NOT NULL DEFAULT 'MEMBER',
    created_at   TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ      NOT NULL DEFAULT now(),

    UNIQUE (workspace_id, user_id)
);
