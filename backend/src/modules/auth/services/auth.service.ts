import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../../../common/database/db';
import { User } from '../../users/models/user.interface';
import { formatDateForMySQL } from '../../../common/utils/dateUtils';

dotenv.config();

export class AuthService {

  // Méthodes pour interagir avec la base de données directement

  // Créer un nouvel utilisateur
  private async createUser(username: string, email: string, passwordHash: string, isAdmin: boolean = true): Promise<number> {
    try {
      const query = 'INSERT INTO user (username, email, password_hash, isAdmin) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(query, [username, email, passwordHash, isAdmin]);
      const res = result as any;
      return res.insertId;
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      throw err;
    }
  }

  // Trouver un utilisateur par ID
  private async findUserById(userId: number): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
      throw err;
    }
  }

  // Trouver un utilisateur par email
  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
      throw err;
    }
  }

  // Hashage du mot de passe
  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Erreur lors du hashage du mot de passe:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Vérification du mot de passe
  private async checkPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Génération du token JWT
  private generateToken(user: User): string {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
      }

      return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (error) {
      console.error('Erreur lors de la génération du token JWT:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Vérification du token JWT
  public async verifyToken(token: string): Promise<User> {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

      const user = await this.findUserById(decoded.id);

      if (!user) {
        throw new Error('Utilisateur non trouvé ou supprimé');
      }

      return user;
    } catch (error) {
      console.error('Erreur lors de la vérification du token JWT:', error);
      throw new Error('Token invalide, expiré ou utilisateur non trouvé');
    }
  }


  // Inscription d'un nouvel utilisateur
  public async signup(username: string, email: string, password: string): Promise<{ user: User;}> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Email déjà utilisé');
      }

      // Hasher le mot de passe
      const passwordHash = await this.hashPassword(password);

      // Créer un nouvel utilisateur
      const userId = await this.createUser(username, email, passwordHash);
      const newUser = await this.findUserById(userId);

      if (!newUser) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      return { user: newUser};
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Connexion de l'utilisateur
  public async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    try {
      // Recherche l'utilisateur par email ou pseudo
      const user = identifier.includes('@')
        ? await this.findUserByEmail(identifier)
        : await this.findUserByUsername(identifier);
  
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
  
      const passwordValid = await this.checkPassword(password, user.password_hash);
      if (!passwordValid) {
        throw new Error('Identifiants invalides');
      }
  
      const token = this.generateToken(user);
  
      return { token, user };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }
  
  // Ajout de la méthode pour trouver un utilisateur par pseudo
  private async findUserByUsername(username: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par username:', err);
      throw err;
    }
  }

  // Méthode pour réinitialiser le mot de passe
  public async resetPassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifie si l'ancien mot de passe est correct
      const isCurrentPasswordValid = await this.checkPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Hash le nouveau mot de passe
      const newPasswordHash = await this.hashPassword(newPassword);

      // Met à jour le mot de passe de l'utilisateur
      const [result] = await pool.query('UPDATE user SET password_hash = ? WHERE id = ?', [newPasswordHash, user.id]);
      const res = result as any;

      return res.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }
}
