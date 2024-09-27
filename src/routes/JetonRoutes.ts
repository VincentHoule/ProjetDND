import JetonService from '@src/services/JetonService';
import Personnage from '@src/models/Personnage';
import { IReq, IRes } from './common/types';
import check from './common/check';
// **** Functions **** //

/**
 * Générer un jeton.
 *
 * @param {IReq} req - La requête au serveur
 * @param {IRes} res - La réponse du serveur
 */
async function generateToken(req: IReq, res: IRes) {
  const persoLogin = check.isValid(req.body, 'persologin', Personnage.isPersoLogin);
  const token = await JetonService.generateToken(persoLogin);
  return res.send({ token: token });
}

// **** Export default **** //

export default {
  generateToken,
} as const;