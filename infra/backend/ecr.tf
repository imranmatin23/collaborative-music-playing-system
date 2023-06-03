resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-${var.stage}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete = true
}
