import {StreamCipher} from './StreamCipher.js'

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