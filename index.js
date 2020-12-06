const axios = require('axios');
const FormData = require('form-data');
const methodMappers = require('./solves');

const BASE_URL = 'https://speedcoding.toptal.com';
const CFUUID = 'defb954f10efe9de517b143c4d7f2f12e1607269829';
const PHPSESSID = '7233851168d71d46d188be2435a6c30a';
const GA = 'GA1.2.1904510360.1607269833';
const GID = 'GA1.2.1991834392.1607269833';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: `__cfduid=${CFUUID}; PHPSESSID=${PHPSESSID}; _ga=${GA}; _gid=${GID}; _gat_gtag_UA_153788370_1=1`,
    accept: 'application/json, text/javascript, */*; q=0.01', 
}
let attempCount = 0;
let MAX_ATTEMP = 10;
const totalPoints = [];

async function attemptTask(arguments) {
    try {
        const form = new FormData();
        form.append('attempt_id', arguments.attempId);
        form.append('entry_key', arguments.entryKey);
        form.append('tests_json', JSON.stringify(arguments.testsJson));
        form.append('code', arguments.code);
        const response = await axios.post(`${BASE_URL}/webappApi/entry/${arguments.entryId}/attemptTask`, form, {
            headers: {
                ...headers,
                ...form.getHeaders()
            }
        });
        // console.log(response.data.data.isSuccess);
        if (response.data.data.isSuccess && response.data.data.nextTask) {
            const { data } = response.data;
            const { tests_json } = data.nextTask;
            const methodMapper = methodMappers[data.nextTask.title];
            if (methodMapper) {
                arguments.attempId = data.attemptId;
                for(const property in tests_json) {
                    if (!!tests_json[property].result) {
                        arguments.testsJson[property] = tests_json[property].result;
                    } else {
                        let argument = tests_json[property].args[0];
                        if (argument in methodMapper.memo) {
                            arguments.testsJson[property] = methodMapper.memo[argument];
                        } else {
                            let result = methodMapper.method(argument);
                            arguments.testsJson[property] = result;
                            methodMapper.memo[argument] = result;
                        }
                    }
                }
                arguments.code = methodMapper.code;
                attemptTask(arguments);
            } else {
                console.log('Method not found: '+data.nextTask.title);
                console.log(response.data);
            }
        } else {
            console.log(response.data);
            totalPoints.push(response.data.data.totalPoints);
            if (attempCount++ < MAX_ATTEMP) {
                setTimeout(() => doIt(), 8000);
            } else {
                console.log(totalPoints.sort(function(a, b){return a-b}));
            }
        }
    } catch(error) {
        console.error(error);
    }
}

async function getEntryToken() {
    try {
        const form = new FormData();
        form.append('challengeSlug', 'toptal-js-2020');
        form.append('email', '');
        form.append('leaderboardName', 'Ghosh');
        form.append('countryAlpha2', 'BD');
        return await axios.post(`${BASE_URL}/webappApi/entry?ch=22&acc=1024`, form, {
            headers: {
                ...headers,
                ...form.getHeaders()
            }
        });
    } catch(error) {
        console.error(error);
    }
}

async function doIt() {
    let response = await getEntryToken();
    const { data } = response.data;
    const payload = {
        entryId: data.entry.id,
        attempId: data.attemptId,
        entryKey: data.entry.entry_key,
        testsJson: {},
        code: '',
    };
    const {tests_json} = data.nextTask;
    const methodMapper = methodMappers[data.nextTask.title];
    for(const property in tests_json) {
        if (!!tests_json[property].result) {
            payload.testsJson[property] = tests_json[property].result;
        } else {
            payload.testsJson[property] = methodMapper.method(tests_json[property].args[0]);
        }
    }
    payload.code = methodMapper.code;
    attemptTask(payload);
}

doIt();
