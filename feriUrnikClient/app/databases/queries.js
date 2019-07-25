import Realm from 'realm';
import {IzbiraSchema, UcnaEnotaSchema, IZBIRA_SCHEMA, UCNAENOTA_SCHEMA} from './schemas';

export const insertIzbira = (idSkupine, program, letnik, smer) => new Promise((resolve, reject) => {  
    Realm
    .open({schema: [IzbiraSchema, UcnaEnotaSchema]})
    .then(realm => {
        realm.write(() => {
            realm.create(IZBIRA_SCHEMA, {
                idSkupine,
                program,
                letnik,
                smer
            });
            resolve();
        })
    })
    .catch(error => {
        reject(error);
    });
});

export const getIzbira = () => new Promise((resolve, reject) => {  
    Realm
    .open({schema: [IzbiraSchema, UcnaEnotaSchema]})
    .then(realm => {
        let izbira = realm.objects(IZBIRA_SCHEMA);
        resolve(izbira[0]);
    })
    .catch(error => {
        reject(error);
    });
});

export const deleteAllIzbira = () => new Promise((resolve, reject) => {  
    Realm
    .open({schema: [IzbiraSchema, UcnaEnotaSchema]})
    .then(realm => {
        realm.write(() => {
            let allIzbira = realm.objects(IZBIRA_SCHEMA);
            realm.delete(allIzbira);
            resolve();
        })
    })
    .catch(error => {
        reject(error);
    });
});

export const insertUrnik = (newUrnik) => new Promise((resolve, reject) => {    
    Realm
    .open({schema: [IzbiraSchema, UcnaEnotaSchema]})
    .then(realm => {
        realm.write(() => {
            let izbira = realm.objects(IZBIRA_SCHEMA);
            izbira.datum = new Date();
            newUrnik.map(obj => {
                let ucnaEnota = {
                    ucnaenota_id: obj.ucnaenota_id,
                    ime: obj.ime,
                    predavatelj_ime_priimek: obj.predavatelj_ime_priimek,
                    tip: obj.tip,
                    prostor: obj.prostor,
                    dan: obj.dan,
                    zacetek: obj.zacetek,
                    trajanje: obj.trajanje,
                    zacetni_teden: obj.zacetni_teden,
                    koncni_teden: obj.koncni_teden,
                    skupina_id: obj.skupina_id
                }
                izbira[0].urnik.push(ucnaEnota); 
            })
            resolve();
        });
    }).catch((error) => {
        reject(error)
    });
});