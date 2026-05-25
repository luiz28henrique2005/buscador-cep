const fs = require('fs');
const readline = require('readline');

async function buscarCEP(cep) {
  try {
    let resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let dados = await resposta.json();
    
    if (dados.erro) return `CEP ${cep} - Não encontrado`;
    
    return `${cep} - ${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
  } catch (erro) {
    return `CEP ${cep} - Erro na busca`;
  }
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== BUSCADOR DE CEP PRO ===');
  console.log('Desenvolvido por Luiz Henrique\n');
  
  rl.question('Cole os CEPs separados por vírgula: ', async (input) => {
    let ceps = input.split(',').map(c => c.trim());
    let resultados = [];
    
    console.log('\nBuscando...\n');
    
    for (let cep of ceps) {
      let resultado = await buscarCEP(cep);
      console.log(resultado);
      resultados.push(resultado);
    }
    
    fs.writeFileSync('enderecos_salvos.txt', resultados.join('\n'));
    console.log('\n✅ Arquivo enderecos_salvos.txt gerado com sucesso!');
    
    rl.close();
  });
}

main();