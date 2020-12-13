const methodMappers = {
    'numberToString': {
        method: (x) => {
            return `${x}`
        },
        code: `.`,
        memo: {},
    },
    'triple': {
        method: (x) => {
            return x * 3
        },
        code: `.`,
        memo: {},
    },
    'floatToInt': {
        method: (x) => {
            return parseInt(x)
        },
        code: `.`,
        memo: {},
    },
    'isOdd': {
        method: (x) => {
            return x % 2 == 1
        },
        code: `.`,
        memo: {},
    },
    'squareRoot': {
        method: (x) => {
            return Math.sqrt(x)
        },
        code: `.`,
        memo: {},
    },
    'cubeSurfaceArea': {
        method: (x) => {
            return parseFloat((6 * x * x).toFixed(4))
        },
        code: `.`,
        memo: {},
    },
    'stringToNumber': {
        method: (x) => {
            return parseFloat(x)
        },
        code: `.`,
        memo: {},
    },
    'removeFirstThree': {
        method: (x) => {
            const result = []
            for (let i in x) {
                if (i >= 3) {
                    result.push(x[i])
                }
            }
            return result
        },
        code: `.`,
        memo: {},
    },
    'returnOddElements': {
        method: (x) => {
            const result = []
            for (let i in x) {
                if (i % 2 == 0) {
                    result.push(x[i])
                }
            }
            return result
        },
        code: `.`,
        memo: {},
    },
    'doubleIndex': {
        method: (x) => {
            const result = []
            for (let i in x) {
                if (x[i] == i * 2) {
                    result.push(x[i])
                }
            }
            return result
        },
        code: `.`,
        memo: {},
    },
    'hasOnlyVowels': {
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
    'flatten': {
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
    'sphereVolume': {
        method: (x) => {
            return parseFloat(((4/3) * Math.PI * x * x * x).toFixed(4))
        },
        code: `.`,
        memo: {},
    },
    'getFileExtension': {
        method: (x) => {
            const sp = x.split('.')
            return sp.length > 1 ? sp[sp.length - 1] : ''
        },
        code: `.`,
        memo: {},
    },
    'invertCase': {
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
    'sortingType': {
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
    'mostFrequentItem': {
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
    'hasBalancePoint': {
        method: (x) => {
            if (x.length > 0) {
                const y = []
                let count = 0
                for(let i in x) {
                    count += x[i]
                    y.push(count)
                }
                for(let i in y) {
                    if (y[i] * 2 == y[y.length - 1]) {
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
    'dateRank': {
        method: (x) => {
            let initDate = new Date('12/31/2018')
            let date = new Date(x)
            const diff = date - initDate;
            return diff / (1000 * 60 * 60 * 24)
        },
        code: '.',
        memo: {},
    },
    'reverseString': {
        method: (x) => {
            let result = '';
            for(let i = x.length - 1; i >= 0; i--) {
                result += x[i];
            }
            return result;
        },
        code: '.',
        memo: {},
    },
    'swapHalves': {
        method: (x) => {
            let firstHalf = '';
            let secondHalf = '';
            for(let i = 0; i < x.length; i++) {
                if (i < Math.floor(x.length / 2)) {
                    firstHalf += x[i];
                } else {
                    secondHalf += x[i];
                }
            }
            return `${secondHalf}${firstHalf}`
        },
        code: '.',
        memo: {}
    },
    'longestString': {
        method: (x) => {
            let longest = x[0];
            if (x.length > 1) {
                for(let i = 1; i < x.length; i++) {
                    if (x[i].length > longest.length) {
                        longest = x[i];
                    }
                }
            }
            return longest
        },
        code: '.',
        memo: {}
    },
    'capitalizeFirstLetters': {
        method: (x) => {
            let result = '';
            let spaceFound = true;
            for (let char in x) {
                if (spaceFound) {
                    result += x[char].toUpperCase();
                    spaceFound = false;
                } else if(x[char] == ' ') {
                    result += x[char];
                    spaceFound = true;
                } else {
                    result += x[char];
                }
            }
            return result;
        },
        code: '.',
        memo: {}
    },
    'convert_to_camel_case': {
        method: (x) => {
            let result = ''
            let foundHyphenOrUnderScore = false;
            for (let c in x) {
                if (x[c] == '-' || x[c] == '_') {
                    foundHyphenOrUnderScore = true
                    continue
                } else if (foundHyphenOrUnderScore) {
                    foundHyphenOrUnderScore = false
                    result += x[c].toUpperCase()
                } else {
                    result += x[c]
                }
            }
            return result
        },
        code: '.',
        memo: {}
    },
    'isBalanced': {
        method: (x) => {
            let openingParamCount = 0
            for (let c in x) {
                if (x[c] == '(') {
                    openingParamCount++
                } else if (x[c] == ')') {
                    if (openingParamCount > 0) {
                        openingParamCount--
                    } else {
                        return false
                    }
                }
            }
            return openingParamCount == 0
        },
        code: '.',
        memo: {}
    },
    'primeFactors': {
        method: (x) => {
            let primeFactors = []
            while(x % 2 == 0) {
                primeFactors.push(2)
                x /= 2
            }
            for (let i  = 3; i <= Math.sqrt(x); i += 2) {
                while(x % i == 0) {
                    primeFactors.push(i)
                    x /= i
                }
            }
            if (x > 2) {
                primeFactors.push(x)
            }
            return primeFactors
        },
        code: '.',
        memo: {}
    },
    'occurrenceCheck': {
        method: (x) => {
            const occuranceMap = {};
            const occuranceMapReverse = {};
            for(let i in x) {
                if (!!occuranceMap[x[i]]) {
                    occuranceMap[x[i]] += 1;
                } else {
                    occuranceMap[x[i]] = 1;
                }
            }
            for (let i in occuranceMap) {
                if(!!occuranceMapReverse[occuranceMap[i]]) {
                    occuranceMapReverse[occuranceMap[i]] += 1;
                } else {
                    occuranceMapReverse[occuranceMap[i]] = 1;
                }
            }
            let lenCount = Object.keys(occuranceMapReverse).length;
            if ( lenCount > 2) {
                return false;
            } else if (lenCount == 1) {
                return true;
            } else if (lenCount == 2) {
                const [first, second] = Object.keys(occuranceMapReverse);
                const smaller = occuranceMapReverse[first] > occuranceMapReverse[second] ? second : first;
                const greater = occuranceMapReverse[first] > occuranceMapReverse[second] ? first : second;
                return occuranceMapReverse[smaller] == 1 && (smaller - 1 == 0 || smaller - 1 == greater);
            }
        },
        code: '.',
        memo: {},
    },
    'sumDigits': {
        method: (x) => {
            return x.split('')
            .filter((a, i) => x.charCodeAt(i) >= 48 && x.charCodeAt(i) <= 57)
            .reduce((total, a) => parseInt(a) + total, 0)
        },
        code: '.',
        memo: {},
    },
}

module.exports = methodMappers;