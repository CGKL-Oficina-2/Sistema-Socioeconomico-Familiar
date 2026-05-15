# Sistema Socioeconômico das Famílias 📄 
### Trabalho da matéria *Oficina de Integração 2* - Projeto de Extensão ELLP  
---

## 📌 1. Introdução

O presente projeto tem como objetivo o desenvolvimento de um sistema voltado ao levantamento socioeconômico das famílias atendidas pelo projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação) da UTFPR, Coordenado pelo Prof. Antonio Carlos Fernandes da Silva.

A proposta busca estruturar a coleta de dados relevantes, permitindo análises consistentes que contribuam para a melhoria das ações extensionistas e tomada de decisão baseada em dados.

---

## 🎯 2. Objetivo do Projeto

Desenvolver uma solução computacional capaz de coletar, armazenar e analisar informações socioeconômicas de forma segura, estruturada e, quando necessário, anônima.

---

## 👥 3. Equipe

| Nome | Papel | Responsabilidade |
|------|--------|----------------|
| Carlos Hereman | Desenvolvedor | Back-End / API |
| Gabriel Sarti | Desenvolvedor | Front-End |
| Kauan Pedreira | Desenvolvedor | Banco de Dados |
| Luccas Hessel | Desenvolvedor | Testes e Qualidade |

---

## 📋 4. Requisitos

### 4.1 Requisitos Funcionais

| ID   | Requisito Funcional                                                                 | Prioridade |
|------|-------------------------------------------------------------------------------------|------------|
| RF01 | Permitir o cadastro, edição, exclusão e consulta de escolas;                      | 🔴 Alta    |
| RF02 | Permitir que o usuário selecione uma escola ao preencher o formulário;            | 🔴 Alta    |
| RF03 | Disponibilizar formulário socioeconômico estruturado por seções;                  | 🔴 Alta    |
| RF04 | Permitir preenchimento anônimo ou identificado;                                    | 🔴 Alta   |
| RF05 | Validar campos obrigatórios e tipos de dados (ex: renda numérica);                | 🔴 Alta    |
| RF06 | Permitir visualização dos dados por usuários autorizados;                          | 🔴 Alta    |
| RF07 | Permitir filtragem por escola, renda, localização e outros critérios;              | 🟡 Média   |
| RF08 | Gerar gráficos (ex: distribuição de renda, acesso à internet);                     | 🟡 Média   |
| RF9 | Gerar relatórios consolidados;                                                     | 🟢 Baixa   |
| RF10 | Exportar dados em formato CSV ou Excel;                                            | 🟢 Baixa   |
| RF11 | Implementar autenticação de usuários;                                              | 🔴 Alta    |
| RF12 | Definir níveis de acesso: Administrador: acesso total; Voluntário: visualização e apoio na coleta | 🟡 Média   |
| RF13 | Registrar ações básicas no sistema (log de operações).                             | 🟢 Baixa   |

---

## 🏗️ 5. Arquitetura do Sistema

### 5.1 Visão Geral

O sistema utiliza arquitetura em camadas, separando responsabilidades entre:
- Interface do usuário;
- Regras de negócio;
- Persistência de dados.

---

### 5.2 Diagrama de Arquitetura

```bash
[ Front-End ] ---> [ Back-End API ] ---> [ Banco de Dados ]
```

### 5.3 Padrões Arquiteturais

- Arquitetura em Camadas  
- Padrão REST  
- MVC (Model-View-Controller)  

---

## 🗄️ 6. Modelo de Dados

### 6.1 Entidades
- Usuário;
- Escola;
- Formulário Socioeconômico.

### 6.2 Relacionamentos
- Uma escola pode possuir vários formulários associados;
- Um formulário pode estar associado a uma escola.
---

## 💻 7. Tecnologias Utilizadas

### Front-End

- React.js;
- Vite;
- HTML5;
- CSS3;
- Tailwind CSS.

---

## Back-End

- Node.js;
- Express.js.

---

## Banco de Dados

- PostgreSQL;
- Prisma ORM.

---

## Ferramentas

- GitHub;
- GitHub Projects;
- Postman.

---

## 🧪 8. Estratégia de Testes

### 8.1 Tipos de Teste

- Testes Unitários;
- Testes de Integração. 

---

### 8.2 Ferramentas

- Jest;
- Supertest.

---

## 📊 9. Gerenciamento do Projeto

### 9.1 Metodologia

- Scrum;
- Organização por Sprints.  

---

### 9.2 Organização do Backlog

- Funcionalidades organizadas como Issues no GitHub  

---

### 9.3 Kanban
*(https://github.com/orgs/CGKL-Oficina-2/projects/1)*

---

# 📅 10. Planejamento da Sprint 1

## 📌 Entrega da Sprint 1 — 15/05

### Funcionalidades previstas:
- Autenticação de usuários;
- Cadastro e gerenciamento de escolas;
- Formulário socioeconômico;
- Integração com banco de dados;
- Estrutura inicial do sistema funcional.

# 📅 Cronograma Semanal de Desenvolvimento

## 📌 Semana 1 — Estudos e Planejamento (13/04 a 26/04)

- Levantamento inicial dos requisitos do sistema;
- Estudos sobre React, Node.js, Prisma e PostgreSQL;
- Pesquisa sobre arquitetura MVC e APIs REST;
- Organização do repositório GitHub e Kanban;
- Estudos sobre autenticação JWT e testes automatizados.

---

## 🚧 Semana 2 — Estruturação do Projeto (27/04 a 03/05)

- Configuração inicial do frontend e backend;
- Configuração do banco de dados PostgreSQL;
- Estruturação do Prisma ORM;
- Definição das entidades do sistema;
- Organização das branches e padronização de commits.

---

## 🔐 Semana 3 — Desenvolvimento da Sprint 1 (04/05 a 15/05)

- Implementação da autenticação JWT;
- Desenvolvimento da tela de login;
- Criação do CRUD de escolas;
- Desenvolvimento do formulário socioeconômico;
- Integração frontend/backend;
- Persistência dos dados no banco;
- Validações básicas dos formulários;
- Ajustes visuais iniciais;
- Testes básicos do sistema;
- Revisão da documentação.

---

## 🗂️ 11. Estrutura do Repositório

```bash
SISTEMA-SOCIOECONOMICO-FAMILIAR/
│
├── backend/
│   ├── prisma/          
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── tests/
│   │   
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│
├── .gitignore
└── README.md
```
---

# ⚙️ 12. Configuração do Ambiente

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---


# 📌 13. Considerações Finais

O projeto busca aplicar conceitos de Engenharia de Software em um contexto real de impacto social, utilizando práticas modernas de desenvolvimento web, versionamento, organização em camadas e integração entre frontend, backend e banco de dados.

A Sprint 1 possui foco na construção da base estrutural do sistema, garantindo uma arquitetura sólida para evolução futura das funcionalidades.