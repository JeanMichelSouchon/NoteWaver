import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Créer un pool de connexions
const pool = mysql.createPool(dbConfig);

export default pool;