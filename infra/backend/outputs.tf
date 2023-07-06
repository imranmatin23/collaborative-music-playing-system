output "alb_domain" {
  value = aws_lb.alb.dns_name
}

# output "db_domain" {
#   value = aws_rds_cluster.rds_cluster.endpoint
# }