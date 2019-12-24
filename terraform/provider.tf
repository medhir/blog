terraform {
  # The modules used in this example have been updated with 0.12 syntax, additionally we depend on a bug fixed in
  # version 0.12.7.
  required_version = ">= 0.12.7"
  backend "gcs" {
    bucket      = "blog-121419-terraform-state"
    prefix      = "terraform"
    credentials = "account.json"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# PREPARE PROVIDERS
# ---------------------------------------------------------------------------------------------------------------------

provider "google" {
  version = "~> 2.9.0"
  project = var.project
  region  = var.region
}

provider "google-beta" {
  version = "~> 2.9.0"
  project = var.project
  region  = var.region
}
