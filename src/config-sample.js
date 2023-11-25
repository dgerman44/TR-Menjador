/ copia este fichero a config.js, y sustituye los valores dummy que
// contiene por los valores reales de tu entorno de ejecucion
export const cfg = {
    general: {
        HTTP_PORT: 3000,
        HTTPS_PORT: 443,
        FORCE_HTTPS: false,
        APP_URL: 'http://localhost:3000',
        SESSION_SECRET: 'put here your random session secret'
    },
    mongodb: {
        // Esta es la especificacion de la url de conexion a mongoDB: 
        // 'mongodb://username:password@host:port/database'
        URI: 'pon aqui la url de tu conexion a MongoDB'
    
    },
    microsoftAuth: {
        MICROSOFT_GRAPH_CLIENT_ID: 'client ID de tu aplicacion en MS',
        MICROSOFT_GRAPH_CLIENT_SECRET: 'client secret en tu aplicacion en MS'
    },
    googleAuth: {
        GOOGLE_CLIENT_ID: 'client ID de tu aplicacion en Google',
        GOOGLE_CLIENT_SECRET: 'client secret de tu aplicacion en Google'
    }
};