import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';

/**
 * Définit les routes pour les utilisateurs.
 * @param usersController Instance de UsersController.
 * @returns Router avec les routes des utilisateurs.
 */
export default function (usersController: UsersController): Router {
  const router = Router();

  router.get(
    '/my-profile',
    authenticateJWT,
    (req, res) => usersController.getMyProfile(req, res)
  );

  router.patch(
    '/my-profile/change-name',
    authenticateJWT,
    (req, res) => usersController.changeUsername(req, res)
  );

  return router;
}