/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },
  Personnage: {
    Base: '/personnage',
    Get: '/',
    GetOne: '/un/:_id',
    GetClasse: '/classe/:classe',
    GetNiveau: '/niveau/',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:_id',
  },
} as const;
