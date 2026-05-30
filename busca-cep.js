async function buscarCEP(cep) {
    let resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let dados =await resposta.json();

    if (dados.erro) {
        return 'CEP ${cep} não encontrado';
  }

return `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
 }

 async function main() {
    let ceps = ['01001000', '20040020', '30112010'];

    for (let cep of ceps) {
        let resultado = await buscarCEP(cep);
        console.log(resultado);
    }
    }
main();