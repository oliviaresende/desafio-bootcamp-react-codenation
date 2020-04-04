const fetch = require('node-fetch');
const sha1 = require('js-sha1');
const fs = require('fs');
const FormData = require('form-data');
const token = '2083402b9e7c17a1d9ca2f39ef978da4126b0e5c';
const filename = 'answer.json';
function decifrar(cifrado, numero_casas) {
    let decifrado = '';
    console.log(cifrado)
    for (let i = 0; i < cifrado.length; i++) {
        const c = cifrado.charCodeAt(i);
        if (97 <= c && c <= 122) {
            decifrado += String.fromCharCode(((c + (26 - numero_casas) % 26 - 97) % 26) + 97);
        }
        else
            decifrado += String.fromCharCode(c);
    }
    console.log(decifrado)
    return decifrado;
}
async function main() {

    const data = await fetch(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`)
        .then(res => res.json())
    data.decifrado = decifrar(data.cifrado, data.numero_casas);
    data.resumo_criptografico = sha1(data.decifrado);
    const content = JSON.stringify(data);

    fs.writeFileSync(filename, content);
}
function sendFileToServer() {
    const formData = new FormData();
    formData.append('answer', fs.createReadStream(filename));
  
    return fetch(`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`, {
      method: 'POST',
      body: formData
    })
  }
main();
sendFileToServer();