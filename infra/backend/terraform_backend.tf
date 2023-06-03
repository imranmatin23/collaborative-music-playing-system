terraform {
  backend "s3" {
    bucket = "imatin-personal-tfstate"
    key    = "houseparty-prod-backend/terraform.tfstate"
    region = "us-west-2"
  }
}