# Create an SSL certificate
resource "aws_acm_certificate" "certificate" {
  domain_name       = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method = "DNS"
lifecycle {
    create_before_destroy = true
  }
}

# Tell terraform to cause the route53 validation to happen
resource "aws_acm_certificate_validation" "certificate_validation" {
  certificate_arn         = aws_acm_certificate.certificate.arn
  validation_record_fqdns = [ aws_route53_record.certificate_validation.fqdn ]
}
