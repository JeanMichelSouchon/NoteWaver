import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NoteDTO } from '../models/notes.dto';
import { NotesService } from '../services/notes.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { error } from 'console';

export class NotesController {
  private notesService: NotesService;

  constructor(notesService: NotesService) {
    this.notesService = notesService;
  }

  // Récupération des notes d'un utilisateur connecté
  public getUserNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if(!req.user){
      res.status(400).json({message:'Utilisateur non authentifié'});
      return;
    }
    try {
      const userId = req.user.id; // ID utilisateur injecté par le middleware JWT
      const notes = await this.notesService.getNotesByUserId(userId);

      // Transformation des notes en DTO
      const notesDTO = notes.map((note) => plainToInstance(NoteDTO, note));

      res.status(200).json(notesDTO);
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Ajout d'une nouvelle note pour l'utilisateur connecté
  public addNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if(!req.user){
      res.status(400).json({message:'Utilisateur non authentifié'});
      return;
    }
    try {
      const userId = req.user.id; // ID utilisateur injecté par le middleware JWT
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        res.status(400).json({ message: 'Le contenu de la note est requis.' });
        return;
      }

      const note = await this.notesService.addNoteForUser(userId, content);

      // Transformation de la note en DTO
      const noteDTO = plainToInstance(NoteDTO, note);

      res.status(201).json(noteDTO);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
  
  public async deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    const noteId = parseInt(req.params.id); // Récupère l'ID depuis les paramètres
    if (!noteId) {
      return res.status(400).json({ message: 'ID de la note invalide.' });
    }
  
    try {
      const userId = req.user?.id; // Récupère l'utilisateur authentifié
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
      }
  
      const success = await this.notesService.deleteNoteById(noteId, userId); // Supprime la note pour cet utilisateur
      if (success) {
        res.status(200).json({ message: 'Note supprimée avec succès.' });
      } else {
        res.status(404).json({ message: 'Note introuvable.' });
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la note:', err);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
  
}
