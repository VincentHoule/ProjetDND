import { Router, Request, Response, NextFunction } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../common/Paths';

import PersoRoutes from './PersonnageRoutes';
import {Personnage, IPersonnage } from '@src/models/Personnage';
import JetonRoutes from './JetonRoutes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Validation d'une personne ** //
function validatePerson(req: Request, res: Response, next: NextFunction) {
  if (req.body === null) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Personnage requis' })
      .end();
    return;
  }
  if (req.body.perso === null || req.body.perso === undefined) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Personnage requis' })
      .end();
    return;
  }

  const nouvelPerso = new Personnage(req.body.perso);
  const error = nouvelPerso.validateSync();
  if (error !== null && error !== undefined) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  } else {
    next();
  }
}

// ** Ajoute PersonneRouter ** //

const persoRouter = Router();

// Lire tous les personnes
persoRouter.get(Paths.Personnage.Get, PersoRoutes.getAll);

// Lire une personnes
persoRouter.get(Paths.Personnage.GetOne,
  PersoRoutes.getOne
);

persoRouter.get(Paths.Personnage.GetClasse, PersoRoutes.getClasse);

persoRouter.get(Paths.Personnage.GetNiveau, PersoRoutes.getNiveau);

// Ajouter un personne
persoRouter.post(Paths.Personnage.Add, validatePerson, PersoRoutes.add);

// Mettre à jour une personne
persoRouter.put(Paths.Personnage.Update, validatePerson, PersoRoutes.update);

// Supprimer une personne
persoRouter.delete(
  Paths.Personnage.Delete,
  validate(['_id', 'string', 'params']),
  PersoRoutes.delete
);


// Add PersonRouter
apiRouter.use(Paths.Personnage.Base, persoRouter);


const tokenRouter = Router();

// Generate token
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// Add JetonRouter
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);

// **** Export default **** //

export default apiRouter;