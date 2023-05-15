resource "aws_s3_object" "upload_webapp" {
  for_each = var.files

  bucket       = aws_s3_bucket.jowe_web.id
  key          = each.key
  content_type = each.value.content_type

  # The template_files module guarantees that only one of these two attributes
  # will be set for each file, depending on whether it is an in-memory template
  # rendering result or a static file on disk.
  source  = each.value.source_path
  content = each.value.content

  etag = filemd5(each.value.source_path)

  depends_on = [
    aws_s3_bucket.jowe_web,
    aws_s3_bucket_versioning.jowe_web
  ]
}
