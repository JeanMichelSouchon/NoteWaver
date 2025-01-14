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
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;
      const [result] = await pool.query(query, [userId]);
      return result as any[]; // Typage des résultats
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
        VALUES (?, ?, NOW())
      `;
      const [result]: any = await pool.query(query, [userId, content]);
      return {
        id: result.insertId, // ID généré automatiquement par MySQL
        user_id: userId,
        content,
        created_at: new Date(), // Ajoutez l'heure actuelle
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      throw new Error('Impossible d\'ajouter la note');
    }
  }

  // NotesService.ts
  public async deleteNoteById(noteId: number, userId: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
      const [result]: any = await pool.query(query, [noteId, userId]);
      return result.affectedRows > 0; // Retourne true si une ligne a été supprimée
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      throw new Error('Impossible de supprimer la note');
    }
  }
  

}
