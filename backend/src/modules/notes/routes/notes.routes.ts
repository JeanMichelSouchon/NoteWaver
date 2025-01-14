import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';

/**
 * Définit les routes d'authentification.
 * @param notesController Instance de AuthController.
 * @returns Router avec les routes d'authentificatioNotesn.
 */
export default function (notesController: NotesController): Router {
  const router = Router();

  router.post('/notes-add',authenticateJWT, (req, res) => notesController.addNote(req, res));

  router.get('/notes-fetch',authenticateJWT, (req, res) => notesController.getUserNotes(req, res));
  
  router.delete('/delete/:id', authenticateJWT, (req, res) => notesController.deleteNote(req, res));




  return router;
}