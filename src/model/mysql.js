import { cfg } from '../config.js';
import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: cfg.mysql.DB_HOST,
    user: cfg.mysql.DB_USER,
    password: cfg.mysql.DB_PASSWORD,
    port: cfg.mysql.DB_PORT,
    database: cfg.mysql.DB_DATABASE
});