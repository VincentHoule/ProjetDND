import { IPersonnage } from '@src/models/Personnage';
import 'supertest';

declare module 'supertest' {
  export interface Response {
    headers: Record<string, string[]>;
    body: {
      error?: string;
      errors?: Error.ValidationError;
      personnages: IPersonnage[];
    };
  }
}