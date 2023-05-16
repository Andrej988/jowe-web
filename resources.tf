module "template_files" {
  source = "hashicorp/dir/template"

  base_dir = "./build/"
  #template_vars = {
  #  # Pass in any values that you wish to use in your templates.
  #  vpc_id = "vpc-abc123"
  #}
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
