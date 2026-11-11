<div align="center">

# 🏥 Clínicas Positivo

**Protótipo de gestão para as clínicas-escola da Universidade Positivo**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Sem dependências de build](https://img.shields.io/badge/build-nenhum-success)
![Dados fictícios](https://img.shields.io/badge/dados-100%25%20fict%C3%ADcios-orange)

</div>

> ⚠️ **Ambiente de demonstração.** Todos os registros são fictícios. Este projeto não é um sistema oficialmente aprovado pela instituição e **não deve receber dados reais**. As permissões são apenas simuladas no navegador.

## ✨ Visão geral

Uma única porta de entrada (`index.html`) permite escolher entre cinco clínicas. Cada uma tem sua própria interface, com módulos, perfis de acesso, dados de exemplo e documentação adaptados à sua área.

| Clínica | Página | Destaques |
|---|---|---|
| 🐾 Veterinária | `med_vet.html` | Tutores, pacientes, cirurgias, internamento com leitos, prescrições e estoque |
| 🦷 Odontológica | `odonto.html` | Exames e radiografias, procedimentos, materiais e estoque |
| 🏃 Fisioterapia | `fisioterapia.html` | Sessões, avaliações funcionais e evolução do paciente |
| 🍎 Nutrição | `nutricao.html` | Consultas, antropometria (peso e altura) e acompanhamento |
| 🧠 Psicologia | `psicologia.html` | Sessões, prontuários com acesso controlado e supervisão |

## 🧩 Funcionalidades

- **Painel inicial** com indicadores clicáveis que abrem listas já filtradas
- **Recepção e fila**, com registro manual de chegada
- **Agenda** com detecção de conflito de profissional e sala, reagendamento, cancelamento sem apagar histórico e bloqueio de recursos
- **Cadastro de pacientes** com alerta de possível duplicidade e abas de histórico
- **Atendimentos e prontuários**: rascunho, finalização, adendos rastreáveis e envio para supervisão
- **Supervisão acadêmica**: aluno envia, supervisor valida ou devolve
- **Orçamentos e financeiro**, com recebimento parcial e saldo
- **Relatórios** com exportação de resumo em CSV
- **Busca global** filtrada pelo perfil ativo
- **Perfis simulados** que mudam módulos e ações visíveis (matriz de permissões em *Configurações*)
- **Documentação técnica** navegável dentro da própria aplicação
- **Acessibilidade**: link de pular conteúdo, rótulos ARIA, foco visível e layout responsivo

## 🚀 Como executar

Não há build nem dependências para instalar.

```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>

# opção 1: abrir o index.html direto no navegador
# opção 2: servir localmente
python3 -m http.server 8000
# acesse http://localhost:8000
```

> Os ícones (Lucide) e a fonte (Inter) são carregados por CDN, então é necessário ter internet na primeira abertura.

## 🗂️ Estrutura

```
.
├── index.html            # seleção da clínica
├── index.css
├── app.js                # redireciona para a clínica escolhida
├── med_vet.{html,css,js}
├── odonto.{html,css,js}
├── fisioterapia.{html,css,js}
├── nutricao.{html,css,js}
├── psicologia.{html,css,js}
├── manifest.webmanifest  # metadados PWA
└── img/logo.png          # opcional
```

Cada clínica é independente: o HTML define o layout, o JS contém módulos, perfis, regras e dados fictícios, e o CSS traz apenas os estilos usados por aquela página.

## 💾 Armazenamento de dados

Os dados de exemplo ficam embutidos no JavaScript de cada clínica. Tudo o que você cria na demonstração é salvo no `localStorage` do navegador, com uma chave separada por clínica (`clinicas-positivo:<clínica>`).

- Limpar os dados do navegador apaga os registros criados.
- Os dados não são sincronizados entre dispositivos.
- Para recomeçar uma clínica, apague a chave dela no `localStorage`.

## 🎨 Personalização

- **Logotipo:** coloque o arquivo em `img/logo.png`. Se ele não existir, é exibido o texto "Universidade Positivo".
- **Cores:** as variáveis `--navy` e `--blue` no início de cada `.css` definem a cor principal da clínica.
- **Dados de exemplo:** edite o array `fixtures` no `.js` da clínica.
- **Nova clínica:** copie um trio `.html/.css/.js` existente, ajuste `modules`, `profiles` e `fixtures`, troque a chave `STORE_KEY` e adicione uma `<option>` no `index.html`.

## 🔒 Limitações

Esta interface **não** possui autenticação, autorização no servidor, integrações (WhatsApp, e-mail, laboratórios, pagamentos, emissão fiscal) nem backup. As regras de permissão rodam apenas no navegador e escondê-las na interface não protege dados. Qualquer uso real exigiria projeto de segurança, revisão clínica, jurídica e institucional.

## 🛠️ Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks)
- [Lucide](https://lucide.dev) para ícones
- [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

## 📄 Licença

Defina aqui a licença do projeto (por exemplo, MIT) ou o aviso de uso institucional.
