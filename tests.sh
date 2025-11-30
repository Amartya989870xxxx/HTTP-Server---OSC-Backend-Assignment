# GET /
curl http://localhost:8080/

# Echo endpoint
curl "http://localhost:8080/echo?message=hello"

# POST data
curl -X POST http://localhost:8080/data \
-H "Content-Type: application/json" \
-d '{"name":"test","value":123}'

# GET all
curl http://localhost:8080/data

# GET 1 item (replace <id>)
curl http://localhost:8080/data/<id>

# 404 test
curl http://localhost:8080/unknown