// gerarVenda.js
import fs from "fs";

// Carrega JSON
const dadosBrutos = fs.readFileSync("./produtos.json", "utf8");
const produtosJson = JSON.parse(dadosBrutos);

// ----------------------------
// Funções auxiliares
// ----------------------------

function weightedRandom(opcoes) {
    // opcoes = [ { valor, peso }, ... ]
    const totalPeso = opcoes.reduce((acc, o) => acc + o.peso, 0);
    let r = Math.random() * totalPeso;

    for (const op of opcoes) {
        if (r < op.peso) return op.valor;
        r -= op.peso;
    }
}

function gerarCPF() {
    let n = [];
    for (let i = 0; i < 9; i++) n.push(Math.floor(Math.random() * 9));

    let d1 = n.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;

    let d2 = n.reduce((acc, num, idx) => acc + num * (11 - idx), 0) + d1 * 2;
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;

    return `${n.join("")}${d1}${d2}`;
}

const formatarCPF = cpf =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

function gerarTipoPagamento() {
    const tipos = ["pix", "pix", "pix", "cartao", "dinheiro"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

// ----------------------------
// Geração da venda
// ----------------------------

function gerarVenda() {
    const ativos = produtosJson.produtosFormatados.filter(p => p.status === "ativo");

    // Nº de produtos por venda com pesos:
    // 1 → peso 50
    // 2 → peso 25
    // 3 → peso 15
    // 4 → peso 7
    // 5 → peso 3
    const qtdProdutos = weightedRandom([
        { valor: 1, peso: 50 },
        { valor: 2, peso: 25 },
        { valor: 3, peso: 15 },
        { valor: 4, peso: 7 },
        { valor: 5, peso: 3 }
    ]);

    const produtos = [];
    for (let i = 0; i < qtdProdutos; i++) {
        const escolhido = ativos[Math.floor(Math.random() * ativos.length)];

        // Quantidade com pesos:
        // 1 → peso 70
        // 2 → peso 25
        // 3 → peso 5
        const quantidade = weightedRandom([
            { valor: 1, peso: 70 },
            { valor: 2, peso: 25 },
            { valor: 3, peso: 5 }
        ]);

        produtos.push({
            id_produto: escolhido.id_produto,
            quantidade
        });
    }

    const tipoPagamento = gerarTipoPagamento();

    return {
        produtos,
        pagamento: {
            tipo: tipoPagamento,
            cpf: formatarCPF(gerarCPF())
        }
    };
}

// ----------------------------
// Exemplo de uso
// ----------------------------

console.log(JSON.stringify(gerarVenda(), null, 4));
