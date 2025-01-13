import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

/**
 * Définit les routes d'authentification.
 * @param authController Instance de AuthController.
 * @returns Router avec les routes d'authentification.
 */
export default function (authController: AuthController): Router {
  const router = Router();

  router.post('/signup', (req, res) => authController.signup(req, res));

  router.post('/login', (req, res) => authController.login(req, res));

  router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

  router.post('/verify-token', (req, res) => authController.verifyToken(req, res));

  return router;
}