const express = require('express');

const router = express.Router();

// Adiciona um novo funcionário (exemplo: vendedor)
router.post('/funcionarios', (req, res) => {

    // Lógica para adicionar funcionário
    res.send('Funcionário adicionado');
});

// Visualiza todos os vendedores
router.get('/vendedores', (req, res) => {

    // Lógica para listar vendedores
    res.send('Lista de vendedores');
});

// Altera informações de um vendedor específico
router.put('/vendedores/:id', (req, res) => {

    // Lógica para editar vendedor
    res.send('Informações do vendedor atualizadas');
});

// Lista todos os produtos
router.get('/produtos', (req, res) => {

    // Lógica para listar produtos
    res.send('Lista de produtos');
});

// Informações específicas de um produto
router.get('/produtos/:id', (req, res) => {

    // Lógica para obter informações do produto
    res.send('Informações do produto');
});

// Edita estoque e/ou desconto de um produto (na filial)
router.put('/filial/produtos/:id', (req, res) => {

    // Lógica para editar estoque/desconto do produto na filial
    res.send('Estoque/desconto do produto atualizado');
});

// Informações de gastos da filial
router.get('/filial/gastos', (req, res) => {

    // Lógica para listar gastos da filial
    res.send('Informações de gastos da filial');
});

// Adiciona um gasto
router.post('/filial/gastos', (req, res) => {

    // Lógica para adicionar gasto
    res.send('Gasto adicionado');
});

// Edita informações de um gasto (pago, pendente, etc)
router.put('/filial/gastos/:id', (req, res) => {

    // Lógica para editar gasto
    res.send('Informações do gasto atualizadas');
});

// Exclui um gasto
router.delete('/filial/gastos/:id', (req, res) => {

    // Lógica para excluir gasto
    res.send('Gasto excluído');
});

// Visualiza valores obtidos do fluxo de caixa de cada dia
router.get('/fluxo-caixa/diario', (req, res) => {

    // Lógica para listar valores do fluxo de caixa diário
    res.send('Valores do fluxo de caixa diário');
});

// Resumo de um caixa específico (vendas, pagamentos, saldo)
router.get('/caixa/:id/resumo', (req, res) => {

    // Lógica para obter resumo do caixa
    res.send('Resumo do caixa');
});

// Relatório financeiro com parâmetros de consulta
router.get('/relatorio-financeiro', (req, res) => {

    // Lógica para gerar relatório financeiro com filtros
    res.send('Relatório financeiro');
});

// Lista vendas de afiliados (filtros: data, vendedor, forma de pagamento)
router.get('/afiliados/vendas', (req, res) => {

    // Lógica para listar vendas de afiliados com filtros
    res.send('Vendas de afiliados');
});

// Lista produtos com estoque abaixo do mínimo (alerta)
router.get('/produtos/estoque-baixo', (req, res) => {

    // Lógica para listar produtos com estoque baixo
    res.send('Produtos com estoque abaixo do mínimo');
});

module.exports = router;