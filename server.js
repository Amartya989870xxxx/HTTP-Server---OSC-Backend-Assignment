const net = require("net");
const crypto = require("crypto");


let dataStore = [];

// LOGGING MIDDLEWARE (BONUS #1)

function logRequest(req) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
}

function parseRequest(raw) {
    const [headerPart, body] = raw.split("\r\n\r\n");
    const headerLines = headerPart.split("\r\n");

    const [method, fullPath, version] = headerLines[0].split(" ");
    const [path, queryString] = fullPath.split("?");

    
    const headers = {};
    for (let i = 1; i < headerLines.length; i++) {
        const [key, value] = headerLines[i].split(": ");
        headers[key.toLowerCase()] = value;
    }


    const query = {};
    if (queryString) {
        queryString.split("&").forEach(pair => {
            const [k, v] = pair.split("=");
            query[k] = decodeURIComponent(v);
        });
    }

    return { method, path, version, headers, body, query };
}


// HTTP RESPONSE BUILDER
// (With CORS Support – BONUS #2)

function buildResponse(statusCode, statusMessage, bodyObj) {
    const body = JSON.stringify(bodyObj);

    return (
        `HTTP/1.1 ${statusCode} ${statusMessage}\r\n` +
        `Content-Type: application/json\r\n` +
        `Content-Length: ${Buffer.byteLength(body)}\r\n` +
        `Date: ${new Date().toUTCString()}\r\n` +
        `Access-Control-Allow-Origin: *\r\n` +
        `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n` +
        `Access-Control-Allow-Headers: Content-Type, Authorization\r\n` +
        `Connection: close\r\n\r\n` +
        body
    );
}


function handleRequest(req) {

    logRequest(req);

    
    if (req.method === "GET" && req.path === "/") {
        return buildResponse(200, "OK", { message: "Welcome to my HTTP server!" });
    }

    
    if (req.method === "GET" && req.path === "/echo") {
        if (!req.query.message) {
            return buildResponse(400, "Bad Request", { error: "message param required" });
        }
        return buildResponse(200, "OK", { echo: req.query.message });
    }

    
    if (req.method === "POST" && req.path === "/data") {
        try {
            const json = JSON.parse(req.body);
            const id = crypto.randomUUID();
            dataStore.push({ id, ...json });

            return buildResponse(200, "OK", { success: true, id });
        } catch {
            return buildResponse(400, "Bad Request", { error: "Invalid JSON" });
        }
    }

    
    if (req.method === "GET" && req.path === "/data") {
        return buildResponse(200, "OK", dataStore);
    }

    
    if (req.method === "GET" && req.path.startsWith("/data/")) {
        const id = req.path.split("/")[2];
        const item = dataStore.find(d => d.id === id);

        if (!item) {
            return buildResponse(404, "Not Found", { error: "Data not found" });
        }

        return buildResponse(200, "OK", item);
    }

    
    return buildResponse(404, "Not Found", { error: "Route not found" });
}


// RAW TCP SERVER
const server = net.createServer(socket => {
    let buffer = "";

    socket.on("data", chunk => {
        buffer += chunk.toString();

        if (buffer.includes("\r\n\r\n")) {
            const req = parseRequest(buffer);

            if (req.headers["content-length"]) {
                const bodyLen = parseInt(req.headers["content-length"]);
                const actualBody = buffer.split("\r\n\r\n")[1];

                if (actualBody.length < bodyLen) return;

                req.body = actualBody;
            }

     
            const response = handleRequest(req);
            socket.write(response);
            socket.end();
        }
    });

    socket.on("error", () => socket.end());
});


const PORT = 8080; //Start Server

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});