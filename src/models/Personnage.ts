import mongoose, { Schema, model } from 'mongoose';
import moment from 'moment';

// Interface pour les armes
export interface IArme {
  nom: string;
  de: string;
  degat: string;
  _id?:string;
}

// Interface des statistiquess
export interface IStat {
  force: number;
  dexterite: number;
  constitution: number;
  intelligence: number;
  sagesse: number;
  charisme: number;
  _id?: string;
}

// Schema de arme
const armeSchema = new Schema<IArme>({
  nom: {type: String,  required: [true, "Le champs nom est requis"],
    maxlength: [20, "La longueur du nom maximale est de 20 charactère"]}, 

  de: {type: String, required: [true, "Le champs de est requis"],
    maxlength: [20, "La longueur du de maximale est de 20 charactère"]},

  degat: {type: String, required: [true, "Le champs degat est requis"],
    maxlength: [20, "La longueur du degat maximale est de 20 charactère"]}
})

// Schema de statistique
const statSchema = new Schema<IStat> ({
  force: {type: Number,  required: [true, "Le champs force est requis"],
    min: [1, "La valeur minimale de la force est de 1"], 
    max: [30, "La valeur maximale de la force est de 30"]}, 

  dexterite: {type: Number,  required: [true, "Le champs dexterite est requis"],
    min: [1, "La valeur minimale de la dexterite est de 1"], 
    max: [30, "La valeur maximale de la dexterite est de 30"]}, 

  constitution: {type: Number,  required: [true, "Le champs constitution est requis"], 
    min: [1, "La valeur minimale de la constitution est de 1"],
    max: [30, "La valeur maximale de la constitution est de 30"]}, 

  intelligence: {type: Number,  required: [true, "Le champs intelligence est requis"],
    min: [1, "La valeur minimale de l'intelligence est de 1"],
    max: [30, "La valeur maximale de l'intelligence est de 30"]}, 

  sagesse: {type: Number,  required: [true, "Le champs sagesse est requis"],
    min: [1, "La valeur minimale de la sagesse est de 1"],
    max: [30, "La valeur maximale de la sagesse est de 30"]}, 

  charisme: {type: Number,  required: [true, "Le champs charisme est requis"],
    min: [1, "La valeur minimale du charsime est de 1"],
    max: [30, "La valeur maximale du charisme est de 30"]}, 
})

// Interface principale pour les personnages
export interface IPersonnage {
  nom: string;
  classe: string;
  race: string;
  niveau: number;
  pv: number;
  armes?: Array<IArme>;
  stats: IStat;
  creation: Date;
  mort: boolean;
  _id?: string;
}

// Interface pour le token
export interface IPersoLogin {
  nom : string,
  classe : string
}

// Schema pour le personnage
const PersonnageSchema = new Schema<IPersonnage>({
  nom: {type: String, unique: true, required: [true, "Le champs nom est requis"],
    maxlength: [40, "Longueur du nom maximale du nom est de 40"]},

  classe: {type: String, required: [true, "Le champs classe est requis"],
    validate: {
      validator: function (v: string) {
        return /^(Guerrier)|(Barde)|(Barbare)|(Ensorceleur)|(Clerc)|(Paladin)|(Occultiste)|(Roublard)|(Moine)|(Rodeur)|(Magicien)|(Artificier)|(Druide)$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} n'est pas une classe valide!`,
    }
  },
  race: { type: String, required: [true, "Le champs race est requis"],
    maxlength: [50, "La longueur maximale de la race est de 50"]},

  niveau: {type: Number, required: [true, "Le champs niveau est requis"],
    min: [1, "Le niveau minimale est de 1"],
    max: [20, "Le niveau maximale est de 20"]},

  pv: {type: Number, required: [true, "Le champs pv est requis"],
    min: [0, "Les pv minimal sont de 0"]},

  armes: {type: [armeSchema], required: [true, "Le champs armes est requis"],
    maxlength: [3, "Le personnage ne peut d'avoir 3 armes"]},

  stats: {type: statSchema, required: [true, "Le champs stats est requis"]},

  creation: {type: Date, required: [true, "Le champs creation est requis"],
    validate : {
      validator : function (v: Date){
        return moment(v).isValid() && v < new Date();
      },
      message: () =>
        `Votre date n'est pas une date valide! Exemple de format : 2023-12-17T08:24:00.000Z ou bien Ou bien votre date est dans le future`,
    },
    
  },
  mort: { type: Boolean, required: [true, "Le champs mort est requis"]}

});

// Schema pour le login
const PersoLoginSchema = new Schema<IPersoLogin>({
  nom: {type: String, required: true},
  classe: {type: String, required: true},
})

// fonction pour savoir si les règles des paramètre sont respect.
function isPersonnage(arg: unknown): arg is IPersonnage {
  var regex = new RegExp('^(Guerrier)|(Barde)|(Barbare)|(Ensorceleur)|(Clerc)|(Paladin)|(Occultiste)|(Roublard)|(Moine)|(Rodeur)|(Magicien)|(Artificier)|(Druide)$');
  return (
    !!arg &&
    typeof arg === 'object' &&
    'nom' in arg && typeof arg.nom === 'string' && 
    'classe' in arg && typeof arg.classe === 'string' && regex.test(arg.classe) &&
    'race' in arg && typeof arg.race === 'string' && 
    'niveau' in arg && typeof arg.niveau === 'number' &&
    'pv' in arg && typeof arg.pv === 'number' &&
    'armes' in arg && typeof arg.armes === typeof Array<IArme> &&
    'stats' in arg && typeof arg.stats === typeof statSchema &&
    'creation' in arg && moment(arg.creation as string | Date).isValid() &&
    'mort' in arg && typeof arg.mort === 'boolean'
  );
}

// fonction pour savoir si les règles des paramètre sont respect.
function isPersoLogin(arg: unknown): arg is IPersoLogin {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'nom' in arg && typeof arg.nom === 'string' && 
    'classe' in arg && typeof arg.classe === 'string'

  );
}

mongoose.pluralize(null);
export const Personnage = model<IPersonnage>('personnage', PersonnageSchema);
export const PersonLogin = model<IPersoLogin>('personLogin', PersoLoginSchema);

export default{
  isPersoLogin,
  isPersonnage

} as const