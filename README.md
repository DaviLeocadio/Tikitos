Tikitos — Sistema PDV + ERP (Matriz & Filiais)
📌 Sumário

Visão Geral

Funcionalidades Principais

Tecnologias Utilizadas

Estrutura do Sistema

Configuração do Ambiente (Setup)

Autores e Agradecimentos

Visão Geral

O Tikitos é um sistema PDV + ERP desenvolvido como projeto final do curso técnico de Desenvolvimento de Sistemas do SENAI, com foco em um cenário realista de empresas que operam com matriz e múltiplas filiais.

A proposta do sistema não foi criar apenas uma interface “bonita”, mas sim resolver um problema clássico de gestão:
garantir que cada filial opere seus próprios dados enquanto a matriz tenha uma visão consolidada e estratégica do negócio.

Funcionalidades Principais

Operação de PDV por filial (vendas, caixa e estoque)

Gestão de produtos, usuários e funcionários

Controle de permissões e níveis de acesso

Separação de escopo entre filial e matriz

Dashboard com visão global para usuários da matriz

APIs REST com autenticação e autorização via JWT

Tecnologias Utilizadas
<div align="left"> <img src="https://skillicons.dev/icons?i=js,nodejs,express,mysql,react,nextjs,tailwind,git,github" /> </div>

Stack principal:

JavaScript

Node.js

Express

MySQL

APIs REST

JWT (autenticação e permissões)

React

Next.js

TailwindCSS

shadcn/ui

Git & GitHub

Estrutura do Sistema

O sistema foi projetado com uma hierarquia clara de acesso.

Usuários de filiais têm acesso apenas aos dados da própria loja, como vendas, estoque, caixa e funcionários.
Usuários da matriz possuem acesso global, podendo visualizar dados consolidados, comparar filiais e acompanhar indicadores gerais do negócio.

O controle de permissões e o escopo dos dados não são detalhes de implementação, mas parte central da solução proposta.

Configuração do Ambiente (Setup)
1️⃣ Banco de Dados
CREATE DATABASE tikitos;
USE tikitos;


Importe o dump mais recente do banco de dados na base tikitos.

Caso necessário, ajuste as credenciais de conexão em:

/backend/config/database.js

2️⃣ Back-end
cd backend
npm install
npm run dev


O comando npm run dev utiliza nodemon, permitindo atualização automática do servidor durante o desenvolvimento.

3️⃣ Front-end

Em um novo terminal:

cd frontend
npm install
npm run dev


Ou, para ambiente de produção:

npm run build
npm start

Autores e Agradecimentos

Projeto desenvolvido por alunos do curso técnico de Desenvolvimento de Sistemas do SENAI.

Agradecimento especial aos professores William e Rodrigo, pelo suporte técnico e orientação ao longo de todo o curso.
