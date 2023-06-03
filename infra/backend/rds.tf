# resource "aws_db_subnet_group" "prod" {
#   name       = "prod"
#   subnet_ids = [aws_subnet.prod_private_1.id, aws_subnet.prod_private_2.id]
# }

# resource "aws_rds_cluster" "prod" {
#   cluster_identifier = "prod"
#   engine             = "aurora-postgresql"
#   engine_mode        = "provisioned"
#   engine_version     = "15.2"
#   database_name      = var.sql_database
#   master_username    = var.sql_user
#   master_password    = var.sql_password
#   port                    = var.sql_port
#   vpc_security_group_ids  = [aws_security_group.rds_prod.id]
#   db_subnet_group_name    = aws_db_subnet_group.prod.name
#   storage_encrypted       = false
#   skip_final_snapshot     = true
#   serverlessv2_scaling_configuration {
#     max_capacity = 1.0
#     min_capacity = 0.5
#   }
# }

# resource "aws_rds_cluster_instance" "prod" {
#   identifier = "prod"
#   cluster_identifier = aws_rds_cluster.prod.id
#   instance_class     = "db.serverless"
#   engine             = aws_rds_cluster.prod.engine
#   engine_version     = aws_rds_cluster.prod.engine_version
#   db_subnet_group_name    = aws_db_subnet_group.prod.name
#   publicly_accessible = false
# }

# resource "aws_security_group" "rds_prod" {
#   name        = "rds-prod"
#   vpc_id      = aws_vpc.vpc.id

#   ingress {
#     protocol        = "tcp"
#     from_port       = var.sql_port
#     to_port         = var.sql_port
#     security_groups = [aws_security_group.prod_ecs_backend.id]
#   }

#   egress {
#     protocol    = "-1"
#     from_port   = 0
#     to_port     = 0
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }
