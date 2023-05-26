module "template_files" {
  source = "hashicorp/dir/template"
  base_dir = "./build/"
}

module "web" {
  source              = "./terraform/"
  AWS_CERTIFICATE_ARN = var.AWS_CERTIFICATE_ARN
  DOMAIN_NAME         = var.DOMAIN_NAME
  BUCKET_NAME         = var.BUCKET_NAME
  ENV                 = var.ENV
  app_name            = var.app_name
  project_name        = var.project_name
  files               = module.template_files.files
}
