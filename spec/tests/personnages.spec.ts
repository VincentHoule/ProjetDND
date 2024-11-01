import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import { Personnage, IPersonnage } from '@src/models/Personnage';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { PERSONNAGE_NOT_FOUND_ERR } from '@src/services/PersonnageService';

import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';
import { emptyDir } from 'fs-extra';

const mockify = require('@jazim/mock-mongoose');

// Données bidon pour les tests
const obtenirDonneesBidonPersonnages = () => {
  return [
    {
      nom: 'Crotus Morus',
      classe: 'Moine',
      race: 'Nain',
      niveau: 12,
      pv: 112,
      armes: [
        {
          nom: 'Baton Argent',
          de: '1d8',
          degat: 'contondant',
          _id: '66f0421c14764f71dee2caa2'
        },
        {
          nom: 'Fouet serpent',
          de: '4d8',
          degat: 'tranchant',
          _id: '66f0421c14764f71dee2caa3'
        }
      ],
      stats: {
        force: 22,
        dexterite: 16,
        constitution: 20,
        intelligence: 12,
        sagesse: 12,
        charisme: 16,
        _id: '66f03c86226dc52734d267c5'
      },
      creation: "2018-12-17T08:24:00.000Z" as unknown as Date,
      mort: false,
      _id: '66f0349f55792b968aa56c69'
    },
    {
      nom: "Godfred Osborn",
      classe: "Barbare",
      race: "Humain",
      niveau : 20,
      pv: 225,
      armes:[{
        nom: "Berserker",
        de: "2d6",
        degat: "tranchant",
        _id: '670937a50132e6e99aef4652'

      }
    ],
      stats: {
        force: 22,
        dexterite: 16,
        constitution: 20,
        intelligence: 12,
        sagesse: 12,
        charisme: 16,
        _id: '66f03c86226dc52734d264c5'

      },
      creation:"2018-12-17T08:24:00.000Z" as unknown as Date,
      mort: true,
      _id: '66f0349f55792b968aa56c67'
    }
  ];
};

