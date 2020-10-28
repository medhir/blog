package sql

import "database/sql"

// User describes the metadata for a site user
type User struct {
	ID                  string         `json:"id"`
	Username            string         `json:"username"`
	FirstName           sql.NullString `json:"first_name"`
	LastName            sql.NullString `json:"last_name"`
	StripeCustomerToken sql.NullString `json:"stripe_customer_token"`
	InstancePassword    sql.NullString `json:"instance_password"`
}

func (p *postgres) CreateUser(id, username, email string) error {
	query := `
INSERT INTO "user" (id, username, email)
VALUES ($1, $2, $3);`
	_, err := p.db.Exec(query, id, username, email)
	if err != nil {
		return err
	}
	return nil
}
