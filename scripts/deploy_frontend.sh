#!/bin/sh

# Stop the bash script if there are any errors
set -e

# Positional Arguments
REGION=$1
AMPLIFY_APP_ID=$2
BRANCH_NAME=$3

# Get last Git Commit information
LAST_COMMIT_ID=$(git log --remotes -1 --pretty=format:"%H")
LAST_COMMIT_MESSAGE=$(git log --remotes -1 --pretty=format:"%s")
LAST_COMMIT_TIME=$(git log --remotes -1 --pretty=format:"%cI")

# Start Amplify Job
JOB_ID=$(aws amplify start-job \
	--app-id $AMPLIFY_APP_ID \
	--branch-name $BRANCH_NAME \
	--job-type RELEASE \
	--commit-id $LAST_COMMIT_ID \
	--commit-message "$LAST_COMMIT_MESSAGE" \
	--commit-time "$LAST_COMMIT_TIME" \
	--region $REGION  | jq -r '.jobSummary.jobId')

echo "Started Amplify Job $JOB_ID with Commit ID = $LAST_COMMIT_ID..."