// Tests
describe('PersonnageRouter', () => {
  let agent: TestAgent<Test>;

  // Ce code est exécuté avant tous les tests, pour préparer l'agent SuperTest
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // Get all de Personnage

  describe(`"GET:/api/personnage/"`, () => {
    // Initialise l'API
    const api = (cb: TApiCb) => agent.get(`/api/personnage/`).end(apiCb(cb));

    // Réussite
    it(
      'doit retourner un objet JSON avec tous les personnages et un code de status de ' +
      `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        const data = obtenirDonneesBidonPersonnages();
        mockify(Personnage).toReturn(data, 'find');
        // Appel de l'API
        api((res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ perso: data });
          const perso = res.body.perso as IPersonnage[];
          expect(perso.length).toBe(data.length);
          done();
        });
      }
    );
  });

  // Get un de Personnage

  describe(`"GET:/api/personnage/un/"`, () => {
    // Initialise l'API
    const DUMMY_Personnage = obtenirDonneesBidonPersonnages()[0];
    const callApi = (_id: string, cb: TApiCb) =>
      agent.get(insertUrlParams(`/api/personnage/un/:_id`, { _id })).end(apiCb(cb));

    // Réussite
    it(
      'doit retourner un objet JSON avec un personnage et un code de status de ' +
      `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        
        mockify(Personnage)
          .toReturn(DUMMY_Personnage, 'findOne');
        // Appel de l'API
        callApi(DUMMY_Personnage._id, (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ perso: DUMMY_Personnage });
          done();
        });
      }
    );

    it(
      'doit retourner un objet JSON avec le message d\'erreur "' +
      `${PERSONNAGE_NOT_FOUND_ERR}" et un code de statut ` +
      `"${HttpStatusCodes.NOT_FOUND}" si l'identifiant n'a pas été trouvé.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage).toReturn(null, 'findOne');

        // Appeler l'API
        callApi('aaa', (res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(PERSONNAGE_NOT_FOUND_ERR);
          done();
        });
      }
    );
  });

   // Get toutes les Personnages d'une classe

   describe(`"GET:/api/personnage/classe/"`, () => {
    // Initialise l'API
    const DUMMY_Personnage = obtenirDonneesBidonPersonnages();
    const callApi = (classe: string, cb: TApiCb) =>
      agent.get(insertUrlParams(`/api/personnage/classe/:classe`, { classe })).end(apiCb(cb));

    // Réussite
    it(
      'doit retourner un objet JSON avec tous les personnages ayant la même classe et un code de status de ' +
      `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        
        mockify(Personnage)
          .toReturn(DUMMY_Personnage.filter((perso) => perso.classe === "Moine" ), 'find');
        // Appel de l'API
        callApi("Moine", (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ perso: DUMMY_Personnage.filter((perso) => perso.classe === "Moine" )});
          done();
        });
      }
    );

    it(
      'doit retourner un objet JSON avec le message d\'erreur "' +
      `"Votre classe n'existe pas." et un code de statut ` +
      `"${HttpStatusCodes.BAD_REQUEST}" si l'identifiant n'a pas été trouvé.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage).toReturn(null, 'find');

        // Appeler l'API
        callApi('pnj', (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe("Votre classe n'existe pas.");
          done();
        });
      }
    );
  });

  
   // Get toutes les Personnages entre deux niveaux

   describe(`"GET:/api/personnage/niveau/"`, () => {
    // Initialise l'API
    const DUMMY_Personnage = obtenirDonneesBidonPersonnages();
    const callApi = ( cb: TApiCb) =>
      agent.get(`/api/personnage/niveau/?min=2&max=13`).end(apiCb(cb));
      
    // Réussite
    it(
      'doit retourner un objet JSON avec tous les personnages ayant la même classe et un code de status de ' +
      `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        
        mockify(Personnage)
          .toReturn(DUMMY_Personnage.filter((perso) => perso.niveau >= 2 && perso.niveau <= 13 ), 'find');
        // Appel de l'API
        callApi((res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          expect(res.body).toEqual({ perso: DUMMY_Personnage.filter((perso) => perso.niveau >= 2 && perso.niveau <= 13 )});
          done();
        });
      }
    );
    const callApi2 = ( cb: TApiCb) =>
      agent.get(`/api/personnage/niveau/?min=1&max=24`).end(apiCb(cb));
    it(
      'doit retourner un objet JSON avec le message d\'erreur "' +
      `"Votre niveau maximum ou minimum n'existe pas." et un code de statut ` +
      `"${HttpStatusCodes.BAD_REQUEST}" si l'identifiant n'a pas été trouvé.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage)
        .toReturn(DUMMY_Personnage.filter((perso) => perso.niveau >= 1 && perso.niveau <= 24 ), 'find');

        // Appeler l'API
        callApi2((res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe("Votre niveau maximum ou minimum n'existe pas.");
          done();
        });
      }
    );
  });


  // Test l'ajout d'un personnage
  describe(`"POST:/api/personnage/add"`, () => {
    const ERROR_MSG = `Personnage requis`,
      DUMMY_Personnage = obtenirDonneesBidonPersonnages()[0];

    // Initialise l'API
    const callApi = (perso: IPersonnage | null, cb: TApiCb) =>
      agent.post(`/api/personnage/add`).send({ perso }).end(apiCb(cb));

    // Test un ajout réussi
    it(
      `doit retourner un code de statut "${HttpStatusCodes.CREATED}" si la ` +
      'requête est réussie.',
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage).toReturn(DUMMY_Personnage, 'save');

        // Appel de l'API
        callApi(DUMMY_Personnage, (res) => {
          expect(res.status).toBe(HttpStatusCodes.CREATED);
          done();
        });
      }
    );

    // Test avec un personnage manquant
    it(
      `doit retourner un objet JSON avec un message d'erreur de "Personnage requis" ` +
      `et un code de statut "${HttpStatusCodes.BAD_REQUEST}" si le paramètre personnage ` +
      'est manquant.',
      (done) => {
        // Appel de l'API
        callApi(null, (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(ERROR_MSG);
          done();
        });
      }
    );

    // Test avec un personnage sans nom
    it(
      `doit retourner un objet JSON avec un message d'erreur de "Personnage requis" ` +
      `et un code de statut "${HttpStatusCodes.BAD_REQUEST}" si le paramètre personnage ` +
      'est manquant.',
      (done) => {
        // Appel de l'API
        const perso = { ...DUMMY_Personnage, nom: '' };
        const personnageError = {
          nom: {
            name: 'ValidatorError',
            message: 'Le champs nom est requis',
            properties: {
              message: 'Le champs nom est requis',
              type: 'required',
              path: 'nom',
              value: '',
            },
            kind: 'required',
            path: 'nom',
            value: '',

          }
        };

        callApi(perso, (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          const errors = res.body.errors;
          expect(errors).toEqual(personnageError);
          done();
        });
      }
    );
  });

  // Mise à jour d'un personnage
  describe(`"PUT:/api/personnage/update"`, () => {
    const ERROR_MSG = `Personnage requis`,
      DUMMY_Personnage = obtenirDonneesBidonPersonnages()[0];

    // Configuration de l'API
    const callApi = (perso: IPersonnage | null, cb: TApiCb) =>
      agent.put(`/api/personnage/update`).send({ perso }).end(apiCb(cb));

    // Réussite
    it(
      `doit retourner un code de statut "${HttpStatusCodes.OK}" si la ` +
      'requête est réussie.',
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage)
          .toReturn(DUMMY_Personnage, 'findOne')
          .toReturn(DUMMY_Personnage, 'save');

        // Appel de l'API
        callApi(DUMMY_Personnage, (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
      }
    );

    // Paramètre manquant
    it(
      `doit retourner un objet JSON avec un message d'erreur de "${ERROR_MSG}" ` +
      `et un code de statut "${HttpStatusCodes.BAD_REQUEST}" si le paramètre ` +
      'Personnage est manquant.',
      (done) => {
        // Appeler l'API
        callApi(null, (res) => {
          expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
          expect(res.body.error).toBe(ERROR_MSG);
          done();
        });
      }
    );

    // Personnage non trouvé
    it(
      'doit retourner un objet JSON avec le message d\'erreur "' +
      `${PERSONNAGE_NOT_FOUND_ERR}" et un code de statut ` +
      `"${HttpStatusCodes.NOT_FOUND}" si l'identifiant n'a pas été trouvé.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage).toReturn(null, 'findOne');
        // Appeler l'API
        callApi(DUMMY_Personnage, (res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(PERSONNAGE_NOT_FOUND_ERR);
          done();
        });
      }
    );
  });

  // Supprimer un personnage
  describe(`"DELETE:/api/personnage/delete/"`, () => {
    const DUMMY_Personnage = obtenirDonneesBidonPersonnages()[0];
    // Appeler l'API
    const callApi = (_id: string, cb: TApiCb) =>
      agent.delete(insertUrlParams(`/api/personnage/delete/:_id`, { _id })).end(apiCb(cb));

    // Succès
    it(
      `doit retourner un code de statut "${HttpStatusCodes.OK}" si la ` +
      'requête est réussie.',
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage)
          .toReturn(DUMMY_Personnage, 'findOne')
          .toReturn(DUMMY_Personnage, 'findOneAndRemove');

        // Appeler l'API
        callApi(DUMMY_Personnage._id, (res) => {
          expect(res.status).toBe(HttpStatusCodes.OK);
          done();
        });
      }
    );

    // Personnage non trouvé
    it(
      'doit retourner un objet JSON avec le message d\'erreur "' +
      `${PERSONNAGE_NOT_FOUND_ERR}" et un code de statut ` +
      `"${HttpStatusCodes.NOT_FOUND}" si l'identifiant n'a pas été trouvé.`,
      (done) => {
        // Préparer le simulacre de Mongoose
        mockify(Personnage).toReturn(null, 'findOne');

        // Appeler l'API
        callApi('aaa', (res) => {
          expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
          expect(res.body.error).toBe(PERSONNAGE_NOT_FOUND_ERR);
          done();
        });
      }
    );
  });
});
