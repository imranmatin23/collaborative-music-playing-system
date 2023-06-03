resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.project_name}-${var.stage}-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

resource "aws_rds_cluster" "rds_cluster" {
  cluster_identifier = "${var.project_name}-${var.stage}-rds-cluster"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "15.2"
  database_name      = var.sql_database
  master_username    = var.sql_user
  master_password    = var.sql_password
  port                    = var.sql_port
  vpc_security_group_ids  = [aws_security_group.rds_cluster_security_group.id]
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  storage_encrypted       = false
  skip_final_snapshot     = true
  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }
}

resource "aws_rds_cluster_instance" "rds_cluster_instance" {
  identifier = "${var.project_name}-${var.stage}-rds-cluster-instance"
  cluster_identifier = aws_rds_cluster.rds_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.rds_cluster.engine
  engine_version     = aws_rds_cluster.rds_cluster.engine_version
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  publicly_accessible = false
}

resource "aws_security_group" "rds_cluster_security_group" {
  name        = "${var.project_name}-${var.stage}-rds-cluster-security-group"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = var.sql_port
    to_port         = var.sql_port
    security_groups = [aws_security_group.ecs_service_security_group.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
