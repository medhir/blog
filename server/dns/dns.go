package dns

import (
	"errors"
	"fmt"
	"github.com/cloudflare/cloudflare-go"
	"os"
)

const (
	zone            = "medhir.com"
	cnameRecordType = "CNAME"
)

// Manager describes the methods available for the dns manager
type Manager interface {
	AddCNAMERecord(name string) error
	DeleteCNAMERecord(name string) error
}

type manager struct {
	api    *cloudflare.API
	zoneID string
}

// NewManager instantiates a new DNS manager
func NewManager() (Manager, error) {
	key, ok := os.LookupEnv("CLOUDFLARE_API_KEY")
	if !ok {
		return nil, errors.New("cloudflare API key missing. cloudflare API key must be set as environment variable CLOUDFLARE_API_KEY")
	}
	email, ok := os.LookupEnv("CLOUDFLARE_API_EMAIL")
	if !ok {
		return nil, errors.New("cloudflare API email missing. cloudflare API email must be set as environment variable CLOUDFLARE_API_EMAIL")
	}
	api, err := cloudflare.New(key, email)
	if err != nil {
		return nil, err
	}
	zoneID, err := api.ZoneIDByName(zone)
	return &manager{
		api:    api,
		zoneID: zoneID,
	}, nil
}

func (m *manager) AddCNAMERecord(name string) error {
	record := cloudflare.DNSRecord{
		Type:    cnameRecordType,
		Name:    name,
		Content: zone,
		TTL:     1, // a value of 1 sets the TTL automatically - https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
		Proxied: true,
	}
	resp, err := m.api.CreateDNSRecord(m.zoneID, record)
	if err != nil {
		return err
	}
	if len(resp.Errors) > 0 {
		return fmt.Errorf("the following errors occured in setting the CNAME record - %v", resp.Errors)
	}
	return nil
}

func (m *manager) DeleteCNAMERecord(name string) error {
	record := cloudflare.DNSRecord{
		Name: name,
	}
	recordMetadata, err := m.api.DNSRecords(m.zoneID, record)
	if err != nil {
		return err
	}
	if len(recordMetadata) != 1 {
		return errors.New("more than one DNS record was returned for this record name, or no dns record was found. cannot delete CNAME record")
	}
	recordID := recordMetadata[0].ID
	err = m.api.DeleteDNSRecord(m.zoneID, recordID)
	if err != nil {
		return err
	}
	return nil
}
