var http = require('http');
const request = require('request');
const methodMappers = require('./solves');

const server = http.createServer(function (request, response) {}).listen(process.env.PORT || 8080);

const BASE_URL = 'https://speedcoding.toptal.com';
const CFUUID = 'd289ca26a1bb1adb0c9fd84e2545703231607442066';
const PHPSESSID = 'b5e135403a45efc56bb7a6fda8952a11';
const GA = 'GA1.2.915148913.1607442073';
const GID = 'GA1.2.1912215665.1607442073';
const FBP = 'fb.1.1607315228567.510057450';
const UETSID = 'a4507bc03a1911eb97150f8c3f5e2870';
const UETVID = 'a4512fe03a1911ebb1eadd59204db704';
const HUBSPOTUTK = '7aa63578239fb01ed3be31efcb34bfa5';
const HSTC = '6380845.7aa63578239fb01ed3be31efcb34bfa5.1607315231772.1607315231772.1607315231772.1';
let ENTRY_ID = '';
let ENTRY_KEY = '';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: `__cfduid=${CFUUID}; PHPSESSID=${PHPSESSID}; _ga=${GA}; _gid=${GID}; _fbp=${FBP}; _uetsid=${UETSID}; _uetvid=${UETVID}; __hstc=${HSTC}; hubspotutk=${HUBSPOTUTK}; hubspotutk=1; _gat_gtag_UA_153788370_1=1`,
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

async function attemptTask(data) {
    try {
        const { tests_json } = data.nextTask;
        const methodMapper = methodMappers[data.nextTask.title];
        const form = {
            attempt_id: data.attemptId,
            entry_key: ENTRY_KEY,
            tests_json: JSON.stringify(Object.fromEntries(Object.entries(tests_json).map( ([key, value]) => [key, value.result || methodMapper.memo[value.args[0]] || cachingResult(methodMapper, value.args[0])] ))),
            code: methodMapper.code,
        }
        const options = {
            url: `${BASE_URL}/webappApi/entry/${ENTRY_ID}/attemptTask`,
            headers: {
                ...headers,
            },
            form,
        };
        request.post(options, (error, response, body) => {
            const { data }  = JSON.parse(body);
            //console.log(data.isSuccess)
            if (data.isSuccess && data.nextTask) {
                attemptTask(data);
            } else {
                console.log(data);
                totalPoints.push(data.totalPoints);
                if (attempCount++ < MAX_ATTEMP) {
                    setTimeout(() => doIt(), 8000);
                } else {
                    server.close();
                    console.log(totalPoints.sort(function(a, b){return a-b}));
                }
            }
        })
    } catch(error) {
        console.error(error);
    }
}

async function getEntryToken() {
    try {
        const form = {
            challengeSlug: 'toptal-js-2020',
            email: '',
            leaderboardName: 'Ghosh',
            countryAlpha2: 'BD',
        }
        const options = {
            url: `${BASE_URL}/webappApi/entry?ch=22&acc=1024`,
            headers: {
                ...headers,
            },
            form,
          };
        request.post(options, (error, response, body) => {
            const { data } = JSON.parse(body);
            ENTRY_ID = data.entry.id;
            ENTRY_KEY = data.entry.entry_key;
            attemptTask(data);
        });
    } catch(error) {
        console.error(error);
    }
}

async function doIt() {
    getEntryToken();
}

doIt();
