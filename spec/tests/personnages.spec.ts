import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import PersonnageRepo from '@src/repos/PersonnageRepo';
import Personnage, { IPersonnage } from '@src/models/Personnage';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UserService';

import Paths from 'spec/support/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';
import { ValidationErr } from '@src/common/classes';
import { PERSONNAGE_NOT_FOUND_ERR } from '@src/services/PersonnageService';


// Dummy users for GET req
const getDummyPersonnages = () => {
  return [
    
  ];
};


// Tests
describe('PersonnageRouter', () => {

  let agent: TestAgent<Test>;

  // Run before all tests
  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  // Get all users
  describe(`"GET:${Paths.Personnage.Get}"`, () => {

    // Setup API
    const api = (cb: TApiCb) => 
      agent
        .get(Paths.Personnage.Get)
        .end(apiCb(cb));

    // Success
    it('should return a JSON object with all the users and a status code ' + 
    `of "${HttpStatusCodes.OK}" if the request was successful.`, (done) => {
      // Add spy
      const data = getDummyPersonnages();
      spyOn(PersonnageRepo, 'getAll').and.resolveTo(data);
      // Call API
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body).toEqual({ personnages: data });
        done();
      });
    });
  });

  // Test add user
  describe(`"POST:${Paths.Personnage.Add}"`, () => {

    const ERROR_MSG = ValidationErr.GetMsg('personnages'),
      DUMMY_PERSONNAGE = getDummyPersonnages()[0];

    // Setup API
    const callApi = (personnage: IPersonnage | null, cb: TApiCb) => 
      agent
        .post(Paths.Personnage.Add)
        .send({ personnage })
        .end(apiCb(cb));

    // Test add user success
    it(`should return a status code of "${HttpStatusCodes.CREATED}" if the ` + 
    'request was successful.', (done) => {
      // Spy
      spyOn(PersonnageRepo, 'add').and.resolveTo();
      // Call api
      callApi(DUMMY_PERSONNAGE, res => {
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        done();
      });
    });

    // Missing param
    it(`should return a JSON object with an error message of "${ERROR_MSG}" ` + 
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(ERROR_MSG);
        done();
      });
    });
  });

  // Update users
  describe(`"PUT:${Paths.Personnage.Update}"`, () => {

    const ERROR_MSG =  ValidationErr.GetMsg('user'),
      DUMMY_PERSONNAGE = getDummyPersonnages()[0];

    // Setup API
    const callApi = (personnage: IPersonnage | null, cb: TApiCb) => 
      agent
        .put(Paths.Personnage.Update)
        .send({ Personnage })
        .end(apiCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', (done) => {
      // Setup spies
      spyOn(PersonnageRepo, 'update').and.resolveTo();
      spyOn(PersonnageRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi(DUMMY_PERSONNAGE, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // Param missing
    it(`should return a JSON object with an error message of "${ERROR_MSG}" ` +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the user ` + 
    'param was missing.', (done) => {
      // Call api
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(ERROR_MSG);
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${PERSONNAGE_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
      // Call api
      callApi(DUMMY_PERSONNAGE, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PERSONNAGE_NOT_FOUND_ERR);
        done();
      });
    });
  });

  // Delete User
  describe(`"DELETE:${Paths.Personnage.Delete}"`, () => {

    // Call API
    const callApi = (id: number, cb: TApiCb) => 
      agent
        .delete(insertUrlParams(Paths.Personnage.Delete, { id }))
        .end(apiCb(cb));

    // Success
    it(`should return a status code of "${HttpStatusCodes.OK}" if the ` + 
    'request was successful.', (done) => {
      // Setup spies
      spyOn(PersonnageRepo, 'delete').and.resolveTo();
      spyOn(PersonnageRepo, 'persists').and.resolveTo(true);
      // Call api
      callApi(5, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    // User not found
    it('should return a JSON object with the error message of ' + 
    `"${PERSONNAGE_NOT_FOUND_ERR}" and a status code of ` + 
    `"${HttpStatusCodes.NOT_FOUND}" if the id was not found.`, done => {
      // Setup spies
      callApi(-1, res => {
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PERSONNAGE_NOT_FOUND_ERR);
        done();
      });
    });
  });
});
