#!/bin/sh

# Stop the bash script if there are any errors
set -e

# Positional Arguments
REGION=$1
CLUSTER_NAME=$2
SERVICE_NAME=$3

# Define the command to execute on the ECS task
COMMAND="bash"

echo "Retrieving an ECS Task ID from ECS Service $SERVICE_NAME in ECS Cluster $CLUSTER_NAME..."

# Get a Task ID for the service
TASK_ID=$(aws ecs list-tasks \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME  \
    --query 'taskArns[0]' \
    --output text \
    --region $REGION \
    | awk '{split($0,a,"/"); print a[3]}')

echo "ECS Task ID is $TASK_ID..."
echo "Executing \`$COMMAND\` on ECS Task ID $TASK_ID..."

# Open a bash shell on the ECS Task
aws ecs execute-command \
    --task $TASK_ID \
    --command $COMMAND \
    --interactive \
    --cluster $CLUSTER_NAME \
    --region $REGION
