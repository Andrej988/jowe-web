resource "aws_s3_bucket" "jowe_web" {
  bucket = var.BUCKET_NAME

  tags = {
    Name        = var.project_name
    Environment = var.ENV
    App         = var.app_name
  }
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

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

resource "aws_s3_bucket_acl" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id
  acl    = "private"

  depends_on = [
    aws_s3_bucket_ownership_controls.jowe_web,
    aws_s3_bucket_public_access_block.jowe_web,
  ]
}

resource "aws_s3_bucket_versioning" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id

  versioning_configuration {
    status = "Enabled"
  }

  depends_on = [
    aws_s3_bucket.jowe_web
  ]
}

data "aws_iam_policy_document" "jowe_web_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.jowe_web.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.jowe_web.iam_arn]
    }
  }

  depends_on = [
    aws_s3_bucket.jowe_web,
    aws_cloudfront_origin_access_identity.jowe_web
  ]
}

resource "aws_s3_bucket_policy" "jowe_web" {
  bucket = aws_s3_bucket.jowe_web.id
  policy = data.aws_iam_policy_document.jowe_web_s3_policy.json

  depends_on = [
    aws_s3_bucket.jowe_web,
    data.aws_iam_policy_document.jowe_web_s3_policy
  ]
}
