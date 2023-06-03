#!/bin/sh

# Stop the bash script if there are any errors
set -e

# Positional Arguments
REGION=$1
ECR_REGISTRY=$2
ECR_REPOSITORY=$3
TASK_DEFINITION_NAME=$4
CLUSTER_NAME=$5
SERVICE_NAME=$6

# Push the built Docker Image to ECR
ECR_IMAGE="$ECR_REGISTRY/$ECR_REPOSITORY:local"
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker tag $ECR_REPOSITORY:latest $ECR_IMAGE
docker push $ECR_IMAGE
docker tag $ECR_REPOSITORY:latest $ECR_REGISTRY/$ECR_REPOSITORY:latest
docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

echo "Pushed $ECR_IMAGE to ECR..."

# Read the latest Task Definition
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_DEFINITION_NAME" --region "$REGION")

# Update the Task Definiton with the new image locally
NEW_TASK_DEFINTIION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$ECR_IMAGE" ".taskDefinition | .containerDefinitions[0].image = \"$ECR_IMAGE\" | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)")

# Update the Task Definiton with the new image remotely
NEW_TASK_INFO=$(aws ecs register-task-definition --region "$REGION" --cli-input-json "$NEW_TASK_DEFINTIION")

# Get the revision version for the latest Task Definition
NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')

echo "Updated ECS Task Definition: $TASK_DEFINITION_NAME:$NEW_REVISION..."

# Update the ECS Service
NEW_ECS_SERVICE=$(aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${SERVICE_NAME} \
    --task-definition ${TASK_DEFINITION_NAME}:${NEW_REVISION} \
    --force-new-deployment \
    --region ${REGION})

echo "Started ECS Service deployment for $CLUSTER_NAME:$SERVICE_NAME with $TASK_DEFINITION_NAME:$NEW_REVISION..."
