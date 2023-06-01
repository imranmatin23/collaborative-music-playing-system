module "amplify_app" {
  source  = "cloudposse/amplify-app/aws"
  access_token = var.gh_personal_access_token
  name       = "${var.project_name}-frontend"
  description  = "${var.project_name}-frontend"
  repository = var.gh_repository
  platform     = "WEB"

  enable_auto_branch_creation = false
  enable_branch_auto_build    = false
  enable_branch_auto_deletion = false
  enable_basic_auth           = false

  auto_branch_creation_config = {
    enable_auto_build = false
  }

  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL" >> .env
                - npm run build
          artifacts:
            baseDirectory: build
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
        appRoot: frontend
  EOT

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
    AMPLIFY_DIFF_DEPLOY = "false"
    REACT_APP_BACKEND_URL = var.backend_url
  }

  environments = {
    main = {
      branch_name                 = "main"
      enable_auto_build           = false
      backend_enabled             = false
      enable_performance_mode     = false
      enable_pull_request_preview = false
      framework                   = "React"
      stage                       = "PRODUCTION"
    }
  }

  domain_config = {
    domain_name            = var.domain_name
    enable_auto_sub_domain = true
    wait_for_verification  = true
    sub_domain = [
      {
        branch_name = "main"
        prefix      = var.sub_domain_prefix
      },
    ]
  }

  custom_rules = [
    {
      condition = null,
      source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
      status = "200",
      target = "/index.html"
    }
  ]
}