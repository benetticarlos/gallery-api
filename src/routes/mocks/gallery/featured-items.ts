// http://localhost:3000/v1/gallery/featured-items

// RESPONSE -429 (Too many request error)
/*

{
  "message": "Request failed with status code 429",
  "name": "Error",
  "stack": "Error: Request failed with status code 429\n    at createError (C:\\Users\\Javier\\Documents\\Archivos Javier\\Diego\\Programacion\\Desarrollo web\\Octosoft\\gallery-api\\node_modules\\axios\\lib\\core\\createError.js:16:15)\n    at settle (C:\\Users\\Javier\\Documents\\Archivos Javier\\Diego\\Programacion\\Desarrollo web\\Octosoft\\gallery-api\\node_modules\\axios\\lib\\core\\settle.js:17:12)\n    at IncomingMessage.handleStreamEnd (C:\\Users\\Javier\\Documents\\Archivos Javier\\Diego\\Programacion\\Desarrollo web\\Octosoft\\gallery-api\\node_modules\\axios\\lib\\adapters\\http.js:260:11)\n    at IncomingMessage.emit (events.js:327:22)\n    at IncomingMessage.EventEmitter.emit (domain.js:483:12)\n    at endReadableNT (_stream_readable.js:1220:12)\n    at processTicksAndRejections (internal/process/task_queues.js:84:21)",
  "config": {
    "url": "https://api.opensea.io/api/v1/events",
    "method": "get",
    "headers": {
      "Accept": "application/json, text/plain ",
      "X-API-KEY": "",
      "User-Agent": "axios/0.21.1"
    },
    "params": {
      "asset_contract_address": "0x495f947276749ce646f68ac8c248420045cb7b5e",
      "token_id": "109357140932249174184232105731133177415490681567806678064024980593982312546305"
    },
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1
  }
}

*/

