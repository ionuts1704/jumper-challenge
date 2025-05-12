# Jumper challenge

## Getting start

There's 2 directories into this repository with a README.md for each of those to have more informations about their respective setup.

### frontend

classic nextjs implementation within the material ui 5 setup.

### backend

expressjs 4 with some default routes and examples. (replaced this with a nestjs implementation)

## Enjoy!

### Project setup
1. ``cp .env.public .env`` in root folder
    1. change **RPC_API_KEY** value
    2. change **NEXT_PUBLIC_PROJECT_ID** value
2. run `docker-compose up -d` in the root folder

frontend available at http://localhost:3000.
backend swagger docs available at http://localhost:3001/docs.

### Project implementation
- **frontend** app
  - contains EOA auth flow and authorization flow through nonce + sessions.
  - once authorized you'll see logged in wallet's available tokens for some predefined networks
- **backend** app
  - contains several routes for making the authorization available, tokens retrieval, logout
  - has session auth, in memory repository for storing wallets/nonces
  - basic standardized json logging and error handling
  - has swagger docs and request payload validation nestjs way

### Project improvements
- tokens retrieval api to support rich filtering, pagination, better error handling, implement a circuit breaker and forward requests to other rpc node if current is down  
- add rate limiting, caching, extend logging, add tracing on the backend
- simplify frontend components into smaller and reusable ones
- general css consolidation through theming
- general err handling consolidation
