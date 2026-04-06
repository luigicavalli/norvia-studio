CREATE TABLE invoice_items (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID          NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT          NOT NULL,
    quantity    NUMERIC(10,2) NOT NULL,
    unit_price  NUMERIC(12,2) NOT NULL,
    currency    currency      NOT NULL
);
