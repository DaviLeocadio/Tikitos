import express from 'express';
const Gasto = require('../models/Gasto.js');
// Listar todos os gastos
const listarGastosController = async (req, res) => {
    try {
        const gastos = await Gasto.find();
        res.status(200).json(gastos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar gastos', error: error.message });
    }
};

// Adicionar novo gasto
const adicionarGastoController = async (req, res) => {
    try {
        const novoGasto = new Gasto(req.body);
        const gastoSalvo = await novoGasto.save();
        res.status(201).json(gastoSalvo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar gasto', error: error.message });
    }
};

// Atualizar gasto existente
const atualizarGastoController = async (req, res) => {
    try {
        const gastoAtualizado = await Gasto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!gastoAtualizado) {
            return res.status(404).json({ message: 'Gasto não encontrado' });
        }
        res.status(200).json(gastoAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar gasto', error: error.message });
    }
};

// Excluir gasto
const excluirGastoController = async (req, res) => {
    try {
        const gastoExcluido = await Gasto.findByIdAndDelete(req.params.id);
        if (!gastoExcluido) {
            return res.status(404).json({ message: 'Gasto não encontrado' });
        }
        res.status(200).json({ message: 'Gasto excluído com sucesso' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao excluir gasto', error: error.message });
    }
};

exports = {
    listarGastosController,
    adicionarGastoController,
    atualizarGastoController,
    excluirGastoController
};