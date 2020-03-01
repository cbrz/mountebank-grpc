# Mountebank-gRPC

Custom gRPC protocol implementation for Mountebank. This works for unary/streaming/bidi requests as well as with Mountebank proxy functionality.

This makes use of nodejs and the google-protobuf and @grpc/proto-loader modules to generate gRPC descriptors from .proto files. This does not support reflection.

## Setup

Clone project:

    git clone git@github.com:cbrz/mountebank-grpc.git

Build project:

    npm install

Create protocols.json file for gRPC:

```json
{
    "grpc": {
        "createCommand": "node <PROJECT_PATH>/mountebank-grpc/src/index.js"
    }
}
```

Start Mountebank with protocols file:

    mb start --protofile protocols.json

## Example

To load a gRPC imposter (via `POST http://<MB_SERVER>:<MB_PORT>/imposters`):

```json
{
    "protocol": "grpc",
    "port": 4545,
    "loglevel": "debug",
    "recordRequests": true,
    "_note_services": "need the name of the package, service and protofile location for this to load",
    "services": {
        "example.ExampleService": {
            "file": "example.proto"
        }
    },
    "options": {
        "protobufjs": {
            "_note": "any options to protobufjs",
            "includeDirs": ["/path/to/include/protos", "/etc/mountebank/mountebank-grpc/src/protos"]
        }
    },
    "stubs": [{
        "predicates": [
            {
                "matches": { "path": "UnaryUnary" },
                "caseSensitive": false
            }
        ],
        "responses": [
            {
                "is": {
                    "value": {
                        "_note": "gRPC mock unary call response",
                        "_note_streaming": "this is a unary/unary call, streaming requests need the value to be an array",
                        "id": 100,
                        "data": "mock response"
                    },
                    "metadata": {
                        "_note": "gRPC mock initial/trailing metadata response",
                        "initial": {
                            "metadata-initial-key": "metadata-initial-value"
                        },
                        "trailing": {
                            "metadata-trailing-key": "metadata-trailing-value"
                        }
                    },
                    "error": {
                        "_note": "gRPC mock error",
                        "status": "OUT_OF_RANGE",
                        "message": "invalid message"
                    }
                }
            }
        ]
    }]
}
```

To load a gRPC proxy imposter:

```json
{
    "protocol": "grpc",
    "port": 4546,
    "loglevel": "debug",
    "recordRequests": true,
    "services": {
        "example.ExampleService": {
            "file": "/etc/mountebank/mountebank-grpc/src/protos/example.proto"
        }
    },
    "stubs": [
        {
            "responses": [
                {
                    "proxy": {
                        "to": "localhost:4545",
                        "mode": "proxyAlways",
                        "predicateGenerators": [{ "matches": {"path": true} }]
                    }
                }
            ]
        }
    ]
}
```
