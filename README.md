# Trivaliz API Server 

This is a backend for trivaliz, a web-based trivia game with a unique cultural twist: players can select a country, and all questions and answers are tailored to that nation. It’s a fun way to compete with friends while learning about customs, traditions, and quirks from around the world. Whether you’re competing with friends or meeting new players, our app offers an engaging and educational experience.

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