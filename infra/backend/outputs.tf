output "alb_domain" {
  value = aws_lb.alb.dns_name
}

# output "prod_db_domain" {
#   value = aws_rds_cluster.prod.endpoint
# }