package sql

import (
	"database/sql"
	"errors"
)

// User describes the metadata for a site user
type User struct {
	ID                  string         `json:"id"`
	Username            string         `json:"username"`
	Email               string         `json:"email"`
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

func (p *postgres) DeleteUser(id string) error {
	query := `
DELETE FROM "user"
WHERE id = $1`
	res, err := p.db.Exec(query, id)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("lesson was not deleted, zero rows affected by delete query")
	}
	return nil
}

func (p *postgres) GetUserByUsernameOrEmail(usernameOrEmail string) (*User, error) {
	user := &User{}
	query := `
SELECT id, username, email, first_name, last_name, stripe_customer_token, instance_password
FROM "user"
WHERE username = $1 OR email = $1;`
	err := p.db.QueryRow(query, usernameOrEmail).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.StripeCustomerToken,
		&user.InstancePassword,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}
