# Trivaliz API Server 

Trivaliz draws its inspiration from the beloved TV show “Family Feud”, known in Indonesia as “Family 100”. We've taken the core excitement and charm of the original format and reimagined it for the web. The result? A browser-based experience that’s accessible on any platform.

What sets our version apart is its unique cultural twist: questions and answers are tailored to the country you choose to play. This not only keeps the gameplay fresh and engaging but also offers a fun and interactive way for players to learn about the customs, traditions, and quirks of different nations. It's more than a game—it's a cultural exchange right at your fingertips!

## Getting Started

### Prerequisites
- Node.js
- Docker

### Setup DynamoDB (local development)
```bash
docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

### Clone the repository
```bash
git clone git@github.com:tedante/trivaliz-api.git
cd trivaliz-api
```

### Copy .env.example to .env
```bash
cp .env.example .env
# Edit .env file with your own configuration
```

### Install dependencies
```bash
npm install
```

### Migration
```bash
ts-node ./src/migrations/create-tables.ts
```

### Seeder
```bash
ts-node ./src/seeders/seed.ts
```

### Start the server
```bash
npm run dev
```