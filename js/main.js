import {Gost} from './Gost.js'

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

document.getElementById('encrypt').addEventListener('click', () => {
  encryptMessage();
})

document.getElementById('decrypt').addEventListener('click', () => {
  decryptMessage();
})