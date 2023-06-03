# Application Load Balancer for production
resource "aws_lb" "alb" {
  name               = "${var.project_name}-${var.stage}"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb_security_group.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

# Target group for backend web application
resource "aws_lb_target_group" "backend_target_group" {
  name        = "${var.project_name}-${var.stage}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 2
    interval            = 5
    matcher             = "200"
  }
}

# Target listener for http:80
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn = aws_acm_certificate.certificate.arn
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  depends_on        = [aws_lb_target_group.backend_target_group]

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_target_group.arn
  }
}

# Allow traffic from 80 and 443 ports only
resource "aws_security_group" "alb_security_group" {
  name        = "${var.project_name}-${var.stage}-alb-security-group"
  description = "Controls access to the ALB"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
