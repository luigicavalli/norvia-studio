CREATE TYPE client_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PROSPECT',
    'UNKNOWN'
);

CREATE TYPE project_status AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED',
    'UNKNOWN'
);

CREATE TYPE project_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL',
    'UNKNOWN'
);

CREATE TYPE quote_status AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED'
);

CREATE TYPE invoice_status AS ENUM (
    'DRAFT',
    'SENT',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);

CREATE TYPE team_member_role AS ENUM (
    'SUPERADMIN',
    'ADMIN',
    'OWNER',
    'MEMBER',
    'VIEWER'
);

CREATE TYPE team_member_status AS ENUM (
    'ACTIVE',
    'PENDING'
);

CREATE TYPE currency AS ENUM (
    'USD',
    'EUR',
    'GBP'
);
