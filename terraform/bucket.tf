resource "aws_s3_bucket" "jowe_web" {
  bucket = var.bucket_name

  tags = {
    Name        = var.app_name
    Environment = var.ENV
    App         = var.app_name
  }
}

resource "aws_s3_bucket_website_configuration" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

resource "aws_s3_bucket_cors_configuration" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["DELETE", "GET", "POST", "OPTIONS"]
    #allowed_origins = ["https://${var.domain_name}"]
    allowed_origins = ["*"]
    #expose_headers  = ["ETag"]
    max_age_seconds = 300
  }

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

resource "aws_s3_bucket_ownership_controls" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

resource "aws_s3_bucket_public_access_block" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

resource "aws_s3_bucket_acl" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id
  acl    = "public-read"

  depends_on = [
    aws_s3_bucket_ownership_controls.jowe_web,
    aws_s3_bucket_public_access_block.jowe_web,
  ]
}
