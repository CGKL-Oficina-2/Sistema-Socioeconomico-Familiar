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

## 🧩 4. Escopo do Sistema

### ✅ O sistema DEVE:
- Permitir o cadastro de dados socioeconômicos das famílias;
- Possibilitar o preenchimento anônimo dos dados;
- Realizar o cadastro de escolas participantes;
- Permitir associação entre famílias e escolas;
- Disponibilizar visualização de dados agregados;
- Gerar relatórios para análise.

### ❌ O sistema NÃO deve:
- Armazenar dados pessoais sensíveis identificáveis;
- Integrar com sistemas externos nesta versão;
- Implementar autenticação complexa fora do escopo inicial.

---

## 📋 5. Requisitos

### 5.1 Requisitos Funcionais

- **RF01**: Permitir cadastro socioeconômico de famílias;
- **RF02**: Permitir cadastro de escolas;
- **RF03**: Associar famílias a escolas (opcional);
- **RF04**: Exibir dados em formato de dashboard;
- **RF05**: Exportar relatórios em formatos estruturados.

---

### 5.2 Requisitos Não Funcionais

- **RNF01**: Interface responsiva;
- **RNF02**: Garantia de segurança dos dados;
- **RNF03**: Alta disponibilidade;
- **RNF04**: Facilidade de uso para usuários leigos;
- **RNF05**: Escalabilidade do sistema.

---

### 5.3 Regras de Negócio

- **RN01**: O preenchimento do formulário pode ser anônimo;
- **RN02**: A associação com escola é opcional;
- **RN03**: Os dados devem ser utilizados apenas de forma agregada;
- **RN04**: Não é permitido armazenar dados sensíveis identificáveis;
- **RN05**: Escolas devem estar previamente cadastradas.

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
- HTML  
- CSS  
- JavaScript  
- *(Opcional: React)*  

### Back-End
- Node.js com Express  

### Banco de Dados
- PostgreSQL  

### Ferramentas
- GitHub  
- Postman  
- Kanban  

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
*(Inserir link do quadro Kanban)*

---

## 📅 11. Cronograma Detalhado

| Sprint   | Atividades                                   | Entregas          |
|----------|----------------------------------------------|-------------------|
| Sprint 1 | Estrutura inicial, cadastro e persistência   | API funcional     |
| Sprint 2 | Dashboard, testes e refinamentos             | Sistema completo  |

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

## 🔄 15. Estratégia de Versionamento

- **main** → versão estável  
- **develop** → integração de funcionalidades  
- **feature/** → desenvolvimento de novas funcionalidades  

### Padrão de commits

```text
feat: nova funcionalidade
fix: correção de bug
docs: documentação
```
---

## 📎 16. Evidências do Planejamento

- Issues documentadas no GitHub  
- Casos de teste definidos  
- Diagramas de arquitetura  
- Modelo de dados (DER)  

---

## 📌 17. Considerações Finais

Este projeto integra conhecimentos adquiridos ao longo do curso de Engenharia de Software, aplicando práticas modernas de desenvolvimento em um contexto real de impacto social.

A proposta busca não apenas atender aos requisitos acadêmicos, mas também contribuir efetivamente para a melhoria das ações do projeto de extensão ELLP.
