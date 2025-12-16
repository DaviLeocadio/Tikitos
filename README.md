# Tikitos – Sistema PDV + ERP

Tikitos é um sistema **PDV (Ponto de Venda) + ERP** desenvolvido como projeto final do último semestre do curso técnico de Desenvolvimento de Sistemas do **SENAI**.

O projeto foi pensado para **empresas com estrutura de matriz e filiais**, resolvendo um problema comum em sistemas de gestão: permitir que cada filial opere seus próprios dados, enquanto a matriz tem acesso a informações consolidadas para análise e tomada de decisão.

---

## 🎯 Objetivo do Projeto

Desenvolver um sistema capaz de:

* Operar múltiplas filiais de forma independente
* Consolidar dados de todas as filiais na matriz
* Controlar níveis de acesso e permissões por tipo de usuário
* Gerenciar vendas, estoque, caixa e relatórios

Tudo isso mantendo organização, segurança e coerência na estrutura do sistema.

---

## 🧩 Estrutura do Sistema

O sistema é dividido em dois grandes níveis:

### Matriz

* Visualização global de todas as filiais
* Relatórios consolidados
* Comparativos de desempenho entre lojas
* Controle administrativo completo

### Filial

* Operação restrita aos próprios dados
* Controle de vendas e caixa
* Gestão de estoque local
* Usuários com permissões específicas

Essa separação garante isolamento de dados sem perder a visão estratégica do negócio.

---

## 🔐 Controle de Usuários e Permissões

O sistema possui autenticação e autorização baseadas em níveis de acesso:

* Usuários de filial: acesso limitado à própria unidade
* Usuários administrativos: acesso ampliado
* Usuários de matriz: acesso global e consolidado

As permissões determinam quais rotas, dados e operações cada usuário pode executar.

---

## 🛠️ Tecnologias Utilizadas

### Back-end

* JavaScript
* Node.js
* Express
* APIs REST
* JWT (JSON Web Token)
* MySQL
* SQL
* Modelagem de banco de dados
* Arquitetura de back-end

### Front-end

* Next.js
* React
* Tailwind CSS
* shadcn/ui

### Ferramentas

* Git
* GitHub

---

## 👥 Organização do Time

* **Front-end & Branding:** Nicoly, Júlia
* **Back-end:** Bernardo Madureira, Davi, Wesley
* **Gerência de Projeto:** Bernardo Madureira

---

## 📦 Funcionalidades Principais

* Autenticação de usuários
* Controle de permissões por nível
* Cadastro e gerenciamento de produtos
* Controle de estoque por filial
* Registro de vendas (PDV)
* Controle de caixa
* Relatórios por filial e consolidados

---

## 🚀 Status do Projeto

✔️ Projeto finalizado para fins acadêmicos

O sistema foi entregue funcional e coerente com os requisitos propostos, servindo como base para aprendizado em arquitetura, controle de permissões e sistemas empresariais.

---

## 📄 Observações

Este projeto tem caráter educacional e foi desenvolvido como parte da formação técnica no SENAI, com foco em aprendizado prático e simulação de cenários reais do mercado.

---

## 🔗 Repositório

(Adicionar aqui links para back-end e/ou front-end, se separados)
