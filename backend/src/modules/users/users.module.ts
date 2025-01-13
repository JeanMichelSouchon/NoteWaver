import { Router } from 'express';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import usersRoutes from './routes/users.routes';

export class UsersModule {
  public router: Router;
  private usersService: UsersService;
  private usersController: UsersController;

  constructor() {
    this.usersService = new UsersService();
    this.usersController = new UsersController(this.usersService);
    this.router = usersRoutes(this.usersController);
  }
}