// https://docs.nestjs.com/techniques/configuration
export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASS || 'root',
        name: process.env.DATABASE_NAME || 'ageuk',
    },
    jwt: {
        accessToken: {
            secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
            expiresIn: process.env.JWT_ACCESS_EXPIRY || '1h'
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            expiresIn: process.env.JWT_REFRESH_EXPIRY || '5m'
        }
    },
    rateLimit: {
        ttl: 60,
        limit: 10
    }
});