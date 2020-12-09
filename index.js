var http = require('http');
const axios = require('axios');
const FormData = require('form-data');
const methodMappers = require('./solves');

const server = http.createServer(function (request, response) {}).listen(process.env.PORT || 8080);

const BASE_URL = 'https://speedcoding.toptal.com';
const CFUUID = 'd289ca26a1bb1adb0c9fd84e2545703231607442066';
const PHPSESSID = '63506bf5a8af73e7efec0fc5f3a14025';
const GA = 'GA1.2.915148913.1607442073';
const GID = 'GA1.2.1912215665.1607442073';
const FBP = 'fb.1.1607315228567.510057450';
const UETSID = '77edd330384411eb9efee90a239dd8bb';
const UETVID = '77ee3530384411eb88fe7340deb9a410';
const HUBSPOTUTK = '7aa63578239fb01ed3be31efcb34bfa5';
const HSTC = '6380845.7aa63578239fb01ed3be31efcb34bfa5.1607315231772.1607315231772.1607315231772.1';

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: `__cfduid=${CFUUID}; PHPSESSID=${PHPSESSID}; _ga=${GA}; _gid=${GID}; _fbp=${FBP}; _uetsid=${UETSID}; _uetvid=${UETVID}; __hstc=${HSTC}; hubspotutk=${HUBSPOTUTK}; hubspotutk=1; _gat_gtag_UA_153788370_1=1`,
    accept: 'application/json, text/javascript, */*; q=0.01', 
}
let attempCount = 0;
let MAX_ATTEMP = 25;
const totalPoints = [];

let cachingResult = (methodMapper, arg) => {
    let result = methodMapper.method(arg);
    methodMapper.memo[arg] = result;
    return result;
}

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
            //console.log(data.nextTask);
            if (methodMapper) {
                arguments.attempId = data.attemptId;
                arguments.testsJson = Object.fromEntries(Object.entries(tests_json).map( ([key, value]) => {
                    let argument = value.args[0];
                    return [key, value.result || methodMapper.memo[argument] || cachingResult(methodMapper, argument) ];
                }));
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
                server.close();
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
