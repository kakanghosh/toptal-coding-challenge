const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'https://speedcoding.toptal.com';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: '__cfduid=d6253ca3d67ee0d86688eb058bebd9d621607095786; PHPSESSID=118e6d249d3e87d85404d64155ca8c2f; _ga=GA1.2.1291478384.1607095796; _gid=GA1.2.2112274456.1607095796; _gat_gtag_UA_153788370_1=1',
    accept: 'application/json, text/javascript, */*; q=0.01', 
}
let attempCount = 0;
let MAX_ATTEMP = 5;
const totalPoints = [];

const methodMappers = {
    'Number To String': {
        method: (x) => {
            return x.toString()
        },
        code: `a`,
        result: {"test1":"1","test2":"3.141","test4":"-23"},
    },
    'Triple': {
        method: (x) => {
            return x * 3
        },
        code: `a`,
        result: {"test1":6,"test2":12,"test4":-36,"test3":4.5,"test5":-4.5,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088},
    },
    'Float To int': {
        method: (x) => {
            return parseInt(x)
        },
        code: `a`,
        result: {"test1":1,"test2":1,"test4":0,"test3":-1,"test5":52,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088},
    },
    'Is Odd': {
        method: (x) => {
            return x % 2 == 1
        },
        code: `a`,
        result: {"test1":false,"test2":false,"test4":true,"test3":true,"test5":false,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false},
    },
    'Square Root': {
        method: (x) => {
            return Math.sqrt(x)
        },
        code: `a`,
        result: {"test1":2,"test2":4,"test4":12,"test3":1.5,"test5":10,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736},
    },
    'Surface Area of a Cube': {
        method: (x) => {
            return parseFloat((6 * x *x).toFixed(4))
        },
        code: `a`,
        result: {"test1":72600,"test2":5892486,"test4":807.36,"test3":2965.0374,"test5":22627.1286,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736},
    },
    'String to Number': {
        method: (x) => {
            return parseFloat(x)
        },
        code: `a`,
        result: {"test1":1,"test2":3.242342342342342e+23,"test4":87.45,"test3":-21,"test5":42,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586]},
    },
    'Remove first 3 elements on array': {
        method: (x) => {
            return x.slice(3, x.length)
        },
        code: `.`,
        result: {"test1":[89,876,738,211],"test2":[4,5],"test4":[963,844,809,8,431,620],"test3":[4],"test5":[],"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586]},
    },
    'Odd Elements': {
        method: (x) => {
            return x.filter((a, i) => i % 2 == 0)
        },
        code: `.`,
        result: {"test1":["a","c","e","g","i","k"],"test2":["January","March"],"test4":"hiddenfile","test3":["Monday","Wednesday","Friday","Sunday"],"test5":"ext","rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":"dots","test7":"many","test8":"with","test9":"mp3"},
    },
    'Double Index': {
        method: (x) => {
            return x.filter((a, i) => a == i * 2)
        },
        code: `.`,
        result: {"test1":[0,2,4,6,8,10,12,14,16,18,20],"test2":[0,6],"test4":[],"test3":[2],"test5":[],"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":"dots","test7":"many","test8":"with","test9":"mp3","rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32]},
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
        result: {"test1":false,"test2":true,"test4":true,"test3":true,"test5":false,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":true,"test7":false,"test8":"with","test9":"mp3","rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":[],"nested1":[0,1],"nested2":[0,1,2,3,4,5]},
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
        result: {"test1":[0,2,4,6,8,10,12,14,16,18,20],"test2":[0,6],"test4":[],"test3":[2],"test5":[],"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":"dots","test7":"many","test8":"with","test9":"mp3","rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":[],"nested1":[0,1],"nested2":[0,1,2,3,4,5]},
    },
    'SphereVolume': {
        method: (x) => {
            return parseFloat(((4/3) * Math.PI * x * x * x).toFixed(4))
        },
        code: `.`,
        result: {"test1":1,"test2":3.242342342342342e+23,"test4":87.45,"test3":-21,"test5":42,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018},
    },
    'Get File Extension': {
        method: (x) => {
            const sp = x.split('.')
            return sp.length > 1 ? sp[sp.length - 1] : ''
        },
        code: `.`,
        result: {"test1":"","test2":"","test4":"hiddenfile","test3":"txt","test5":"ext","rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":"dots","test7":"many","test8":"with","test9":"mp3"},
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
        result: {"test1":false,"test2":true,"test4":true,"test3":true,"test5":false,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":true,"test7":false,"test8":"with","test9":"mp3","rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":"","nested1":[0,1],"nested2":[0,1,2,3,4,5],"mixed":"fLiRpYdUCK","all_lowercase":"FUNKEY MONKEY","all_uppercase":"monkey magic","rnd_pku_Will":"VOLUPTAS RATIONE","rnd_jnd_Cynthia":"EIUS 6I EXCEPTURI ullam SOLUTA VOLUPTAS neque EOS AUT cumque","rnd_ewx_Robb":"SIT"},
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
        result: {"test1":1,"test2":0,"test4":-1,"test3":0,"test5":1,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":1,"test7":-1,"test8":0,"test9":1,"rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":"","nested1":[0,1],"nested2":[0,1,2,3,4,5],"mixed":"fLiRpYdUCK","all_lowercase":"FUNKEY MONKEY","all_uppercase":"monkey magic","rnd_pku_Will":"VOLUPTAS RATIONE","rnd_jnd_Cynthia":"EIUS 6I EXCEPTURI ullam SOLUTA VOLUPTAS neque EOS AUT cumque","rnd_ewx_Robb":"SIT","test10":-1,"rnd_pas_Brock":-1,"rnd_jqe_Liam":-1,"rnd_owc_Perry":1},
    },
    'Most Frequent': {
        method: (x) => {
            let freq = {}
            x.forEach(a => {
                if (freq[a]) {
                    freq[a] += 1
                } else {
                    freq[a] = 1
                }
            }) 
            return parseInt(Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b)) 
        },
        code: `.`,
        result: {"test1":1,"test2":0,"test4":-1,"test3":0,"test5":1,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":1,"test7":-1,"test8":0,"test9":1,"rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":"","nested1":[0,1],"nested2":[0,1,2,3,4,5],"mixed":"fLiRpYdUCK","all_lowercase":"FUNKEY MONKEY","all_uppercase":"monkey magic","rnd_pku_Will":"VOLUPTAS RATIONE","rnd_jnd_Cynthia":"EIUS 6I EXCEPTURI ullam SOLUTA VOLUPTAS neque EOS AUT cumque","rnd_ewx_Robb":"SIT","test10":-1,"rnd_pas_Brock":-1,"rnd_jqe_Liam":-1,"rnd_owc_Perry":1,"few":1,"mix":5,"mix2":3,"zero":0,"rnd_ywv_Joshuah":862,"rnd_syr_Axel":494,"rnd_ocp_Colten":362},
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
          result: {"test1":1,"test2":0,"test4":-1,"test3":0,"test5":1,"rnd_nrw_Adolphus":1680,"rnd_gnb_Meghan":1365,"rnd_xpa_Isaiah":2088,"rnd_axr_Grover":false,"rnd_hna_Novella":false,"rnd_jgn_Polly":false,"rnd_eqg_Wilbert":41095.3056,"rnd_gou_Genesis":28178.1654,"rnd_rpz_Dalton":4106.0736,"rnd_odo_Misael":[],"rnd_exs_Robb":[808],"rnd_ygn_Elsa":[416,586],"test_1":3602717.0935,"test_2":303736.3531,"test_3":1317.0897,"test_4":185822.5414,"test_5":1057401.3101,"test_6":634264.2545,"rnd_tgj_Leonora":3490257.5851,"rnd_sfu_Florencio":5131.4481,"rnd_ybm_Mackenzie":95949.7018,"test6":1,"test7":-1,"test8":0,"test9":1,"rnd_pqm_Kamille":[0,4,6,16,18,20],"rnd_jyh_Aglae":[2,4,8,10,14,20,22,26],"rnd_kmg_Maximus":[2,6,8,10,14,16,18,24,28,30,32],"flat":[0,1,2],"empty":true,"nested1":[0,1],"nested2":[0,1,2,3,4,5],"mixed":"fLiRpYdUCK","all_lowercase":"FUNKEY MONKEY","all_uppercase":"monkey magic","rnd_pku_Will":"VOLUPTAS RATIONE","rnd_jnd_Cynthia":"EIUS 6I EXCEPTURI ullam SOLUTA VOLUPTAS neque EOS AUT cumque","rnd_ewx_Robb":"SIT","test10":-1,"rnd_pas_Brock":-1,"rnd_jqe_Liam":-1,"rnd_owc_Perry":1,"few":1,"mix":5,"mix2":3,"zero":true,"rnd_ywv_Joshuah":862,"rnd_syr_Axel":494,"rnd_ocp_Colten":362,"bad1":false,"good1":true,"rnd_abj_Odessa":false,"rnd_lgt_Marianna":true,"rnd_lbx_Orlo":false},
    }
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
        console.log(response.data.data.isSuccess);
        if (response.data.data.isSuccess && response.data.data.nextTask) {
            const { data } = response.data;
            const { tests_json } = data.nextTask;
            const methodMapper = methodMappers[data.nextTask.title];
            if (methodMapper) {
                arguments.attempId = data.attemptId;
                for(const property in tests_json) {
                    if (tests_json[property].result) {
                        arguments.testsJson[property] = tests_json[property].result;
                    } else {
                        arguments.testsJson[property] = methodMapper.method(tests_json[property].args[0]);
                    }
                }
                arguments.code = methodMapper.code;
                attemptTask(arguments);
            } else {
                console.log('Method not found: '+data.nextTask.title);
            }
        } else {
            console.error(response.data);
            totalPoints.push(response.data.data.totalPoints);
            if (attempCount++ < MAX_ATTEMP) {
                getEntryToken();
            } else {
                console.log(totalPoints);
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
        console.log(data);
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
            if (tests_json[property].result) {
                payload.testsJson[property] = tests_json[property].result;
            } else {
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