import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NoteDTO } from '../models/notes.dto';
import { NotesService } from '../services/notes.service';

export class NotesController {
  private notesService: NotesService;

  constructor(notesService: NotesService) {
    this.notesService = notesService;
  }

  // Récupération des notes d'un utilisateur connecté
  public getUserNotes = async (req: Request, res: Response): Promise<void> => {
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
  public addNote = async (req: Request, res: Response): Promise<void> => {
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
}
