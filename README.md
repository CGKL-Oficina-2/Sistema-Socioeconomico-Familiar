# 📄 Sistema Socioeconômico das Famílias
## Trabalho da matéria *Oficina de Integração 2*  
### Projeto de Extensão ELLP  

---

## 📌 1. Descrição do Projeto

Este projeto tem como objetivo o desenvolvimento de um sistema web para **coleta, armazenamento e análise de dados socioeconômicos** das famílias atendidas pelo projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação).

A solução proposta permitirá a obtenção de dados estruturados que subsidiem decisões estratégicas, melhoria das oficinas e ampliação do impacto social do projeto.

---

## 🎯 2. Objetivos

### 2.1 Objetivo Geral
Desenvolver um sistema que possibilite o levantamento socioeconômico de forma **segura, anônima e estruturada**.

### 2.2 Objetivos Específicos
- Permitir o cadastro de dados socioeconômicos das famílias;
- Garantir anonimato no processo de coleta;
- Possibilitar o cadastro de escolas da região;
- Relacionar famílias às escolas;
- Disponibilizar visualização e análise de dados;
- Gerar relatórios para apoio à tomada de decisão.

---

## 👥 3. Equipe

| Nome | Função |
|------|--------|
| Carlos Hereman | Desenvolvedor |
| Gabriel Sarti | Desenvolvedor |
| Kauan Pedreira | Desenvolvedor |
| Luccas Hessel | Desenvolvedor |

---

## 🧩 4. Requisitos Funcionais

### RF01 – Cadastro Socioeconômico
- Permitir preenchimento de formulário pelas famílias;
- Possibilidade de preenchimento anônimo;
- Coleta de dados como:
  - Renda familiar;
  - Número de moradores;
  - Escolaridade;
  - Acesso à internet;
  - Tipo de moradia.

### RF02 – Cadastro de Escolas
- Registrar escolas participantes;
- Armazenar nome, tipo e localização.

### RF03 – Associação Família-Escola
- Permitir vincular famílias a escolas (opcional).

### RF04 – Visualização de Dados
- Exibir dados agregados;
- Filtros por escola, renda e outros critérios.

### RF05 – Geração de Relatórios
- Exportação de dados em formatos como CSV ou PDF.

---

## ⚙️ 5. Requisitos Não Funcionais

- RNF01: Interface simples e acessível;
- RNF02: Sistema responsivo (mobile e desktop);
- RNF03: Garantia de anonimato;
- RNF04: Segurança dos dados (criptografia);
- RNF05: Alta disponibilidade;
- RNF06: Escalabilidade.

---

## 🏗️ 6. Arquitetura do Sistema

O sistema seguirá uma arquitetura em camadas:

- **Front-End (Apresentação)**  
  Responsável pela interface com o usuário.

- **Back-End (Aplicação)**  
  Responsável pela lógica de negócio e APIs.

- **Banco de Dados (Persistência)**  
  Responsável pelo armazenamento dos dados.

### 📊 Diagrama de Arquitetura
*(Inserir imagem ou link do diagrama aqui)*

---

## 🧪 7. Estratégia de Testes

Serão adotadas as seguintes abordagens:

- Testes Unitários: validação de funções e serviços;
- Testes de Integração: comunicação entre API e banco de dados;
- Testes End-to-End: simulação do fluxo completo do usuário;
- Cobertura de testes como métrica de qualidade.

---

## 💻 8. Tecnologias Utilizadas

### Front-End
- HTML, CSS, JavaScript
- (Opcional: React ou Vue)

### Back-End
- Node.js com Express *(ou Java com Spring Boot)*

### Banco de Dados
- PostgreSQL *(ou MongoDB)*

### Ferramentas
- GitHub (versionamento)
- Kanban (gerenciamento de tarefas)
- Postman (testes de API)

---
## 🗂️ 9. Estrutura do Projeto

/project-root
│
├── frontend/
├── backend/
├── database/
├── docs/
├── tests/
├── README.md
└── package.json


---

## 📅 10. Cronograma

| Etapa | Descrição | Período |
|------|----------|--------|
| Planejamento | Definição de requisitos e arquitetura | Semana 1–2 |
| Sprint 1 | Funcionalidades básicas | Semana 3–5 |
| Sprint 2 | Funcionalidades avançadas e testes | Semana 6–8 |
| Revisão | Ajustes finais | Semana 9 |

---

## 🔄 11. Metodologia de Desenvolvimento

O projeto será desenvolvido utilizando a metodologia **Scrum**, com:

- 2 Sprints;
- Backlog definido na fase de planejamento;
- Uso de issues no GitHub;
- Quadro Kanban para acompanhamento.

---

## 📌 12. Backlog Inicial (Exemplo)

- Criar estrutura do projeto
- Implementar API de cadastro de famílias
- Implementar cadastro de escolas
- Criar interface do formulário
- Implementar persistência de dados
- Criar dashboard básico
- Implementar testes automatizados

---

## 🚀 13. Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- Banco de dados configurado

### Passos

```bash
# Clonar repositório
git clone <url>

# Acessar pasta
cd projeto

# Instalar dependências
npm install

# Rodar servidor
npm start
## 🗂️ 9. Estrutura do Projeto
