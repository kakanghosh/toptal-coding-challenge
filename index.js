const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'https://speedcoding.toptal.com';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: '__cfduid=dfe672adb53209b303ca0ab4132a35b7a1607227596; PHPSESSID=bf0a4c886f934f487ca0a6114c64677b; _ga=GA1.2.1639154922.1607227598; _gid=GA1.2.1098306433.1607227598; _gat_gtag_UA_153788370_1=1',
    accept: 'application/json, text/javascript, */*; q=0.01', 
}
let attempCount = 0;
let MAX_ATTEMP = 10;
const totalPoints = [];
let skipping = [];
let calculating = [];

const methodMappers = {
    'Number To String': {
        method: (x) => {
            return x.toString()
        },
        code: `a`,
        memo: {},
    },
    'Triple': {
        method: (x) => {
            return x * 3
        },
        code: `a`,
        memo: {},
    },
    'Float To int': {
        method: (x) => {
            return parseInt(x)
        },
        code: `a`,
        memo: {},
    },
    'Is Odd': {
        method: (x) => {
            return x % 2 == 1
        },
        code: `a`,
        memo: {},
    },
    'Square Root': {
        method: (x) => {
            return Math.sqrt(x)
        },
        code: `a`,
        memo: {},
    },
    'Surface Area of a Cube': {
        method: (x) => {
            return parseFloat((6 * x *x).toFixed(4))
        },
        code: `a`,
        memo: {},
    },
    'String to Number': {
        method: (x) => {
            return parseFloat(x)
        },
        code: `a`,
        memo: {},
    },
    'Remove first 3 elements on array': {
        method: (x) => {
            return x.slice(3, x.length)
        },
        code: `.`,
        memo: {},
    },
    'Odd Elements': {
        method: (x) => {
            return x.filter((a, i) => i % 2 == 0)
        },
        code: `.`,
        memo: {},
    },
    'Double Index': {
        method: (x) => {
            return x.filter((a, i) => a == i * 2)
        },
        code: `.`,
        memo: {},
    },
    'Only Vowels': {
        method: (x) => {
            for(let c in x) {
                let upperChar = x[c].toUpperCase();
                if (upperChar === 'A' ||  upperChar === 'E' || upperChar === 'I' || upperChar === 'O' || upperChar === 'U') {
                    continue;
                } else {
                    return false;
                }
            }
            return true;
        },
        code: `.`,
        memo: {},
    },
    'Flatten2': {
        method: (x) => {
            let res = []
            function cal(a) {
              a.forEach(n => {
                if (Array.isArray(n)) {
                    cal(n);
                } else {
                    res.push(n);
                }
              })
            }
            cal(x);
            return res;
        },
        code: `.`,
        memo: {},
    },
    'SphereVolume': {
        method: (x) => {
            return parseFloat(((4/3) * Math.PI * x * x * x).toFixed(4))
        },
        code: `.`,
        memo: {},
    },
    'Get File Extension': {
        method: (x) => {
            const sp = x.split('.')
            return sp.length > 1 ? sp[sp.length - 1] : ''
        },
        code: `.`,
        memo: {},
    },
    'Invert Case': {
        method: (x) => {
            let res = '';
            for(let c in x) {
                if (x.charCodeAt(c) >= 65 && x.charCodeAt(c) <= 90) {
                    res += x[c].toLowerCase();
                } else if (x.charCodeAt(c) >= 97 && x.charCodeAt(c) <= 122) {
                    res += x[c].toUpperCase();
                } else {
                    res += x[c];
                }
            }
            return res;
        },
        code: `.`,
        memo: {},
    },
    'Sorting Type': {
        method: (x) => {
            let ascending = x[0] < x[1];
            let descending = !ascending;
            for(let i = 1; i < x.length; i++) {
                if ( (ascending && x[i] < x[i-1]) || (descending && x[i] > x[i-1]) ) {
                    return 0;
                }
            }
            if (ascending) return 1;
            else if (descending) return -1;
        },
        code: `.`,
        memo: {},
    },
    'Most Frequent': {
        method: (x) => {
            let freq = {}
            let freqDist;

            x.forEach(key => {
                if (!!freq[key]) {
                    freq[key] += 1
                } else {
                    freq[key] = 1
                }
                if (!!freqDist && freqDist.value < freq[key]) {
                    freqDist = {key: parseInt(key), value: freq[key]}
                } else if (!(!!freqDist)) {
                    freqDist = {key: parseInt(key), value: freq[key]}
                }
            })
            return freqDist.key;
        },
        code: `.`,
        memo: {},
    },
    'Has Balance Points': {
        method: (x) => {
            if (x.length > 0) {
                for(let i in x) {
                    let sumBefore = 0;
                    for (let j = 0; j < i; j++) {
                        sumBefore += x[j];
                    }
                    let sumAfter = 0;
                    for (let j = i; j < x.length; j++) {
                        sumAfter += x[j];
                        if (sumAfter > sumBefore) {
                            break;
                        }
                    }
                  if (sumBefore === sumAfter) {
                    return true;
                  }
                }
              } else{
                return true;
              }
              return false;
        },
        code: `.`,
        memo: {},
    },
    'Return the Rank of a Day in a Year': {
        method: (x) => {
            let initDate = new Date('12/31/2018')
            let date = new Date(x)
            const diff = date - initDate;
            return diff / (1000 * 60 * 60 * 24)
        },
        code: '.',
        memo: {},
    },
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
        //console.log(response.data.data.isSuccess);
        if (response.data.data.isSuccess && response.data.data.nextTask) {
            const { data } = response.data;
            const { tests_json } = data.nextTask;
            const methodMapper = methodMappers[data.nextTask.title];
            if (methodMapper) {
                arguments.attempId = data.attemptId;
                for(const property in tests_json) {
                    if (!!tests_json[property].result) {
                        //skipping.push('Skipping for ' + data.nextTask.title);
                        arguments.testsJson[property] = tests_json[property].result;
                    } else {
                        //calculating.push('Calculating for ' + data.nextTask.title);
                        let argument = tests_json[property].args[0];
                        if (!!methodMapper.memo[argument]) {
                            //console.log('using memo :D ', argument, methodMapper.memo[argument]);
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
            //console.log(skipping);
            //console.log(calculating);
            //skipping = calculating = [];
            totalPoints.push(response.data.data.totalPoints);
            if (attempCount++ < MAX_ATTEMP) {
                setTimeout(() => getEntryToken(), 8000);
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
        const response = await axios.post(`${BASE_URL}/webappApi/entry?ch=22&acc=1024`, form, {
            headers: {
                ...headers,
                ...form.getHeaders()
            }
        });
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
                //skipping.push('Skipping for ' + data.nextTask.title);
                payload.testsJson[property] = tests_json[property].result;
            } else {
                //calculating.push('Calculating for ' + data.nextTask.title);
                payload.testsJson[property] = methodMapper.method(tests_json[property].args[0]);
            }
        }
        payload.code = methodMapper.code;
        attemptTask(payload);
    } catch(error) {
        console.error(error);
    }
}

getEntryToken();
