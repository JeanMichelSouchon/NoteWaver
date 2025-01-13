import dotenv from 'dotenv';
import pool from '../../../common/database/db';

dotenv.config();

export class NotesService {
  /**
   * Récupérer toutes les notes d'un utilisateur par son ID
   * @param userId - ID de l'utilisateur
   * @returns Liste des notes
   */
  public async getNotesByUserId(userId: number): Promise<any[]> {
    try {
      const query = `
        SELECT id, content, created_at 
        FROM notes 
        WHERE user_id = $1
        ORDER BY created_at DESC
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows; // Retourne les notes sous forme de tableau
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      throw new Error('Impossible de récupérer les notes');
    }
  }

  /**
   * Ajouter une note pour un utilisateur spécifique
   * @param userId - ID de l'utilisateur
   * @param content - Contenu de la note
   * @returns La note nouvellement créée
   */
  public async addNoteForUser(userId: number, content: string): Promise<any> {
    try {
      const query = `
        INSERT INTO notes (user_id, content, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id, content, created_at
      `;
      const { rows } = await pool.query(query, [userId, content]);
      return rows[0]; // Retourne la note nouvellement créée
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      throw new Error('Impossible d\'ajouter la note');
    }
  }
}
