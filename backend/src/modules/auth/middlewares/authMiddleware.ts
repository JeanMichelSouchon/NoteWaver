import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../../users/models/user.interface';
import { UsersService } from '../../users/services/users.service';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7, authHeader.length);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      const usersService = new UsersService();
      const user = await usersService.getUserById(decoded.id);

      if (!user) {
        res.status(401).json({ message: 'Utilisateur non trouvé' });
        return;
      }

      req.user = user;

      next();
    } catch (err) {
      console.error('Erreur lors de la vérification du token ou de la récupération de l\'utilisateur:', err);
      res.status(401).json({ message: 'Token invalide ou utilisateur non trouvé' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Token manquant' });
    return;
  }
};