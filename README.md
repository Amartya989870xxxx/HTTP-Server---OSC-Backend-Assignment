# HTTP Server — OSC Backend Assignment

This project is a fully manual **HTTP/1.1 server** built from scratch using **Node.js TCP sockets (`net` module)** — without using any web frameworks or the built-in `http` module.  
It was created as part of the **OSC Backend Club Assignment**.

The server manually handles:
- TCP connections  
- Parsing raw HTTP requests  
- Extracting method, path, headers, query params, and body  
- Routing  
- Generating proper HTTP/1.1 responses  
- JSON parsing and storage  
- CORS headers  
- Logging middleware  


# 🚀 Features Implemented

## ✅ Core Requirements
- Raw TCP server (`net.createServer`)
- Manual HTTP request parsing:
  - Request line  
  - Headers  
  - Query parameters  
  - Body (based on `Content-Length`)  
- Supported methods:  
  - **GET**  
  - **POST**
- Routed endpoints:
  - `GET /` → Welcome message  
  - `GET /echo?message=<text>` → Echoes query param  
  - `POST /data` → Stores JSON in memory  
  - `GET /data` → Returns all stored items  
  - `GET /data/:id` → Returns specific item  
- Manual HTTP response builder:
  - Status line  
  - Headers  
  - JSON body  

## ⭐ Bonus Features Implemented (2)
- **Request Logging Middleware**  
  Logs every request with timestamp, method, and path.
- **CORS Support**  
  Allows cross-origin requests using `Access-Control-Allow-*` headers.


# 📂 Project Structure
.
├── server.js       # Main server (HTTP over raw TCP)
├── tests.sh        # Curl-based test script
└── README.md


# 🧠 How It Works (Overview)

### 1. Client sends raw HTTP request  
Example:
GET /echo?message=hello HTTP/1.1
Host: localhost:8080

### 2. Server receives raw TCP data  
The `data` event returns a **chunk**, which may contain partial or full HTTP data.

### 3. Request is parsed manually  
- Split headers/body using `\r\n\r\n`  
- Extract method, path, version  
- Parse headers into an object  
- Decode query parameters  
- Handle body based on `Content-Length`

### 4. Router selects endpoint  
Depending on `req.method` + `req.path`.

### 5. Server builds raw HTTP response  
Example:

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27
Date: Wed, 25 Nov 2025 10:00:00 GMT
Access-Control-Allow-Origin: *
…
{“message”:“Hello”}

# 🧪 Test Commands (tests.sh)

Run these from terminal:

```sh
# GET /
curl http://localhost:8080/

# GET /echo
curl "http://localhost:8080/echo?message=hello"

# POST /data
curl -X POST http://localhost:8080/data \
-H "Content-Type: application/json" \
-d '{"name":"test","value":123}'

# GET all data
curl http://localhost:8080/data

# GET item by ID
curl http://localhost:8080/data/<id>

# 404 test
curl http://localhost:8080/unknown
