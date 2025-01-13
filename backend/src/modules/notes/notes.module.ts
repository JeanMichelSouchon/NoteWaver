import { Router } from 'express';
import { NotesService } from './services/notes.service';
import { NotesController } from './controllers/notes.controller';
import notesRoutes from './routes/notes.routes';

export class NotesModule {
  public router: Router;
  private notesService: NotesService;
  private notesController: NotesController;

  constructor() {
    this.notesService = new NotesService();
    this.notesController = new NotesController(this.notesService);
    this.router = notesRoutes(this.notesController);
  }
}