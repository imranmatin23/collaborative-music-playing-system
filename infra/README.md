# Infrastructure

The infrastructure was created using `docker`, `terraform` and `AWS`.

## Frontend

To deploy the infrastructure remotely you can rely on `.github/workflows/deploy_frontend_infra.yml` (CI/CD with GitHub Actions). All secrets that are required during deployment are defined as GitHub Repository Secrets, therefore add the following GitHub Secret to the repository.

```bash
GH_PERSONAL_ACCESS_TOKEN="TODO"
```

To deploy the infrastructure from your local machine, execute `make deploy-infra-frontend` (NOTE: Terraform variable inputs are defined in `infra/frontend/prod.tfvars`). You must set the following environment variables locally before deploying:

```bash
export TF_VAR_gh_personal_access_token="TODO"
```

## Backend

NOTE: Currently the `S3` backend that is configured in `infra/backend/terraform_backend.tf` is set up for `prod`. To use a different backend you must manually update the `key` field in the backend (which will ensure you do not change the infrastructure of the production environment accidentally).

To deploy the infrastructure remotely you can rely on `.github/workflows/deploy_backend_infra.yml` (CI/CD with GitHub Actions). All secrets that are required during deployment are defined as GitHub Repository Secrets.

To deploy the infrastructure from your local machine, execute `make deploy-infra-backend` (NOTE: Terraform variable inputs are defined in `infra/backend/prod.tfvars`). You must set the following environment variables locally before deploying:

```bash
export TF_VAR_spotify_client_secret="TODO"
export TF_VAR_secret_key="TODO"
export TF_VAR_sql_password="TODO"
```

### Bastion Host

As part of the infrastructure, there is an EC2 instance that lives in a public subnet. You can SSH into the EC2 instance as long as you have the SSH Key-Pair specified in the Terraform variable `key_pair_name`.

```bash
chmod 400 us-west-2-key-pair.pem
ssh -i "us-west-2-key-pair.pem" ubuntu@ec2-44-236-24-179.us-west-2.compute.amazonaws.com
```

### Database

To use an external `PostgreSQL` RDS database as the database instead of a `SQLite3` file-based database on the ECS Fargate Tasks, uncomment the RDS code in `rds.tf`, `ecs.tf`, and `outputs.tf` and change the `database_type` to `postgres` in `prod.tfvars`. NOTE: A NAT Gateway is required for ECS/Fargate to work if it is not deployed in a public subnet with a public IP since it must pull the ECR image for the container.

You can use the Bastion Host EC2 instance to access to the RDS database running in the private subnet. To access the RDS database, follow [this guide](https://www.postgresql.org/download/linux/ubuntu/) from PostgreSQL to install `psql` on the instance. Then you can execute the following command to connect to the RDS database.

```bash
psql \
   --host=<DB instance endpoint> \
   --port=5432 \
   --username=django_user \
   --password \
   --dbname=django_database
```

### Opening a Shell on an ECS Task

You can open a shell on an ECS Task using `make open-backend-web-shell`. Note, you must install the Session Manager plugin. For macOS, you can use `brew install session-manager-plugin`. For other platforms, check this [link](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

## References

[1] https://dev.to/daiquiri_team/deploying-django-application-on-aws-with-terraform-minimal-working-setup-587g \
[2] https://medium.com/@Markus.Hanslik/setting-up-an-ssl-certificate-using-aws-and-terraform-198c6fb90743 \
[3] https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx
