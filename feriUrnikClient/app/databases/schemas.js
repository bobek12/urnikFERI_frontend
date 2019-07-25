import Realm from 'realm';

export const IZBIRA_SCHEMA = 'Izbira';
export const UCNAENOTA_SCHEMA = 'UcnaEnota';

export const IzbiraSchema = {
    name: IZBIRA_SCHEMA,
    properties: {
        idSkupine:  'string[]',
        program: 'string',
        letnik: 'int',
        smer: 'string',
        datum: 'date?',
        urnik: {
            type: 'list', 
            objectType: UCNAENOTA_SCHEMA
        }
    }
};

export const UcnaEnotaSchema = {
    name: UCNAENOTA_SCHEMA,
    properties: {
        ucnaenota_id: 'int',
        ime: 'string',
        predavatelj_ime_priimek: 'string',
        tip: 'string',
        prostor: 'string',
        dan: 'int',
        zacetek: 'string',
        trajanje: 'int',
        zacetni_teden: 'string',
        koncni_teden: 'string',
        skupina_id: 'int'
    }
  };