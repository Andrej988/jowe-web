module "web" {
  source       = "./terraform/"
  domain_name  = var.domain_name
  bucket_name  = var.bucket_name
  ENV          = var.ENV
  app_name     = var.app_name
  project_name = var.project_name
}
