import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PersoService from '@src/services/PersonnageService';
import  {Personnage, IPersonnage } from '@src/models/Personnage';
import { IReq, IRes } from './common/types';
import check from './common/check';
import { ToObjectOptions } from 'mongoose';



// **** Functions **** //

/**
 * 
 * @param _
 * @param res retour de requête
 * @returns 
 */
async function getAll(_: IReq, res: IRes) {
  const perso = await PersoService.getAll();
  return res.status(HttpStatusCodes.OK).json({ perso });
}

/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns 
 */
async function getOne(req: IReq, res: IRes) {
  const _id = check.isStr(req.params, '_id');
  const perso = await PersoService.getOne(_id);
  return res.status(HttpStatusCodes.OK).json({ perso });
}

/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns 
 */
async function add(req: IReq, res: IRes) {
  if (req.body == null) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({error :"Personnage requis"})
  }
  let { perso }  = req.body;
  perso = await PersoService.add(perso as IPersonnage);
  return res.status(HttpStatusCodes.CREATED).json({ perso });
}
/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns le personnage mis à jour
 */
async function update(req: IReq, res: IRes) {
  let { perso } = req.body;
  perso = await PersoService.update(perso as IPersonnage);
  return res.status(HttpStatusCodes.OK).json({ perso });
}

/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns status de la suppression
 */
async function delete_(req: IReq, res: IRes) {
  const _id = check.isStr(req.params, '_id');
  await PersoService.delete(_id);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns les personnages avec la classe choisi
 */
async function getClasse(req: IReq, res: IRes) {
  const classe = check.isStr(req.params, 'classe');
  const perso = await PersoService.getClasse(classe);
  return res.status(HttpStatusCodes.OK).json({ perso });
}

/**
 * 
 * @param req 
 * @param res retour de requête
 * @returns les personnages entre le niveau max et le niveau min
 */
async function getNiveau(req: IReq, res: IRes) {
  const min = check.isNum(req.query, 'min');
  const max = check.isNum(req.query, 'max');
  const perso = await PersoService.getNiveau(min, max);
  return res.status(HttpStatusCodes.OK).json({ perso });
}



// **** Export default **** //

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
  getNiveau,
  getClasse
} as const;