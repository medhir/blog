# ---------------------------------------------------------------------------------------------------------------------
# Deploy a private GKE cluster in GCP
# ---------------------------------------------------------------------------------------------------------------------

module "gke_cluster" {
  source = "./modules/gke-cluster"

  name = var.cluster_name

  project  = var.project
  location = var.zone
  network  = module.vpc_network.network

  # We're deploying the cluster in the 'public' subnetwork to allow outbound internet access
  # See the network access tier table for full details:
  # https://github.com/gruntwork-io/terraform-google-network/tree/master/modules/vpc-network#access-tier
  subnetwork = module.vpc_network.public_subnetwork

  # When creating a private cluster, the 'master_ipv4_cidr_block' has to be defined and the size must be /28
  master_ipv4_cidr_block = var.master_ipv4_cidr_block

  # This setting will make the cluster private
  enable_private_nodes = "true"

  # To make testing easier, we keep the public endpoint available. In production, we highly recommend restricting access to only within the network boundary, requiring your users to use a bastion host or VPN.
  disable_public_endpoint = "false"

  # With a private cluster, it is highly recommended to restrict access to the cluster master
  # NOTE: This IP address is not static. Consider the range 97.113.0.0/16 for ip addresses from 97.113.0.0 - 97.113.255.255
  master_authorized_networks_config = [
    {
      cidr_blocks = [
        {
          # This block is for internet access from 8221 4th Ave NE Seattle, WA
          cidr_block   = "71.212.0.0/16"
          display_name = "personal"
        },
        {
          # This block is for allowing gitlab servers to reach the cluster api endpoint.
          cidr_block = "34.74.90.64/28"
          display_name = "gitlab"
        },
        {
          # This block is for internet access from 11235 Bridge House Road Windermere, FL
          cidr_block   = "71.214.0.0/16"
          display_name = "personal"
        }
      ]
    },
  ]

  cluster_secondary_range_name = module.vpc_network.public_subnetwork_secondary_range_name
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A NODE POOL
# ---------------------------------------------------------------------------------------------------------------------

resource "google_container_node_pool" "node_pool" {
  provider = google-beta

  name     = "private-pool"
  project  = var.project
  location = var.zone
  cluster  = module.gke_cluster.name

  initial_node_count = "4"

  autoscaling {
    min_node_count = "4"
    max_node_count = "16"
  }

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  node_config {
    image_type   = "COS"
    machine_type = "e2-small"

    labels = {
      private-pools-example = "true"
    }

    # Add a private tag to the instances. See the network access tier table for full details:
    # https://github.com/gruntwork-io/terraform-google-network/tree/master/modules/vpc-network#access-tier
    tags = [
      module.vpc_network.private,
      "medhir-blog-private-pool",
    ]

    disk_size_gb = "10"
    disk_type    = "pd-standard"
    preemptible = false

    service_account = var.cluster_service_account_email

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  lifecycle {
    ignore_changes = [initial_node_count]
  }

  timeouts {
    create = "30m"
    update = "30m"
    delete = "30m"
  }
}


resource "google_container_node_pool" "coder_node_pool" {
   provider = google-beta

   name     = "private-coder-pool"
   project  = var.project
   location = var.zone
   cluster  = module.gke_cluster.name

   initial_node_count = "1"

   autoscaling {
     min_node_count = "1"
     max_node_count = "20"
   }

   management {
     auto_repair  = "true"
     auto_upgrade = "true"
   }

   node_config {
     image_type   = "COS"
     machine_type = "n2-standard-2"

     labels = {
       coder = "true"
     }

     # Add a private tag to the instances. See the network access tier table for full details:
     # https://github.com/gruntwork-io/terraform-google-network/tree/master/modules/vpc-network#access-tier
     tags = [
       module.vpc_network.private,
       "medhir-blog-private-coder-pool",
     ]

     disk_size_gb = "51"
     disk_type    = "pd-standard"
     preemptible  = true

     service_account = var.cluster_service_account_email

     oauth_scopes = [
       "https://www.googleapis.com/auth/cloud-platform",
     ]
   }

   lifecycle {
     ignore_changes = [initial_node_count]
   }

   timeouts {
     create = "30m"
     update = "30m"
     delete = "30m"
   }
 }


# ---------------------------------------------------------------------------------------------------------------------
# CREATE A NETWORK TO DEPLOY THE CLUSTER TO
# ---------------------------------------------------------------------------------------------------------------------

module "vpc_network" {
  source = "github.com/gruntwork-io/terraform-google-network.git//modules/vpc-network?ref=v0.2.1"

  name_prefix = "${var.cluster_name}-network-${random_string.suffix.result}"
  project     = var.project
  region      = var.region

  cidr_block           = var.vpc_cidr_block
  secondary_cidr_block = var.vpc_secondary_cidr_block
}

# Use a random suffix to prevent overlap in network names
resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
}
