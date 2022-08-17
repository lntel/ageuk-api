const ormConfig = {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "test",
  "database": "ageuk",
  "entities": ["src/**/**.entity{.ts,.js}"],
  "synchronize": true
};

export default ormConfig;