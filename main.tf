terraform {
  cloud {
    organization = "initialised-si"

    workspaces {
      name = "JoWe-Web"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.66.1"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.3.0"
    }
  }
  required_version = ">= 1.0"
}
