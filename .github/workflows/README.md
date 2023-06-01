# CI/CD Pipeline

The CI/CD pipeline was created using `GitHub Actions`.

## Frontend

The frontend CI/CD is defined in `.github/workflows/deploy_frontend.yml`. Using the latest commit, 1/ GitHub Actions will kick off an Amplify Job and 2/ Amplify will then execute the build, test, and deploy phases according to the `build_spec` defined in `infra/frontend/amplify.ts`.

A deployment to `prod` can also be started using the `make deploy-frontend` command (although this will use the latest commit in `origin/main` by default).

## Backend

The backend CI/CD is defined in the `.github/workflows/deploy_backend.yml`. Using the latest commit, 1/ Github Actions will build, tag, and push a new image to ECR, 2/ GitHub Actions will create a new version of the ECS Task Definition with the new image, and 3/ GitHub actions will deploy the image to ECS.

A deployment to `prod` can also be started using the `make deploy-backend` command and it will use the local Docker image that was built most recently.

## References

[1] https://docs.github.com/en/actions
