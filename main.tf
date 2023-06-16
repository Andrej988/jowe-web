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
      version = ">= 5.4.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4.0"
    }
  }
  required_version = ">= 1.0"
}
