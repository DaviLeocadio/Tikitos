"use client";

import { aparecerToast } from "./toast";

const CHAVE = "produtos";

// Função segura para checar se está no browser
function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// Lê o carrinho
export function obterCarrinho() {
  if (!isBrowser()) return [];

  const item = localStorage.getItem(CHAVE);
  if (!item) return [];

  try {
    return JSON.parse(item);
  } catch {
    return [];
  }
}

// Salva o carrinho
function salvarCarrinho(carrinho) {
  if (!isBrowser()) return;

  localStorage.setItem(CHAVE, JSON.stringify(carrinho));
  localStorage.setItem("carrinhoAtualizado", Date.now());
  window.dispatchEvent(new Event("carrinhoAtualizado"));
}

// Adicionar produto
export function adicionarAoCarrinho(produto) {
  if (!isBrowser()) return;

  let carrinho = obterCarrinho();
  const index = carrinho.findIndex((p) => p.id_produto === produto.id_produto);

  // Se já existe no carrinho
  if (index !== -1) {
    const qtdAtual = carrinho[index].quantidade;

    // Não deixar ultrapassar o estoque do produto
    if (qtdAtual >= produto.estoque) return;

    carrinho[index].quantidade += 1;
  } else {
    // Se o estoque for 0, não deixa adicionar
    if (produto.estoque <= 0 || !produto.estoque) return;

    carrinho.push({ ...produto, quantidade: 1 });
  }

  localStorage.setItem("ultimoProdutoAdicionado", produto.id_produto);
  salvarCarrinho(carrinho);
}

// Atualizar quantidade
export function atualizarQuantidade(id_produto, novaQuantidade) {
  if (!isBrowser()) return;

  let carrinho = obterCarrinho();
  const produto = carrinho.find((p) => p.id_produto === id_produto);

  if (!produto) return;

  // Impedir quantidade maior que o estoque
  if (novaQuantidade > produto.estoque) return aparecerToast(`Estoque máximo disponível de ${produto.nome}: ${produto.estoque}`);

  // Limite máximo opcional (caso queira manter o 10)
  if (novaQuantidade > 10) return;

  carrinho = carrinho.map((p) =>
    p.id_produto === id_produto ? { ...p, quantidade: novaQuantidade } : p
  );

  localStorage.setItem("ultimoProdutoAdicionado", id_produto);
  salvarCarrinho(carrinho);
}

// Remover produto
export function removerDoCarrinho(id_produto) {
  if (!isBrowser()) return;

  let carrinho = obterCarrinho();
  carrinho = carrinho.filter((p) => p.id_produto !== id_produto);

  localStorage.setItem("item_excluido", id_produto);

  salvarCarrinho(carrinho);
}

// Limpar
export function limparCarrinho() {
  if (!isBrowser()) return;
  salvarCarrinho([]);
}

// Total
export function calcularTotal() {
  const carrinho = obterCarrinho();
  return carrinho.reduce(
    (acc, item) =>
      acc +
      (Number(item.desconto) === 0
        ? item.preco * item.quantidade
        : item.precoComDesconto * item.quantidade),
    0
  );
}

// Quantidade total
export function obterQuantidade() {
  const carrinho = obterCarrinho();
  return carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

// Desfazer remoção
export function voltarCarrinho(produtos) {
  if (!isBrowser()) return;

  const idProdutoExcluido = localStorage.getItem("item_excluido");
  if (!idProdutoExcluido) return;

  let carrinho = obterCarrinho();
  const produtoExcluido = produtos.find(
    (p) => parseInt(p.id_produto) === parseInt(idProdutoExcluido)
  );

  if (!produtoExcluido) return;

  // Não restaurar se o estoque for zero
  if (produtoExcluido.estoque <= 0) return;

  carrinho.push({ ...produtoExcluido, quantidade: 1 });

  salvarCarrinho(carrinho);
  localStorage.removeItem("item_excluido");
}
