import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import PersonRepo from '@src/repos/PersonnageRepo';
import { IPersonnage } from '@src/models/Personnage';


// **** Variables **** //

export const PERSONNAGE_NOT_FOUND_ERR = 'Personnage non trouvé';


// **** Functions **** //

/**
 * Lire tous les personnages
 * @returns tous les personnages
 */
function getAll(): Promise<IPersonnage[]> {
  return PersonRepo.getAll();
}

/**
 * Lire un personnage
 * @param _id string de l'id du personnage à lire
 * @returns le personnage
 */
async function getOne(_id : string): Promise<IPersonnage | null>{
  const persists =  await PersonRepo.persists(_id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      PERSONNAGE_NOT_FOUND_ERR
    );
  }
  // Return personnage
  return PersonRepo.getOne(_id);

}

/**
 * Ajouter un personnage
 * @param person personnage à ajouter
 * @returns le personnage ajouté
 */
function add(person: IPersonnage): Promise<IPersonnage> {
  return PersonRepo.add(person);
}

/**
 * Mise à jour d'un personnage
 * @param person le personnage à modifier
 * @returns le personnage modifié
 */
async function update(person: IPersonnage): Promise<IPersonnage  | null>{
  const persists = await PersonRepo.persists(person._id as string);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      PERSONNAGE_NOT_FOUND_ERR
    );
  }
  // Return personnage
  return PersonRepo.update(person);
}
/**
 * Suppression d'un personnage
 * @param _id id du personnage à supprimer
 * @returns résultat de la suppression
 */
async function _delete(_id: string): Promise<void> {
  const persists = await PersonRepo.persists(_id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      PERSONNAGE_NOT_FOUND_ERR,
    );
  }
  // Delete personnage
  return PersonRepo.delete(_id);
}

/**
 * Lire tous les personnages d'une classe
 * @param classe classe à aller lire
 * @returns les personnages de la classe
 */
async function getClasse(classe: string) {
  var regex = new RegExp('^(Guerrier)|(Barde)|(Barbare)|(Ensorceleur)|(Clerc)|(Paladin)|(Occultiste)|(Roublard)|(Moine)|(Rodeur)|(Magicien)|(Artificier)|(Druide)$');
  const verif = await regex.test(classe);
  if (!verif) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "Votre classe n'existe pas."
    );
  }
  // Return personnage
  return PersonRepo.getClasse(classe);

}

/**
 * Lire tous les personnages entre deux niveux
 * @param min niveau minimum
 * @param max niveau maximum
 * @returns les personnages entre les niveau
 */
async function getNiveau(min: number, max: number) {
  if(min < 1 || max > 20){
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "Votre niveau maximum ou minimum n'existe pas."
    );
  }
    // Return personnage
    return PersonRepo.getNiveau(min, max);

}


// **** Export default **** //

export default {
  getAll,
  getOne,
  add,
  update,
  delete: _delete,
  getClasse,
  getNiveau
} as const;
