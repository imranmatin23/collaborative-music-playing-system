# DNS record for the ACM certificate validation to prove we own the domain
resource "aws_route53_record" "certificate_validation" {
  zone_id = var.route53_hosted_zone_id
  name            = tolist(aws_acm_certificate.certificate.domain_validation_options)[0].resource_record_name
  records         = [ tolist(aws_acm_certificate.certificate.domain_validation_options)[0].resource_record_value ]
  type            = tolist(aws_acm_certificate.certificate.domain_validation_options)[0].resource_record_type
  ttl = 300
}

# Create a Route53 Record to the ALB
resource "aws_route53_record" "r53_record" {
  zone_id = var.route53_hosted_zone_id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = 300
  records = [aws_lb.alb.dns_name]
}