const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('========================================');
console.log('   BUSCADOR DE CEP PROFISSIONAL v2.0');
console.log('   Desenvolvido por Luiz Henrique');
console.log('========================================\n');

function buscarCEP(cep) {
  return new Promise((resolve, reject) => {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function perguntarCEP() {
  rl.question('\nCole os CEPs separados por vírgula ou digite SAIR: ', async (input) => {
    if (input.toLowerCase() === 'sair') {
      console.log('\nDesenvolvido por Luiz Henrique');
      console.log('Obrigado por usar!');
      rl.close();
      return;
    }

    const ceps = input.split(',').map(cep => cep.trim().replace('-', ''));
    
    for (const cep of ceps) {
      try {
        console.log(`\nBuscando ${cep}...`);
        const resultado = await buscarCEP(cep);
        if (resultado.erro) {
          console.log(`CEP ${cep} não encontrado.`);
        } else {
          console.log(`----------------------------------------`);
          console.log(`CEP: ${resultado.cep}`);
          console.log(`Rua: ${resultado.logradouro}`);
          console.log(`Bairro: ${resultado.bairro}`);
          console.log(`Cidade: ${resultado.localidade} - ${resultado.uf}`);
          console.log(`----------------------------------------`);
        }
      } catch (error) {
        console.log(`Erro ao buscar CEP ${cep}`);
      }
    }
    
    perguntarCEP();
  });
}

perguntarCEP();