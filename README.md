# 🧸 Tikitos - ERP & PDV para Rede de Lojas de Brinquedos

O **Tikitos** é um sistema integrado de gestão (ERP) e ponto de venda (PDV) desenvolvido para o segmento de lojas de brinquedos. O sistema foi projetado para operar em uma estrutura de **Matriz e Filiais**, garantindo controle centralizado para administradores e autonomia operacional para gerentes de loja e vendedores.

---

## 🚀 Funcionalidades

### Gestão Administrativa (Matriz)

* **Controle Multi-loja:** Cadastro e monitoramento de unidades (Matriz e Filiais).
* **Gestão de Usuários:** Controle rigoroso de permissões via RBAC (Role-Based Access Control).
* **Relatórios Consolidados:** Visão global de vendas, estoque e financeiro da rede.
* **Catálogo Centralizado:** Cadastro de produtos, fornecedores e categorias.

### Operação de Loja (Filial)

* **PDV Completo:**  Abertura e fechamento de caixa.  
   * Leitura de código de barras.  
   * Gestão de carrinho e pagamentos (Pix, Cartão).
* **Estoque Local:** Controle de entradas e saídas integrado por unidade.
* **Financeiro:** Fluxo de caixa, controle de despesas e relatórios de fechamento diário.

---

## 🔐 Perfis e Permissões

| **Perfil**         | **Escopo** | **Acessos Principais**                                                                   |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------- |
| **Administrador**  | Matriz     | Gestão de todas as lojas, usuários, relatórios globais e configurações de sistema.       |
| **Gerente**        | Filial     | Visão completa da sua loja, gestão de estoque local e relatórios financeiros da unidade. |
| **Vendedor/Caixa** | PDV        | Operação de vendas, abertura/fechamento de caixa e consulta de produtos.                 |

---

## 🛠️ Tecnologias Utilizadas

### Backend

* **Node.js** com **Express**
* **MySQL:** Banco de dados relacional.
* **Pool de Conexões:** Otimização de requisições ao BD.
* **JWT (JSON Web Token):** Autenticação e sessão.
* **bcrypt:** Criptografia de senhas.
* **API REST:** Comunicação padronizada.

### Frontend

* **Next.js (App Router):** Framework React com renderização otimizada.
* **Tailwind CSS:** Estilização utilitária.
* **shadcn/ui:** Componentes de interface de alta qualidade.
* **Rotas Protegidas:** Middlewares de verificação de perfil de usuário.

---

## 📂 Estrutura de Pastas (Frontend)

O frontend utiliza a estrutura de diretórios do Next.js App Router, segmentando as interfaces por perfil de acesso para facilitar a manutenção e segurança:


```
src/
├── app/
│   ├── login/           # Fluxo de definição de senha
│   ├── admin/           # Dashboard e funcionalidades do Administrador (Matriz)
│   ├── gerente/         # Funcionalidades de gestão da Filial
│   ├── vendedor/        # Interface de PDV e vendas
│   ├── layout.jsx       # Root layout
│   └── page.jsx         # Página inicial de login
├── components/          # Componentes reutilizáveis (UI)
├── hooks/               # Hooks customizados
├── services/            # Chamadas à API (Axios/Fetch)
└── utils/               # Funções utilitárias e máscaras

```

---

## ⚙️ Instalação e Execução

### Pré-requisitos

* Node.js (LTS)
* MySQL 8.x
* Git

### 1\. Configuração do Banco de Dados

Crie um banco de dados MySQL e execute o script de migração (disponível em `/backend/database/schema.sql`).

### 2\. Backend

```
cd backend
npm install
# Configure o .env conforme o modelo `env.example`
npm run dev 
```

### 3\. Frontend

```
cd frontend
npm install
npm run dev
```

---

## 📌 Status do Projeto

🚀 **Concluído**

Atualmente, o sistema encontra-se concluído, apresentado e aprovado como TCC do curso Técnico em Desenvolvimento de Sistemas do SENAI.

---

## 👥 Integrantes

* **Bernardo de Souza Madureira** \- [bernasdev](https://github.com/bernasdev)
* **Davi Leocádio Ramos** \- [DaviLeocadio](https://github.com/DaviLeocadio)
* **Júlia Guizzardi Sanches** \- [juliaGuizzardi](https://github.com/juliaGuizzardi)
* **Nicoly Carine Martinelli Beja** \- [niimartinelli](https://github.com/niimartinelli)
* **Wesley Daniel Correia** \- [WesleyDanielCorreia](https://github.com/WesleyDanielCorreia)



