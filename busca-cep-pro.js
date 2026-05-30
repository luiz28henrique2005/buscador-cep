const readline = require('readline');
const fs = require('fs');
const https = require('https');
const path = require('path');


const arquivoLicenca = path.join(process.env.USERPROFILE, 'Desktop', '.licenca');
let usosRestantes = 5;


try {
    if (fs.existsSync(arquivoLicenca)) {
        const conteudo = fs.readFileSync(arquivoLicenca, 'utf8');
        usosRestantes = parseInt(conteudo);
        if (isNaN(usosRestantes)) usosRestantes = 0;
    } else {
        fs.writeFileSync(arquivoLicenca, '5');
    }
} catch (err) {
    console.log('\n❌ Erro ao acessar licença. Execute como Administrador.\n');
    usosRestantes = 5;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function buscarCep(cep) {
    return new Promise((resolve) => {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const resultado = JSON.parse(data);
                    if (resultado.erro) {
                        console.log(`\n❌ CEP ${cep} não encontrado.\n`);
                        resolve(false);
                    } else {
                        console.log(`\n✅ CEP: ${resultado.cep}`);
                        console.log(`Rua: ${resultado.logradouro}`);
                        console.log(`Bairro: ${resultado.bairro}`);
                        console.log(`Cidade: ${resultado.localidade} - ${resultado.uf}\n`);
                        resolve(true);
                    }
                } catch (e) {
                    console.log(`\n❌ Erro ao processar CEP ${cep}\n`);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.log(`\n❌ Erro na conexão: ${err.message}\n`);
            resolve(false);
        });
    });
}

async function perguntarCEP() {
    rl.question('\nCole os CEPs separados por vírgula ou digite SAIR: ', async (input) => {
        if (input.toUpperCase() === 'SAIR') {
            rl.close();
            return;
        }

        const listaCeps = input.split(',').map(c => c.replace(/\D/g, '')).filter(c => c.length === 8);

        if (listaCeps.length === 0) {
            console.log('\n⚠️  Digite CEPs válidos com 8 dígitos.\n');
            perguntarCEP();
            return;
        }

        for (const cep of listaCeps) {
            const achou = await buscarCep(cep);
            if (achou) {
                usosRestantes--;
                try {
                    fs.writeFileSync(arquivoLicenca, usosRestantes.toString());
                } catch (e) {
                    console.log('\n❌ Erro ao salvar licença.\n');
                }
            }
        }

        if (usosRestantes > 0) {
            console.log(`\nConsultas restantes: ${usosRestantes}`);
            perguntarCEP();
        } else {
            console.log('\n⚠️  ATENÇÃO: Esta foi sua última consulta grátis!');
            console.log('Reinicie o programa para ver instruções de pagamento.\n');
            rl.question('Pressione ENTER para continuar...', () => {
                rl.close();
            });
        }
    });
}


if (usosRestantes <= 0) {
    console.log('\n❌ LICENÇA DE DEMONSTRAÇÃO EXPIRADA ❌');
    console.log('\nVocê usou suas 5 consultas grátis.');
    console.log('\nPara liberar consultas ILIMITADAS:');
    console.log('FAÇA UM PIX DE R$ 300,00 PARA:');
    console.log('efcfd40a-6436-445b-bcff-d4d3fbc500f1\n');
    console.log('Após o pagamento, envie o comprovante pra liberar a versão completa.\n');
    rl.question('Pressione ENTER para sair...', () => {
        rl.close();
    });
} else {
    console.log('==========================================');
    console.log(' BUSCADOR DE CEP PROFISSIONAL v3.0');
    console.log(' Desenvolvido por Luiz Henrique');
    console.log('==========================================');
    console.log('\nVersão de Demonstração - ' + usosRestantes + ' consultas restantes\n');
    perguntarCEP();
}