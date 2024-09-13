
Simple backend api for tasks mamanger app;

### Use
- [NestJS](https://nestjs.com/)
- passport jwt and bcrypt
- PostgreSQL 
- TypeORM
- jest
- class-validator - DTO class fields validation
- class-transformer - serialize request to DTO object or class 
- hapi/joi - validate ENV file
- cross-env (global) - use to choose env file by cmd 'STAGE' param 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```