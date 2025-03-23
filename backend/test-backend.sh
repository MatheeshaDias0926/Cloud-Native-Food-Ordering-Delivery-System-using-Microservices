#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting backend services..."

# Build and start the services
docker-compose up --build -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Function to check service health
check_service() {
    local service=$1
    local url=$2
    echo "Checking $service health..."
    
    response=$(curl -s -w "%{http_code}" $url/health)
    http_code=${response: -3}
    body=${response:0:${#response}-3}
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ $service is healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ $service is not healthy (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

# Check API Gateway health
check_service "API Gateway" "http://localhost:3000"

# Check all microservices health through API Gateway
echo "Checking microservices health..."
for service in user-service restaurant-service order-service delivery-service payment-service notification-service; do
    check_service "$service" "http://localhost:3000/api/$service"
done

# Check overall system health
echo "Checking overall system health..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/health/status)
http_code=${response: -3}
body=${response:0:${#response}-3}

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ All services are healthy${NC}"
    echo "System Status:"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ System is not healthy (HTTP $http_code)${NC}"
    echo "Response: $body"
fi

# Show logs if any service is unhealthy
if [ "$http_code" != "200" ]; then
    echo "Showing logs for unhealthy services..."
    docker-compose logs --tail=50
fi 