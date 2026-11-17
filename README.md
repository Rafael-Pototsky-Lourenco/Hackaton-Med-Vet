# Clínicas Positivo

Protótipo de gestão das clínicas-escola da Universidade Positivo, feito em HTML, CSS e JavaScript puro. A entrada é `index.html`, que permite escolher entre Veterinária, Odontologia, Fisioterapia, Nutrição e Psicologia.

> Ambiente de demonstração com dados fictícios e perfis simulados no navegador. O projeto não é um sistema oficialmente aprovado pela instituição e não deve receber dados reais.

## Como abrir

Extraia o ZIP inteiro e abra `index.html` no navegador. Mantenha os arquivos na mesma pasta para conservar os links entre páginas, estilos, scripts e logotipo.

Também é possível servir esta pasta com um servidor estático. Se houver Python instalado, execute na pasta do projeto:

```sh
python -m http.server 8000
```

Acesse <http://localhost:8000>. Não há build nem pacotes para instalar. Os ícones Lucide e a fonte Inter são carregados por CDN e precisam de acesso à internet.

## Estrutura dos arquivos

A organização segue a imagem de referência: todos os arquivos ficam na raiz, com o mesmo nome-base para o HTML, CSS e JavaScript de cada clínica.

```text
clinica-veterinaria/
├── README.md
├── ALTERACOES.md
├── app.js
├── clinicas-data.js
├── fisioterapia.css
├── fisioterapia.html
├── fisioterapia.js
├── index.css
├── index.html
├── manifest.webmanifest
├── med_vet-data.js
├── med_vet.css
├── med_vet.html
├── med_vet.js
├── nutricao.css
├── nutricao.html
├── nutricao.js
├── odonto.css
├── odonto.html
├── odonto.js
├── odonto_ext.js
├── odonto_ext2.js
├── odonto_ext3.js
├── odonto_ui.js
├── psicologia.css
├── psicologia.html
├── psicologia.js
└── universidade_logo.png
```

`med_vet-data.js` e `ALTERACOES.md` complementam os arquivos mostrados na imagem: o primeiro é necessário para a versão atual da Veterinária; o segundo registra as alterações anteriores e esta organização.

## Responsabilidade de cada parte

| Arquivo ou grupo | Responsabilidade |
| --- | --- |
| `index.html`, `index.css`, `app.js` | Seleção da clínica e navegação para sua página. |
| `<clinica>.html` | Estrutura da página e carregamento de estilos e scripts. |
| `<clinica>.css` | Estilos da clínica. `med_vet.css` também importa a base de `odonto.css`. |
| `<clinica>.js` | Módulos, perfis, dados fictícios, regras e interações da clínica. |
| `clinicas-data.js` | Serviço de armazenamento compartilhado, migração e consulta de possíveis duplicidades. |
| `med_vet-data.js` | Validação e normalização dos registros veterinários antes da persistência. |
| `odonto_ext.js`, `odonto_ext2.js`, `odonto_ext3.js` | Extensões dos fluxos odontológicos. |
| `odonto_ui.js` | Ajustes de interface da Odontologia, incluindo estilos incorporados ao script. |
| `manifest.webmanifest` | Nome, cores e página inicial da aplicação. |
| `universidade_logo.png` | Logotipo usado pela entrada e pelas cinco clínicas. |
| `ALTERACOES.md` | Histórico e detalhes das melhorias veterinárias. |

| Clínica | Arquivos principais |
| --- | --- |
| Veterinária | `med_vet.html`, `med_vet.css`, `med_vet.js` |
| Odontologia | `odonto.html`, `odonto.css`, `odonto.js` |
| Fisioterapia | `fisioterapia.html`, `fisioterapia.css`, `fisioterapia.js` |
| Nutrição | `nutricao.html`, `nutricao.css`, `nutricao.js` |
| Psicologia | `psicologia.html`, `psicologia.css`, `psicologia.js` |

## Ordem de carregamento

As tags `<script>` no final dos HTMLs já respeitam as dependências. Preserve esta sequência:

```text
Entrada:
  app.js

Veterinária:
  clinicas-data.js → med_vet-data.js → med_vet.js

Odontologia:
  clinicas-data.js → odonto.js → odonto_ext.js → odonto_ext2.js
                  → odonto_ext3.js → odonto_ui.js

Fisioterapia:
  clinicas-data.js → fisioterapia.js

Nutrição:
  clinicas-data.js → nutricao.js

Psicologia:
  clinicas-data.js → psicologia.js
```

As extensões odontológicas usam funções do script principal e de extensões anteriores. `odonto_ext2.js` disponibiliza `window.OdontoX` para os scripts seguintes. Alterar a ordem, adicionar `async` ou converter apenas parte dos scripts para módulos exige revisar essas dependências.

Na Veterinária, mantenha `odonto.css` junto de `med_vet.css`, pois a folha veterinária importa essa base visual.

## Dados e funcionalidades

Os scripts de cada clínica contêm os dados fictícios iniciais. O serviço `ClinicasData` salva os registros no `localStorage`, na chave compartilhada `clinicas-positivo:v2`, identificando a clínica de origem em cada registro.

As chaves antigas `clinicas-positivo:<clinica>` são migradas pelo serviço, que mantém uma cópia em `clinicas-positivo:backup:<clinica>` quando há dados antigos. A Veterinária acrescenta validação e normalização por meio de `MedVetData`.

Os dados ficam no navegador: não há sincronização entre dispositivos ou backend. Limpar o armazenamento do navegador remove os registros locais. Ao alternar entre abertura por arquivo e servidor local, o navegador pode apresentar armazenamentos diferentes.

As clínicas mantêm os módulos existentes de painel, recepção, agenda, pacientes, atendimentos, supervisão, financeiro e relatórios, além dos fluxos específicos de cada área. Na Veterinária, o botão **Ver dia de demonstração** permite consultar os agendamentos fictícios de **22/05/2026**.

## Personalização

- **Logotipo:** substitua `universidade_logo.png` na raiz, preservando o nome, ou atualize o `src` nos seis HTMLs.
- **Cores:** ajuste as variáveis CSS da clínica. Mudanças na base `odonto.css` também podem afetar a Veterinária.
- **Dados de exemplo:** altere `fixtures` no JavaScript principal da clínica.
- **Fluxos veterinários:** consulte também as regras de `med_vet-data.js` e os detalhes em `ALTERACOES.md`.

## Limitações

Os perfis e as permissões são simulados no navegador. Não há autenticação no servidor, integrações reais ou backup externo. A estrutura organizada conserva o comportamento da versão fornecida.
