# Fullstack Web App Template

[![Deploy Backend Infrastructure](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_backend_infra.yml/badge.svg?branch=main)](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_backend_infra.yml) [![Deploy Backend](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_backend.yml/badge.svg)](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_backend.yml) [![Deploy Frontend Infrastructure](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_frontend_infra.yml/badge.svg)](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_frontend_infra.yml) [![Deploy Frontend](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_frontend.yml/badge.svg)](https://github.com/imranmatin23/fullstack-web-app-template/actions/workflows/deploy_frontend.yml)

This repository is a template for setting up a full stack web app with React (Frontend), Django (Backend), PostgreSQL (Database), Docker (Containers), Terraform (IaaC), AWS (3PC), and Github Actions (CI/CD).

You can access the frontend at https://template.imranmatin.com and the backend at https://api.template.imranmatin.com.

![High Level Architecture](images/high-level-architecture.png)

<div style="text-align:center">
  <a href="https://lucid.app/lucidchart/61862a22-6730-4e64-aada-cd3617d847a3/edit?viewport_loc=-613%2C-1072%2C3552%2C1902%2C0_0&invitationId=inv_61387a4a-f09a-4db2-b2ba-9c67d432c55f">High Level Architecture Diagram</a>
</div>

## Environments

The following environments are available for this app.

- `local`
- ~~`dev`~~
- ~~`alpha`~~
- ~~`beta`~~
- `prod`

## Frontend

The frontend was created using the `create-react-app` CLI. See [frontend/README.md](frontend/README.md) for further details about the fronted.

## Backend

The backend was created using the `django-admin` CLI and the database was created using `PostgreSQL`. See [backend/README.md](backend/README.md) for further details about the backend.

## Infrastructure

The infrastructure was created using `docker`, `terraform` and `AWS`. See [infra/README.md](infra/README.md) for further details about the infrastructure.

## CI (Build/Test) / CD (Deploy) Pipeline

The CI/CD pipeline was created using `GitHub Actions`. See [.github/workflows/README.md](.github/workflows/README.md) for further details about the CI/CD pipeline.

## Enhancements

- Add test scaffolding (unit, integration, canary, etc.) for frontend/backend.
- Read backend secrets from AWS Secrets Manager rather than from environment variables.
- Convert frontend CI/CD to use Github Actions for build, test, deploy and convert frontend Amplify to manual hosting (i.e. no Git provider connecting and no build, test, deploy in Amplify)
- Add dev/alpha/beta stages
  - Secure dev/alpha/beta/prod stages
  - Create infrastructure
  - Add CI/CD stages using only Github Actions (NOTE: GitHub Actions has a Workflow Visualizer that is the equivalent of a Pipeline Visualizer).
  - Update frontend/backend app code
