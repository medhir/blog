resource "google_compute_global_address" "private_ip_address" {
  provider = google-beta

  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = module.vpc_network.network
}

resource "google_service_networking_connection" "private_vpc_connection" {
  provider = google-beta

  network                 = module.vpc_network.network
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

resource "random_id" "db_name_suffix" {
  byte_length = 4
}

resource "google_sql_database_instance" "medhir-db-test" {
  provider = google-beta

  name   = "private-instance-${random_id.db_name_suffix.hex}-test"
  region = var.region
  database_version = "POSTGRES_9_6"

  depends_on = [google_service_networking_connection.private_vpc_connection]
  settings {
    tier = var.default_db_tier
    ip_configuration {
      ipv4_enabled    = false
      private_network = module.vpc_network.network
    }
  }
}

resource "google_sql_user" "users" {
  name     = "gitlab"
  instance = google_sql_database_instance.medhir-db-test.name
  password = "wave6,gambit"
}