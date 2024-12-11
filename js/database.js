const BASE_URL = "https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = 'users/';
const CONTACTS_PATH= 'contacts/';
const NEXT_ID_PATH = 'nextId/';

/**
 * Saves data to the specified path using the given method.
 * @param {string} path - The API path.
 * @param {Object} data - The data to save.
 * @param {string} [method='PUT'] - HTTP method to use.
 * @returns {Promise} API response.
 */
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

/**
 * Fetches data from the specified path with optional query parameters.
 * @param {string} path - The API path.
 * @param {Object} [params={}] - Query parameters.
 * @returns {Promise} API response data.
 */
async function getData(path, params = {}) {
    let pathMod = BASE_URL + path + '.json?';
    for (let key in params) {
        pathMod += key + '=\"' + params[key] + '\"&';
    }
    return await fetch(pathMod)
        .then((res) => res.json())
        .catch(() => console.log('fehler beim Daten holen'));
}

/**
 * Generates and saves the next available ID.
 * @returns {Promise<number>} The next ID.
 */
async function getId() {
    let nextId = await getData(NEXT_ID_PATH);
    nextId++;
    saveData(NEXT_ID_PATH, nextId);
    return nextId;
}

/**
 * Deletes data at the specified path.
 * @param {string} path - The API path.
 * @returns {Promise} API response.
 */
async function deleteData(path) {
    return fetch(BASE_URL + path + '.json', {
        method: 'DELETE'
    })
        .catch(() => console.warn('fehler beim löschen'))
}
