const methodMappers = {
    'Number To String': {
        method: (x) => {
            return x.toString()
        },
        code: `.`,
        memo: {},
    },
    'Triple': {
        method: (x) => {
            return x * 3
        },
        code: `.`,
        memo: {},
    },
    'Float To int': {
        method: (x) => {
            return parseInt(x)
        },
        code: `.`,
        memo: {},
    },
    'Is Odd': {
        method: (x) => {
            return x % 2 == 1
        },
        code: `.`,
        memo: {},
    },
    'Square Root': {
        method: (x) => {
            return Math.sqrt(x)
        },
        code: `.`,
        memo: {},
    },
    'Surface Area of a Cube': {
        method: (x) => {
            return parseFloat((6 * x *x).toFixed(4))
        },
        code: `.`,
        memo: {},
    },
    'String to Number': {
        method: (x) => {
            return parseFloat(x)
        },
        code: `.`,
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
    'Reverse String': {
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
    'Swap Halves': {
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
    'Longest String': {
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
    'Capitalize First Letters': {
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
    }
}

module.exports = methodMappers;