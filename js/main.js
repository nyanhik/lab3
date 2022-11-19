import { Gost } from './Gost.js'

class StreamCipher extends Gost {
  constructor(key) {
    super(key);
  }

  getBinary(string) { // строка в двоичку
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

  crypt(text, mode) {
    return super.crypt(text, mode);
  }
    
  genLongKey(text) { // генерируем ключ шифрования на основе ГОСТ
      let textForLongKey = this.getBinary(text);
      let longKey = "";
      for (let i = 0; i <= textForLongKey.length -1; i++) {
        longKey = String(longKey.concat(this.crypt(String(textForLongKey[i]),'encrypt')));
      }
      longKey = this.getBinary(longKey);
      return longKey
  
  }
  
  getText(binary) { //двоичку в строку
    let string = "";
    for (let i = 0; i < binary.length; i += 8) {
      let current = binary.slice(i, i + 8);
      let ch = String.fromCharCode(parseInt(current, 2));
      string += ch;
    }
  
    return string;
  }
  
  xor(binary1, binary2) {
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
}

function encryptMessage() { //зашифровать
  let plaintext = document.getElementById("input").value;
  let key = document.getElementById("key").value;
  let streamCipher = new StreamCipher(key);
  let binary1 = streamCipher.getBinary(plaintext);

  let longKey = streamCipher.getBinary(streamCipher.genLongKey(plaintext, key));

  let outcome = streamCipher.xor(binary1, longKey);


  document.getElementById("output").value = outcome;
}


function decryptMessage() { //расшифровать
  let binary1 = document.getElementById("input").value;
  let key = document.getElementById("key").value;
  let streamCipher = new StreamCipher(key);

  let longKey = streamCipher.getBinary(streamCipher.genLongKey(streamCipher.getText(binary1), key));

  let outcome = streamCipher.xor(binary1, longKey);

  let string = streamCipher.getText(outcome);

  document.getElementById("output").value = string;
}

document.getElementById('encrypt').addEventListener('click', () => {
  encryptMessage();
})

document.getElementById('decrypt').addEventListener('click', () => {
  decryptMessage();
})