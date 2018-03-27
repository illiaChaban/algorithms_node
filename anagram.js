//By replacing each of the letters in the word CARE with 1, 2, 9,
// and 6 respectively, we form a square number: 1296 = 362. 
//What is remarkable is that, by using the same digital substitutions,
// the anagram, RACE, also forms a square number: 9216 = 962. We 
//shall call CARE (and RACE) a square anagram word pair and specify 
//further that leading zeroes are not permitted, neither may a 
//different letter have the same digital value as another letter.
// Using the attached words.txt file, a 16K text file containing 
//nearly two-thousand common English words, find all the square 
//anagram word pairs (a palindromic word is NOT considered to be 
//an anagram of itself).
// What is the largest square number formed by any member of such a pair?
// NOTE: All anagrams formed must be contained in the given text file.


const fs = require('fs');
const promisify = require('util').promisify;
const assert = require('assert');
const equal = require('deep-equal');

let text = [];
let textObj = [];

let readFile = promisify(fs.readFile)

readFile('words.txt', 'utf8')
    .then( (data) => {
        regExp = /([A-Z]+)/
        
        textArr = data.split('","');
        for (let i = 0; i < textArr.length; i++) {
            textArr[i] = regExp.exec(textArr[i])[1]
        }
        // console.log(text)
        return textArr
    })
    .then( (textArr) => {
        let anagramArr = []
        while (textArr.length > 0) {
            let anagrams = findAllAnagrams(textArr[0], textArr);
            if (anagrams.length > 1) {
                anagramArr.push(anagrams);
            }
            
            textArr = refreshText(anagrams, textArr);
        }
        anagramArr = splitArrayByPairs(anagramArr);
        anagramArr = clearPalindroms(anagramArr);
        // console.log(anagramArr);
        return anagramArr;
    })
    .then( (arr) => {
        let sqArr = createUniqueSquaresArr();
        let sqObj = createUSObjectReverse(sqArr);
        // console.log(sqObj);
        let arrWordSquares = findSquareAnagramPairs(arr, sqObj);
        console.log(arrWordSquares);
        let biggestSq = findBiggestSquareObj(arrWordSquares);
        console.log(biggestSq);
    })


let findBiggestSquareObj = (arrWordsSquareObj) => {
    let biggestSq = 0;
    for (let obj of arrWordsSquareObj) {
        let keys = Object.keys(obj);
        for (let key of keys) {
            if (obj[key] > biggestSq) {
                biggestSq = obj[key];
            }
        }
    }
    return biggestSq;
}

let findSquareAnagramPairs = (pairsArr, squaresObj) => {
    let arrWordSquares = [];
    for (let i = 0; i < pairsArr.length; i ++) {
        let word1 = pairsArr[i][0];
        let word2 = pairsArr[i][1];
        let wordLength = word1.length.toString();
        for (let num of squaresObj[wordLength]) {
            if (getSquareAnagramObj(word1, num, word2)) {
                arrWordSquares.push(getSquareAnagramObj(word1, num, word2))
                break;
            }
        }
    }
    return arrWordSquares;
}

let getSquareAnagramObj = (word1, sqNum1, word2) => {
    let sqAnagram = {};
    let dependancy = {};
    let sqNum1Arr = sqNum1.toString().split('');

    for (let i = 0; i < word1.length; i++) {
        dependancy[word1[i]] = sqNum1Arr[i];
    }
    let sqNum2 = getNumRepresent(word2, dependancy);
    if (checkIfSquare(sqNum2)) {
        sqAnagram[word1] = sqNum1;
        sqAnagram[word2] = sqNum2;
        return sqAnagram;
    }
    return false;
}

let getNumRepresent = (word2, dependancy1) => {
    let numRepresent = '';
    for ( let char of word2) {
        numRepresent += dependancy1[char];
    }
    return Number(numRepresent);
}

let checkIfSquare = (num) => {
    if (Math.sqrt(num) % 1 === 0) {
        return true;
    }
    return false;
}

let createUSObjectReverse = (arr) => {
    let obj = {}

    for (let length = 3; length < 11; length ++) {
        obj[length] = [];
    }

    for (let num of arr ) {
        if (getNumLength(num) > 2) {
            obj[getNumLength(num)].unshift(num);
        }
    }
    return obj;
}

let createUniqueSquaresArr = () => {
    let arr = [];
    let lastNumber = 0
    let count = 2;
    while (lastNumber < 999999999) {
        lastNumber = count ** 2;
        arr.push(lastNumber);
        count ++;
        
    }
    arr = checkUniqueDigits(arr);
    return arr;
    
}

let checkUniqueDigits = (arr) => {
    let newArr = []
    for (let number of arr) {
        number = number.toString();
        let unique = true;
        for (let i = 0; i < number.length - 1; i++) {
            for (let j = i + 1; j < number.length; j++) {
                if (number[i] === number[j]) {
                    unique = false;
                }
            }
        }
        if (unique) {
            newArr.push(Number(number));
        }
    }
    return newArr;
}

let getNumLength = (number) => {
    return number.toString().length
}

// console.log(createSquaresArr())

let countLetters = (word) => {
    let obj = {};
    word.split('');
    for ( let char of word) {
        if (obj[char]) {
            obj[char] ++
        } else { obj[char] = 1 }
    }
    return obj;
}

assert.deepEqual(countLetters('hello'), {h: 1, e: 1, l: 2, o: 1}, 'wronnng' )
// console.log(countLetters('heeeeello'))
// console.log(text);

let findAllAnagrams = (word, textArray) => {
    let anagramArr = [word];
    for (let word2 of textArray) {
        if ( word !== word2 && equal( countLetters(word), countLetters(word2)) ) {
            anagramArr.push(word2)
        }
    }
    return anagramArr;
}

let refreshText = (arr, textArray) => {
    for (let word of arr) {
        let index = textArray.indexOf(word);
        textArray.splice(index, 1);
    }
    return textArray;
}



let clearPalindroms = (arr) => {
    let indexes = []
    for (let i = 0; i < arr.length; i++) {
        if (checkPalindroms(arr[i])) {
            indexes.push(i)
        }
    }
    if (indexes) {
        for (let j = indexes.length - 1; j >= 0; j--) {
            arr.splice(indexes[j], 1);
        }
    }
    return arr;
}

let checkPalindroms = (wordsArr) => {
    if ( wordsArr[0] === reverseWord(wordsArr[1])) {
        return true;
    }
    return false;
}

let reverseWord = (word) => {
    return word.split('').reverse().join('');
}

let splitArrayByPairs = (array) => {
    for (let j = 0; j < array.length; j ++) {
        if (array[j].length === 3) {
            
            let arr1 = [array[j][0], array[j][1]];
            let arr2 = [array[j][1], array[j][2]];
            let arr3 = [array[j][0], array[j][2]];

            array.push(arr1);
            array.push(arr2);
            array.push(arr3);

            array.splice(j,1)
            
        }
        
    }
    return array;
    
}