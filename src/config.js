import { config } from 'dotenv';

config();


export const cfg = {
    general: {
        PORT: process.env.PORT || 3000,
        APP_URL: 'http://localhost:3000'
    },
    mysql: {
        DB_HOST: process.env.DB_HOST || 'swahili',
        DB_PORT: process.env.DB_PORT || 3306,
        DB_USER: process.env.DB_USER || 'carlos',
        DB_PASSWORD: process.env.DB_PASSWORD || 'dario',
        DB_DATABASE: process.env.DB_DATABASE || 'expressrestapicrud'
    },
    mongodb: {
        // Esta es la especificacion de la url de conexion a mongoDB: 
        // 'mongodb://username:password@host:port/database?options...'
        URI: 'mongodb://menjador:daricarlos@swahili:27017/menjador'
    },
    microsoftAuth: {
        MICROSOFT_GRAPH_CLIENT_ID: '39e6f20b-da78-4be5-b6a7-c74008808e6b',
        MICROSOFT_GRAPH_CLIENT_SECRET: 'KZc8Q~Ou_isiQ0syJfB.GPQbp-R4jlJ-DB.lDcPr'
    },
    googleAuth: {
        GOOGLE_CLIENT_ID: '388845113719-kdkuvbm28okal24kbaf9bmct52rfcc8s.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: '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'
    },    
    jwtAuth: {
        JWT_SECRET: 'My secret key',
        JWT_TOKEN_EXPIRATION: '30s'
    }
};
