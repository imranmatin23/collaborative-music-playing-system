# VPC
resource "aws_vpc" "vpc" {
  cidr_block           = "11.0.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-${var.stage}-vpc"
  }
}

# Public subnets
resource "aws_subnet" "public_subnet_1" {
  cidr_block        = "11.0.0.0/26"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = split(",", var.availability_zones)[0]
  tags = {
    Name = "${var.project_name}-${var.stage}-public-subnet-1"
  }
}
resource "aws_subnet" "public_subnet_2" {
  cidr_block        = "11.0.0.64/26"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = split(",", var.availability_zones)[1]
  tags = {
    Name = "${var.project_name}-${var.stage}-public-subnet-2"
  }
}

# Private subnets
resource "aws_subnet" "private_subnet_1" {
  cidr_block        = "11.0.0.128/26"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = split(",", var.availability_zones)[0]
  tags = {
    Name = "${var.project_name}-${var.stage}-private-subnet-1"
  }
}
resource "aws_subnet" "private_subnet_2" {
  cidr_block        = "11.0.0.192/26"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = split(",", var.availability_zones)[1]
  tags = {
    Name = "${var.project_name}-${var.stage}-private-subnet-2"
  }
}

# Route tables and association with the subnets
resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.vpc.id
}
resource "aws_route_table_association" "public_rtb_public_subnet_1_association" {
  route_table_id = aws_route_table.public_rtb.id
  subnet_id      = aws_subnet.public_subnet_1.id
}
resource "aws_route_table_association" "public_rtb_public_subnet_2_association" {
  route_table_id = aws_route_table.public_rtb.id
  subnet_id      = aws_subnet.public_subnet_2.id
}

resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.vpc.id
}
resource "aws_route_table_association" "private_rtb_private_subnet_1_association" {
  route_table_id = aws_route_table.private_rtb.id
  subnet_id      = aws_subnet.private_subnet_1.id
}
resource "aws_route_table_association" "private_rtb_private_subnet_2_association" {
  route_table_id = aws_route_table.private_rtb.id
  subnet_id      = aws_subnet.private_subnet_2.id
}

# Internet Gateway for the public subnet
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
}
resource "aws_route" "public_rtb_igw_route" {
  route_table_id         = aws_route_table.public_rtb.id
  gateway_id             = aws_internet_gateway.igw.id
  destination_cidr_block = "0.0.0.0/0"
}

# # NAT gateway (Not required because ECS Service is deployed in public subnet)
# resource "aws_eip" "nat_gw_eip" {
#   vpc                       = true
#   associate_with_private_ip = "11.0.0.5"
#   depends_on                = [aws_internet_gateway.igw]
# }
# resource "aws_nat_gateway" "nat_gw" {
#   allocation_id = aws_eip.nat_gw_eip.id
#   subnet_id     = aws_subnet.public_subnet_1.id
# }
# resource "aws_route" "public_rtb_nat_gateway_route" {
#   route_table_id         = aws_route_table.public_rtb.id
#   nat_gateway_id         = aws_nat_gateway.nat_gw.id
#   destination_cidr_block = "0.0.0.0/0"
# }
