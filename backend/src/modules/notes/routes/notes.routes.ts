import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';

/**
 * Définit les routes d'authentification.
 * @param notesController Instance de AuthController.
 * @returns Router avec les routes d'authentificatioNotesn.
 */
export default function (notesController: NotesController): Router {
  const router = Router();

  router.post('/notes-add', (req, res) => notesController.addNote(req, res));

  router.get('/notes-fetch', (req, res) => notesController.getUserNotes(req, res));



  return router;
}