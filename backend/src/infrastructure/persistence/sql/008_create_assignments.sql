CREATE TABLE assignments (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    team_member_id UUID        NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (project_id, team_member_id)
);
