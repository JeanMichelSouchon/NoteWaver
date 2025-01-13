import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node'; // Import Sentry

export const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // Envoyer l'erreur à Sentry
    Sentry.captureException(err);
  
    // Loguer l'erreur dans la console
    console.error('Une erreur a été capturée:', {
      message: err.message,
      statusCode: err.status || 500,
    });
  
    // Retourner une réponse générique
    res.status(err.status || 500).json({
      error: {
        message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
      },
    });
  };