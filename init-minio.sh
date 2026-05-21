#!/bin/bash

# Initialize MinIO bucket for development

# Load environment variables from .env if exists
if [ -f .env ]; then
    echo "Loading configuration from .env..."
    set -a
    source .env
    set +a
else
    echo "Warning: .env file not found, using defaults"
fi

CONTAINER_NAME="winstall-minio"
BUCKET_NAME="${AWS_S3_BUCKET:-winstall-dev}"
ACCESS_KEY="${AWS_ACCESS_KEY_ID:-minioadmin}"
SECRET_KEY="${AWS_ACCESS_KEY_SECRET:-minioadmin123456}"

echo "Configuration:"
echo "  Bucket: $BUCKET_NAME"
echo "  Access Key: $ACCESS_KEY"
echo ""

echo "Waiting for MinIO container to be ready..."

# Wait for container to be running
timeout=30
elapsed=0
while ! docker ps | grep -q "$CONTAINER_NAME"; do
    if [ $elapsed -ge $timeout ]; then
        echo "Error: Container $CONTAINER_NAME not found"
        exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
done

# Wait for MinIO to be ready
echo "Waiting for MinIO service to be ready..."
elapsed=0
while ! docker exec "$CONTAINER_NAME" mc ready local 2>/dev/null; do
    if [ $elapsed -ge $timeout ]; then
        echo "Error: MinIO service did not become ready in time"
        exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
done

echo "MinIO is ready, initializing bucket..."

# Configure mc alias
docker exec "$CONTAINER_NAME" mc alias set local http://localhost:9000 "$ACCESS_KEY" "$SECRET_KEY"

# Create bucket if not exists
docker exec "$CONTAINER_NAME" mc mb --ignore-existing "local/$BUCKET_NAME"

# Set anonymous download policy for installers folder
docker exec "$CONTAINER_NAME" mc anonymous set download "local/$BUCKET_NAME/installers"

echo "MinIO bucket '$BUCKET_NAME' initialized successfully"
echo "Console: http://localhost:9001"
echo "API: http://localhost:9000"
