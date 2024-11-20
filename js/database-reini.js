
// Firebase-URL von Sabrina
// const BASE_URL = "https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/";

// Firebase-URL von Reini
const BASE_URL = "https://join-43c13-default-rtdb.europe-west1.firebasedatabase.app/";

const USERS_PATH = 'users/';
// const CONTACTS_PATH= 'contacts/'
const CONTACTS_PATH= 'contactsTESTING/'; ///DEBUG
const NEXT_ID_PATH = 'nextId/';


/*#####################*/
/*## GET / SAVE DATA ##*/
/*#####################*/

async function saveData(path, data, method = 'PUT') {
    return fetch(BASE_URL + path + '.json', {
        'method': method,
        'header': {
            'Content-Type': "application/json",
        },
        'body': JSON.stringify(data)
    })
        .then((res) => res.json);
}



// params: {key: value, key: value, ...}
async function getData(path, params = {}) {
    let pathMod = BASE_URL + path + '.json?';
    for (let key in params) {
        pathMod += key + '=\"' + params[key] + '\"&';
    }
    return await fetch(pathMod)
        .then((res) => res.json())
        .catch(() => console.log('fehler beim Daten holen'));
}


async function getId() {
    let nextId = await getData(NEXT_ID_PATH);
    nextId++;
    saveData(NEXT_ID_PATH, nextId);
    return nextId;
}

async function deleteData(path) {
    return fetch(BASE_URL + path + '.json', {
        method: 'DELETE'
    })
        .catch(() => console.warn('fehler beim löschen'))
}

/*###########*/
/*## DEBUG ##*/
/*###########*/

const TEST_PATH = 'test/';

async function tuEsDatabase() {
    saveData(USERS_PATH, someTestUser, 'PATCH');
}

async function saveTestUsers() {
    await saveData(USERS_PATH, testUsers);
}

/* let testUsers= {
    1: {
        name: 'Fritz Test',
        email: 'fritzTest@join.test',
        pw: '1'
    },
    2: {
        name: 'Sepp Test',
        email: 'seppTest@join.test',
        pw: '1'
    },
    3: {
        name: 'Hans Test',
        email: 'hansTest@join.test',
        pw: '1'
    },
}; */

let testUsers = [
    {
        id: 0,
        name: 'Fritz Test',
        email: 'fritzTest@join.test',
        pw: '1'
    },
    {
        id: 1,
        name: 'Sepp Test',
        email: 'seppTest@join.test',
        pw: '1'
    },
    {
        id: 2,
        name: 'Hans Test',
        email: 'hansTest@join.test',
        pw: '1'
    },
    {
        id: 13,
        name: 'SomeTestUser Test',
        email: 'stu@join.test',
        pw: '1'
    },
    {
        id: 23,
        name: 'A A',
        email: 'a@a',
        pw: '1'
    },
];

let someTestUser = {
    id: 13,
    name: 'SomeTestUser Test',
    email: 'stu@join.test',
    pw: '1'
}