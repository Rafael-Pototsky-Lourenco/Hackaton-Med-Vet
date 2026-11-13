# Estrutura e manutenção

Os HTMLs e o manifesto permanecem na raiz para conservar as rotas públicas e o funcionamento dos links. Os caminhos de imagens geradas na impressão são relativos à página HTML, não ao arquivo JavaScript.

- assets/css/: estilos por página e complementos odontológicos.
- assets/images/: imagens e identidade visual.
- assets/js/core/: política de autorização e serviço de dados.
- assets/js/shared/: componentes de cadastro, contas, prontuários, agenda e encaminhamentos.
- assets/js/clinics/: telas de cada clínica e componentes exclusivos de Odontologia.
- docs/guias/: instruções e roteiros de cada etapa.
- docs/validacao/: resultados históricos e relatório da versão atual.
- tests/helpers/: ambiente compartilhado de teste. Ele lê os scripts diretamente dos HTMLs, respeitando sua ordem real de carregamento.
- scripts/: verificações de integridade do projeto.

Os scripts atuais são scripts clássicos do navegador e compartilham o contexto global. Preserve a ordem de carregamento declarada nos HTMLs: core → página da clínica → componentes compartilhados → complementos da especialidade. O arquivo de entrada index.html usa apenas assets/js/app.js.

Nenhum prefixo de armazenamento ou esquema de dados foi alterado nesta organização. Ao atualizar a pasta servida, mantenha o mesmo protocolo, host e porta para conservar os dados locais.

Com Node.js 20 ou superior: npm run check verifica sintaxe, recursos e rotas; npm test executa a regressão. Não há dependências para instalar nem etapa de build para usar a aplicação. Sirva a raiz do projeto no servidor local habitual.
