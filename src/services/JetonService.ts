// **** Variables **** //

import { IPersoLogin } from '@src/models/Personnage';
import PersoService from './PersonnageService';
import jwt from 'jsonwebtoken';

export const UTILISATEUR_NOT_FOUND_ERR = 'Personnage non trouvé';

// **** Functions **** //

/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IPersoLogin} perso - L'utilisateur demandant le jeton
 * @returns {Promise} - Le jeton signé
 */
async function generateToken(perso: IPersoLogin): Promise<string> {
  const persoBD = (await PersoService.getAll()).filter(
    (_perso) => _perso.nom === perso.nom
  )[0]
  if (persoBD && persoBD.classe === perso.classe) {
    return jwt.sign(perso.nom, process.env.JWT_SECRET as string);
  } else {
    return '';
  }
}

// **** Export default **** //
export default {
  generateToken,
} as const;