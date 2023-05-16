resource "aws_cloudfront_origin_access_identity" "jowe_web" {
  comment = var.domain_name
}

resource "aws_cloudfront_distribution" "jowe_web" {
  origin {
    domain_name = aws_s3_bucket.jowe_web.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.jowe_web.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "jowe-web"
  default_root_object = "index.html"

  # Configure logging here if required
  #logging_config {
  #  include_cookies = false
  #  bucket          = "mylogs.s3.amazonaws.com"
  #  prefix          = "myprefix"
  #}

  aliases = [var.domain_name]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["HEAD", "GET", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 1
    default_ttl            = 1
    max_ttl                = 1
  }

  price_class = "PriceClass_100"

  custom_error_response {
    error_code            = 400
    error_caching_min_ttl = 0
    response_page_path    = "/index.html"
    response_code         = 200
  }

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 0
    response_page_path    = "/index.html"
    response_code         = 200
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 0
    response_page_path    = "/index.html"
    response_code         = 200
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["SI", "AT", "DE", "CH", "HR", "JP", "PH"]
    }
  }

  tags = {
    Name        = var.project_name
    Environment = var.ENV
    App         = var.app_name
  }

  viewer_certificate {
    acm_certificate_arn      = var.AWS_CERTIFICATE_ARN
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }
}
