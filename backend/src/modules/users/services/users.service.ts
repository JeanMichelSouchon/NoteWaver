import pool from '../../../common/database/db';
import { User } from '../models/user.interface';

export class UsersService {
  public async getAllUsers(): Promise<User[]> {
    try {
      const [results] = await pool.query('SELECT * FROM user');
      return results as User[];
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      throw err;
    }
  }

  public async getUserById(userId: number): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
      throw err;
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
      throw err;
    }
  }

  public async createUser(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<number> {
    try {
      const query = 'INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(query, [username, email, passwordHash]);
      const res = result as any;
      return res.insertId;
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      throw err;
    }
  }

  // Vérifie si un nom d'utilisateur est déjà utilisé
  public async isUsernameTaken(username: string): Promise<boolean> {
    try {
      const [results] = await pool.query('SELECT id FROM user WHERE username = ?', [username]);
      const users = results as User[];
      return users.length > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'unicité du nom d\'utilisateur:', err);
      throw err;
    }
  }

  // Met à jour le nom d'utilisateur d'un utilisateur spécifique
  public async updateUsername(userId: number, newUsername: string): Promise<boolean> {
    try {
      const query = `UPDATE user SET username = ? WHERE id = ?`;
      const [result] = await pool.query(query, [newUsername, userId]);
      const res = result as any;
      return res.affectedRows > 0;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du nom d\'utilisateur:', err);
      throw err;
    }
  }
}