import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { Personnage, IPersonnage} from '@src/models/Personnage';
import { STATUS_CODES } from 'http';
import { isValidObjectId } from 'mongoose';

// **** Functions **** //

/**
 * Lire un personnage.
 */
async function getOne(_id: string): Promise<IPersonnage | null> {
  const perso = Personnage.findOne({_id: _id});

  return perso;
}

/**
 * Vérifie si le personnage existe.
 */
async function persists(_id: string): Promise<boolean> {
  console.log(_id)

  if(!isValidObjectId(_id))
  {
    return false;
  }
  const perso = await Personnage.findById(_id);
  return perso !== null;
}

/**
 * Lire tous les personnages.
 */
async function getAll(): Promise<IPersonnage[]> {
  const perso = await Personnage.find();
  return perso;
}

/**
 * Ajoute une person.
 */
async function add(person: IPersonnage): Promise<IPersonnage> {
  const nouvelPerso = new Personnage(person);
  await nouvelPerso.save();
  return nouvelPerso;
}

/**
 * Mets à jour un personnage.
 */
async function update(person: IPersonnage): Promise<IPersonnage | null>{
  const persoToUpdate = await Personnage.findOne({nom : person.nom});
  if (persoToUpdate === null) {
     throw HttpStatusCodes.BAD_REQUEST
  }

  persoToUpdate.nom = person.nom;
  persoToUpdate.classe = person.classe;
  persoToUpdate.niveau = person.niveau;
  persoToUpdate.race = person.race;
  persoToUpdate.pv = person.pv;
  persoToUpdate.armes = person.armes;
  persoToUpdate.stats = person.stats;
  persoToUpdate.creation = person.creation;
  persoToUpdate.mort = person.mort;
  await persoToUpdate.save();

  return persoToUpdate;
}

/**
 * Supprimer un personnage.
 */
async function delete_(_id: string): Promise<void> {
  await Personnage.findByIdAndDelete(_id);
}

/**
 * Lire tous les personnages d'une classe
 * @param classe string de la classe personnage
 * @returns les personnages trouvés
 */
async function getClasse(classe: string): Promise<IPersonnage[] | null>  {
  const perso = await Personnage.find({ "classe" : classe });
  return perso;

}

/**
 * Lire tous les personnages entre deux niveaux
 * @param min int du niveau minimal
 * @param max int du niveau maximal
 * @returns les personnages entre le min et le max
 */
async function getNiveau(min: number, max: number) : Promise<IPersonnage[] | null>{
  const perso = await Personnage.find({"niveau" : {$gte : min , $lte : max}})
  return perso;
}

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  getClasse,
  getNiveau
} as const;