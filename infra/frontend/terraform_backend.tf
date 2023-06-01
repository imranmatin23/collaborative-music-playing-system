terraform {
  backend "s3" {
    bucket = "imatin-personal-tfstate"
    key    = "houseparty-frontend/terraform.tfstate"
    region = "us-west-2"
  }
}