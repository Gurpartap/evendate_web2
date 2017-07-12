CREATE TABLE email_texts (
  id                  SERIAL PRIMARY KEY,
  event_id            INT NOT NULL REFERENCES events (id) UNIQUE,
  payed               TEXT      DEFAULT NULL,
  approved            TEXT      DEFAULT NULL,
  not_approved        TEXT      DEFAULT NULL,
  after_event         TEXT      DEFAULT NULL,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NULL
);

ALTER TABLE "ticket_types"
  DROP CONSTRAINT ticket_types_start_after_ticket_type_uuid_fkey;

DELETE FROM notification_types
WHERE id = 1001;

INSERT INTO notification_types (id, type, timediff, text)
VALUES
  (100, 'notification-order-returned-by-organization', -1, 'Ваш заказ был отменен организатором');

-- waiting_for_payment,
-- returned_by_organization
-- without_payment
-- returned_by_client