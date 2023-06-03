# Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project_name}-${var.stage}-ecs-cluster"
}

# Task Definition
resource "aws_ecs_task_definition" "ecs_task_definition" {
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  family = "${var.project_name}-${var.stage}-task-definition"
  container_definitions = templatefile(
    "templates/backend_container.json.tpl",
    {
      region     = var.region
      name       = "${var.project_name}-${var.stage}"
      image      = aws_ecr_repository.backend.repository_url
      log_group  = aws_cloudwatch_log_group.cw_log_group.name
      log_stream = aws_cloudwatch_log_stream.cw_log_stream.name
      secret_key  = var.secret_key
      debug = var.debug
      cors_origin_allow_all = var.cors_origin_allow_all
      cors_allow_credentials = var.cors_allow_credentials
      allowed_hosts = var.allowed_hosts
      database_type = var.database_type
      sql_engine = var.sql_engine
      sql_database = var.sql_database
      sql_user = var.sql_user
      sql_password = var.sql_password
      sql_host = aws_rds_cluster.rds_cluster.endpoint
      # sql_host = "N/A"
      sql_port = var.sql_port
      spotify_client_id = var.spotify_client_id
      spotify_client_secret = var.spotify_client_secret
      spotify_redirect_uri = var.spotify_redirect_uri
      frontend_endpoint = var.frontend_endpoint
    },
  )
  execution_role_arn = aws_iam_role.ecs_task_execution_iam_role.arn
  task_role_arn      = aws_iam_role.ecs_task_task_iam_role.arn
}

# Service
resource "aws_ecs_service" "ecs_service" {
  name                               = "${var.project_name}-${var.stage}-ecs-service"
  cluster                            = aws_ecs_cluster.ecs_cluster.id
  task_definition                    = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count                      = 1
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_target_group.arn
    container_name   = "${var.project_name}-${var.stage}"
    container_port   = 80
  }

  network_configuration {
    security_groups  = [aws_security_group.ecs_service_security_group.id]
    subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
    assign_public_ip = true
  }
}

# Security Group
resource "aws_security_group" "ecs_service_security_group" {
  name        = "${var.project_name}-${var.stage}-ecs-service-security-group"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IAM roles and policies
resource "aws_iam_role" "ecs_task_task_iam_role" {
  name = "${var.project_name}-${var.stage}-ecs-task-task-iam-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = ""
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_execution_iam_role" {
  name = "${var.project_name}-${var.stage}-ecs-task-execution-iam-role"

  assume_role_policy = jsonencode(
    {
      Version = "2012-10-17",
      Statement = [
        {
          Action = "sts:AssumeRole",
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          },
          Effect = "Allow",
          Sid    = ""
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Cloudwatch Logs
resource "aws_cloudwatch_log_group" "cw_log_group" {
  name              = "${var.project_name}-${var.stage}-cw-log-group"
  retention_in_days = var.ecs_backend_retention_days
}

resource "aws_cloudwatch_log_stream" "cw_log_stream" {
  name           = "${var.project_name}-${var.stage}-cw-log-stream"
  log_group_name = aws_cloudwatch_log_group.cw_log_group.name
}
