# Clínicas Positivo — demonstração

Versão cumulativa das etapas 1 a 6, incluindo a revisão do cadastro único. A entrega atual está descrita em [LEIA-ME-ETAPA-6.md](docs/guias/LEIA-ME-ETAPA-6.md). As instruções e relatórios das etapas anteriores permanecem como histórico; as regras mais recentes prevalecem.

## Executar

Sirva esta pasta no servidor local habitual e abra index.html. Preserve protocolo, host e porta ao atualizar, para manter os dados do navegador. Não há build. Fontes e ícones usam as referências externas do projeto original; o odontograma é desenhado localmente em SVG.

Rotas: index.html, odonto.html, fisioterapia.html, psicologia.html, nutricao.html e med_vet.html. A rota veterinária continua independente e sem alterações.

## Funcionalidades integradas

- Cadastro único, identificadores estáveis, vínculos por clínica, busca, homônimos e inativação.
- Contas fictícias com ações por clínica e atribuições ao caso/atendimento.
- Agenda, fila, conflitos, bloqueios, séries recorrentes e encaminhamentos entre clínicas.
- Prontuário versionado, revisão do supervisor vinculado e correções de uso único com confirmação fictícia.
- Odontologia com anamnese, odontograma permanente, achados por dente/face, plano e evolução por atendimento.
- Orçamentos odontológicos por item, cobrança dos aprovados e recebimentos com os vínculos preservados.
- Visualizações de impressão de orçamento, odontograma e modelos de documentos.

## Organização

- assets/css/ — estilos
- assets/images/ — imagens
- assets/js/core/ — dados e autorização
- assets/js/shared/ — componentes compartilhados
- assets/js/clinics/ — módulos das clínicas
- docs/ — guias e validações
- tests/ — regressão e suporte compartilhado
- scripts/ — verificações de integridade

Veja [Estrutura e manutenção](docs/ESTRUTURA.md). As páginas HTML continuam na raiz.

## Dados e permissões

Dados fictícios em localStorage. A chave principal é clinicas-positivo:shared:v1. Migrações preservam snapshots anteriores; os backups ficam no mesmo navegador. As contas e permissões usam clinicas-positivo:access:v1. A conta selecionada é lembrada ao recarregar.

Permissões e confirmação de conta são simuladas no navegador para testar a interface. Não há backend ou autenticação real. Não use dados ou senhas reais. Uma API futura deve validar todas as leituras e alterações no servidor e usar reautenticação própria. Modelos de documentos não representam assinatura, consentimento ou aprovação institucional.

## Testes

899 verificações automatizadas passaram em scripts completos com DOM simulado. Consulte [VALIDACAO-ETAPA-6.txt](docs/validacao/VALIDACAO-ETAPA-6.txt). Para repetir em Node.js 20 ou superior, execute npm run check e npm test, ou as suites individualmente:

- node tests/cadastro.test.cjs
- node tests/permissoes.test.cjs
- node tests/agenda-encaminhamentos.test.cjs
- node tests/prontuario.test.cjs
- node tests/odontologia.test.cjs

A inspeção visual em navegador e a conferência do PDF emitido pela impressora permanecem pendentes.
