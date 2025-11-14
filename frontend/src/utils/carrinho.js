const CHAVE = "produtos";


// Lê o carrinho do localstorage
export function obterCarrinho () {
    if(localStorage.hasOwnProperty(CHAVE)) {
        return JSON.parse(localStorage.getItem(CHAVE));
    }
    return [];
}

// Salva o carrinho no localStorage
function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE, JSON.stringify(carrinho))
    localStorage.setItem("carrinhoAtualizado", Date.now());
    window.dispatchEvent(new Event("carrinhoAtualizado"));
}

// Adicionar ao carrinho
export function adicionarAoCarrinho(produto) {
    let carrinho = obterCarrinho();

    const index = carrinho.findIndex((p) => p.id_produto === produto.id_produto);

    if(index !== -1 ) {
        // ja existe -> adiciona
        carrinho[index].quantidade +=1;
    } else {
        carrinho.push({...produto, quantidade: 1})
    }

    salvarCarrinho(carrinho)
}

// Atualizar quantidade do item
export function atualizarQuantidade(id_produto, novaQuantidade) {
    let carrinho = obterCarrinho();
     console.log(id_produto)
    carrinho = carrinho.map((p) => 
       
        p.id_produto === id_produto ? {...p, quantidade: novaQuantidade } : p
    )

    salvarCarrinho(carrinho)
}

// Remove
export function removerDoCarrinho(id_produto) {
    let carrinho = obterCarrinho()

    carrinho = carrinho.filter((p) => p.id_produto !== id_produto);

    salvarCarrinho(carrinho)
}

// Calcular total do carrinho
export function calcularTotal() {
    const carrinho = obterCarrinho()
    return carrinho.reduce (
        (acc, item) => acc + item.preco * item.quantidade,
        0
    );
}
