# EC2 Instance
resource "aws_instance" "ec2-instance" {
  ami = "ami-03f65b8614a860c29"
  associate_public_ip_address = true
  instance_type = "t2.nano"
  key_name = var.key_pair_name
  subnet_id = aws_subnet.public_subnet_1.id
  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]
  
  tags = {
    Name = "${var.project_name}-${var.stage}-ec2-instance"
  }
}

# Security Group
resource "aws_security_group" "ec2_security_group" {
  name        = "${var.project_name}-${var.stage}-ec2-security-group"
  description = "Controls access to the EC2"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
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

# Elastic IP
resource "aws_eip" "ec2-instance-eip" {
  instance = aws_instance.ec2-instance.id
}
