# Database Setup

yarn migration:generate.master src/domain/master/database/migrations/init-database
yarn migration:run.master
yarn seed:run.master