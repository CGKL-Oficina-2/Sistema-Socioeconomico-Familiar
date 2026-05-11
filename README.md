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

## 🧩 4. Fluxo Geral de Operação

### 🔐 Autenticação
- Usuários autorizados realizam login no sistema  
- O acesso é controlado por níveis de permissão (ex: administrador, voluntário)  

---

### 🏫 Cadastro de Escolas
- Administradores podem cadastrar, editar, consultar e excluir escolas  
- As escolas servem como referência para organização dos dados coletados  

---

### 📝 Preenchimento do Formulário
- O formulário socioeconômico é disponibilizado ao usuário  
- O preenchimento pode ser:
  - Anônimo  
  - Identificado  
- Os dados são validados antes do envio  

---

### 💾 Persistência dos Dados
- As respostas são armazenadas no banco de dados  
- Garantindo integridade e consistência das informações  

---

### 🔍 Gerenciamento e Consulta
- Usuários autorizados podem visualizar os dados coletados  
- O sistema permite aplicação de filtros por critérios específicos (ex: escola, renda)  

---

### 📊 Análise de Dados
- O sistema processa os dados e apresenta:
  - Estatísticas  
  - Indicadores  
  - Visualizações gráficas  

---

### 📤 Exportação
- Os dados podem ser exportados em formatos estruturados (CSV/Excel)  
- Facilitando análises externas  

---

### 🧾 Auditoria e Controle
- O sistema registra operações relevantes (logs)  
- Garantindo rastreabilidade e controle de uso  

---

## 📋 5. Requisitos

### 5.1 Requisitos Funcionais

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

### 5.2 Requisitos Não Funcionais

| ID    | Requisito Não Funcional                                   | Prioridade |
|-------|-----------------------------------------------------------|------------|
| RNF01 | Sistema acessível via navegador web;                      | 🔴 Alta    |
| RNF02 | Interface simples e intuitiva;                            | 🟡 Média   |
| RNF03 | Garantia de segurança e confidencialidade dos dados;      | 🔴 Alta    |
| RNF04 | Suporte ao anonimato;                                     | 🟡 Média   |
| RNF05 | Tempo de resposta adequado;                               | 🟡 Média   |
| RNF06 | Arquitetura organizada em camadas;                        | 🔴 Alta    |
| RNF07 | Código versionado e documentado;                          | 🔴 Alta    |
| RNF08 | Implementação de testes automatizados;                    | 🔴 Alta    |

---

## 🏗️ 6. Arquitetura do Sistema

### 6.1 Visão Geral

O sistema será desenvolvido utilizando arquitetura em camadas, separando responsabilidades entre interface, lógica de negócio e persistência de dados.

---

### 6.2 Diagrama de Arquitetura

```bash
[ Front-End ] ---> [ Back-End API ] ---> [ Banco de Dados ]
(Substituir por diagrama gráfico posteriormente)
```

### 6.3 Padrões Arquiteturais

- Arquitetura em Camadas  
- Padrão REST  
- MVC (Model-View-Controller)  

---

## 🗄️ 7. Modelo de Dados

### 7.1 Entidades
- Família  
- Escola  

### 7.2 Relacionamentos
- Uma família pode estar associada a uma escola  

### 7.3 Diagrama ER (DER)

*(Inserir diagrama ER aqui)*

---

## 💻 8. Tecnologias Utilizadas

### Front-End

React.js
HTML5
CSS3
Tailwind CSS (avaliar)

### Back-End
- Node.js com Express  

### Banco de Dados
- PostgreSQL  ou MongoDB

### Ferramentas
- GitHub
- GitHub Projects  

---

## 🧪 9. Estratégia de Testes

### 9.1 Tipos de Teste
- Testes Unitários  
- Testes de Integração  
- Testes End-to-End  

### 9.2 Ferramentas
- Jest  
- Supertest  

### 9.3 Cobertura de Testes
- Meta mínima de 70% de cobertura  

---

## 📊 10. Gerenciamento do Projeto

### 10.1 Metodologia
- Scrum (2 Sprints)  

### 10.2 Organização do Backlog
- Funcionalidades organizadas como Issues no GitHub  

### 10.3 Kanban
*(https://github.com/orgs/CGKL-Oficina-2/projects/1)*

---

## 📅 11. Cronograma Detalhado


---

## 🗂️ 12. Estrutura do Repositório

```bash
project-root/
│
├── frontend/      # Interface do usuário
├── backend/       # API e regras de negócio
├── database/      # Scripts e modelos de dados
├── tests/         # Testes automatizados
├── docs/          # Documentação adicional
└── README.md
```
---

## ⚙️ 13. Configuração do Ambiente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar o projeto
npm start
```
---

## 🚀 14. Execução do Projeto

```bash
# Executar backend
npm run dev

# Executar frontend
npm start
```
---

## 📌 15. Considerações Finais

Este projeto integra conhecimentos adquiridos ao longo do curso de Engenharia de Software, aplicando práticas modernas de desenvolvimento em um contexto real de impacto social.

A proposta busca não apenas atender aos requisitos acadêmicos, mas também contribuir efetivamente para a melhoria das ações do projeto de extensão ELLP.
