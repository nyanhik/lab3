
//////////////////////////////////////////////
///////////// ГОСТ  \\\\\\\\\\
function Gost(encryptKey) {

    if (encryptKey.length != 8){
        alert("Длина ключа должна быть 8 символов");
    }


    var cryptoKey = encryptKey; //Ключ зашифрования/Расшифрования

    //Таблица замен
    var EXCHANGE_TABLE = [
        {0: '9', 1: '6', 2: '3', 3: '2', 4: '8', 5: 'b', 6: '1', 7: '7', 8: 'a', 9: '4', a: 'e', b: 'f', c: 'c', d: '0', e: 'd', f: '5'},
        {0: '3', 1: '7', 2: 'e', 3: '9', 4: '8', 5: 'a', 6: 'f', 7: '0', 8: '5', 9: '2', a: '6', b: 'c', c: 'b', d: '4', e: 'd', f: '1'},
        {0: 'e', 1: '4', 2: '6', 3: '2', 4: 'b', 5: '3', 6: 'd', 7: '8', 8: 'c', 9: 'f', a: '5', b: 'a', c: '0', d: '7', e: '1', f: '9'},
        {0: 'e', 1: '7', 2: 'a', 3: 'c', 4: 'd', 5: '1', 6: '3', 7: '9', 8: '0', 9: '2', a: 'b', b: '4', c: 'f', d: '8', e: '5', f: '6'},
        {0: 'b', 1: '5', 2: '1', 3: '9', 4: '8', 5: 'd', 6: 'f', 7: '0', 8: 'e', 9: '4', a: '2', b: '3', c: 'c', d: '7', e: 'a', f: '6'},
        {0: '3', 1: 'a', 2: 'd', 3: 'c', 4: '1', 5: '2', 6: '0', 7: 'b', 8: '7', 9: '5', a: '9', b: '4', c: '8', d: 'f', e: 'e', f: '6'},
        {0: '1', 1: 'd', 2: '2', 3: '9', 4: '7', 5: 'a', 6: '6', 7: '0', 8: '8', 9: 'c', a: '4', b: '5', c: 'f', d: '3', e: 'b', f: 'e'},
        {0: 'b', 1: 'a', 2: 'f', 3: '5', 4: '0', 5: 'c', 6: 'e', 7: '8', 8: '6', 9: '2', a: '3', b: '9', c: '1', d: '7', e: 'd', f: '4'}
    ];
    var MODE = {
        encrypt:    [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0],
        decrypt:    [0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0],
    };


     //Метод блочного шифрования в режиме простой замены

    this.crypt = function (text, mode) { //входной текст + Режим работы ключа (encrypt/decrypt)
        var xorResult = '';
        var result = '';

        splitIntoBlocks(text).forEach(function (block) {
            MODE[mode].forEach(function (k) {
                xorResult = CicleLeftShift(exchangeChars(mod2_32(block[1].charCodeAt(0), cryptoKey.charCodeAt(k))), 11) ^ block[0].charCodeAt(0);
                block.reverse();
                block[1] = String.fromCharCode(xorResult);

            });

            result += block.join('');

        });

        return result;

    };


    this.encryptKey = function(encryptKey){

        if (!arguments.length) return cryptoKey;
        if (encryptKey.length != 8){

            alert("Длина ключа должна быть 8 символов");
        }
        cryptoKey = encryptKey;
    };





    function padString(string, char, length) { //дописываем в начало целевой строки заданные символы до достижени нужной длины
        while (string.length < length)
            string = char + string;
        return string;
    }

    function exchangeChars(input) { //разделение 32-х битного блока на 4-х битные блоки + переводим блоки в hex и заменяем по таблице
        return parseInt(padString(input.toString(2), '0', 32).replace(/(....)/g, function (match) {
            return parseInt(match, 2).toString(16);
        }).split('').reverse().map(function (item, i) {
            return EXCHANGE_TABLE[i][item];
        }).reverse().join(''), 16);

    }

    function splitIntoBlocks(text) { //разделяет входящую строку на блоки по 2 символа (32*2 = 64 бит)

        if (text.length % 2) {
          text += ' '; //есл в строке нечетное количетсов символов, то дописывает в конец пробел
        }

        return text.match(/(..)/g).map(function(item) {return item.split('');});

    }

    function CicleLeftShift(value, shift) { //Циклический сдвиг влево

        return parseInt(parseInt(value).toString(2).slice(shift) + parseInt(value).toString(2).slice(0, shift), 2);

    }

    function mod2_32(a, b) { //сложение по модулю 32
        var result = (a + b).toString(2);

        return result.length > 32 ? parseInt(result.slice(1), 2) : parseInt(result, 2);
    }

}

// выше только ГОСТ \\
//////////////////////////////////////////////////////////////////////////////////////////


function getBinary(string) { // строка в двоичку
  let binary = "";
  for (let i = 0; i < string.length; i++) {
    let str = string.charCodeAt(i).toString(2);
    if (str.length < 8) {
      for (let j = str.length; j < 8; j++) {
        str = "0" + str;
      }
    }
    binary += str;
  }

  return binary;
}


function getText(binary) { //двоичку в строку
  let string = "";
  for (let i = 0; i < binary.length; i += 8) {
    let current = binary.slice(i, i + 8);
    let ch = String.fromCharCode(parseInt(current, 2));
    string += ch;
  }

  return string;
}


function genLongKey(text, key) { // генерируем ключ шифрования на основе ГОСТ
    let textForLongKey = getBinary(text);
//    console.log(textForLongKey.length);
    var longKey = "";
    for (let i = 0; i <= textForLongKey.length -1; i++) {
      var EncryptedMessage = new Gost(key);
      longKey = String(longKey.concat(EncryptedMessage.crypt(String(textForLongKey[i]),'encrypt')));
    }
    longKey = getBinary(longKey);
  //  console.log("longKey", longKey);
    return longKey

}



function xor(binary1, binary2) {
  let outcome = "";
  for (let i = 0; i < binary1.length; i++) {
    let current;
    if (binary1[i] === binary2[i]) {
      current = "0";
    } else {
      current = "1";
    }
    outcome += current;
  }

  return outcome;
}


function encryptMessage() { //зашифровать
  let plaintext = document.getElementById("input").value;
  let key = document.getElementById("key").value;
//  console.log(key);
  let binary1 = getBinary(plaintext);
  let binary2 = getBinary(key);


  let longKey = getBinary(genLongKey(plaintext, key));
//  console.log(longKey);



  let outcome = xor(binary1, longKey);


  document.getElementById("output").innerHTML = outcome;
}


function decryptMessage() { //расшифровать
  let binary1 = document.getElementById("input").value;
  let key = document.getElementById("key").value;
  let binary2 = getBinary(key);



  let longKey = getBinary(genLongKey(getText(binary1), key));




  let outcome = xor(binary1, longKey);


  let string = getText(outcome);

  document.getElementById("output").innerHTML = string;
}
