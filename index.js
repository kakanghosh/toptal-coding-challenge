var http = require('http');
const axios = require('axios');
const FormData = require('form-data')
const methodMappers = require('./solves');

const server = http.createServer(function (request, response) {}).listen(process.env.PORT || 8080);

const BASE_URL = 'https://speedcoding.toptal.com';
const CFUUID = 'd24ade80240c5dea422e4deb0f5dd337b1607785339';
const PHPSESSID = 'e88ff9278ef8d6c30c66873b7d996ecd';
const GA = 'GA1.2.431038163.1607592443';
const GID = 'GA1.2.1354439223.1607592443';
const FBP = 'fb.1.1607315228567.510057450';
const UETSID = 'e894e7203ac911ebb88d6d05b1529cef';
const UETVID = 'e895cba03ac911ebb2eeb3ffd8a1f421';
const HUBSPOTUTK = '7aa63578239fb01ed3be31efcb34bfa5';
const HSTC = '6380845.7aa63578239fb01ed3be31efcb34bfa5.1607315231772.1607315231772.1607315231772.1';
let ENTRY_ID = '';
let ENTRY_KEY = '';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // Cookie: `__cfduid=${CFUUID}; PHPSESSID=${PHPSESSID}; _ga=${GA}; _gid=${GID}; _fbp=${FBP}; _uetsid=${UETSID}; _uetvid=${UETVID}; __hstc=${HSTC}; hubspotutk=${HUBSPOTUTK}; hubspotutk=1; _gat_gtag_UA_153788370_1=1`,
    Cookie: `__cfduid=${CFUUID}; PHPSESSID=${PHPSESSID}`,
    accept: 'application/json, text/javascript, */*; q=0.01', 
}
let attempCount = 0;
let MAX_ATTEMP = 25 * 4;
const totalPoints = [];

let cachingResult = (methodMapper, arg) => {
    let result = methodMapper.method(arg);
    methodMapper.memo[arg] = result;
    return result;
}

async function attemptTask(args) {
    try {
        //console.time('time')
        const { tests_json } = args.nextTask;
        const methodMapper = methodMappers[args.nextTask.slug];
        const form = new FormData();
        form.append('attempt_id', args.attemptId);
        form.append('entry_key', ENTRY_KEY);
        form.append('tests_json', JSON.stringify(Object.fromEntries(Object.entries(tests_json).map( ([key, value]) => [key, value.result || methodMapper.memo[value.args[0]] || cachingResult(methodMapper, value.args[0]) ] ))));
        form.append('code', methodMapper.code);
        const response = await axios.post(`${BASE_URL}/webappApi/entry/${ENTRY_ID}/attemptTask`, form, {
            headers: {
                ...headers,
                ...form.getHeaders(),
            }
        })
        const { data } = response.data
        // console.log(data.isSuccess);
        if (data.isSuccess && data.nextTask) {
            //console.log(args.nextTask.slug);
            //console.timeEnd('time')
            //console.log('');
            attemptTask(data);
        } else {
            console.log(data.totalPoints);
            totalPoints.push(data.totalPoints);
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
        const response = await axios.post(`${BASE_URL}/webappApi/entry?ch=22&acc=1024`,form, { headers: {
            ...headers,
            ...form.getHeaders(),
        }})
        const { data } = response.data;
        ENTRY_ID = data.entry.id;
        ENTRY_KEY = data.entry.entry_key;
        attemptTask(data);
    } catch(error) {
        console.error(error);
    }
}

async function doIt() {
    getEntryToken();
}

doIt();
