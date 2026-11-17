# Regressões funcionais

Na pasta do projeto, execute com Node.js, sem instalar dependências:

```powershell
node tests/verify-med-vet.cjs
```

Os 29 grupos de verificações cobrem inicialização e carregamento dos scripts, permissões da recepção e da equipe de internamento, cadastro e edição com peso obrigatório, datas de inclusão e de solicitação de exames, filtros combinados da agenda, status de cirurgia, procedimentos e histórico, execução de cuidados, consistência do vínculo entre paciente e internamento, alta com data e hora e estoque.

A agenda também verifica seleção e fechamento do painel lateral sem alterar registros, abertura da ficha, horários fora do período padrão, separação de eventos sobrepostos, fins de semana nas visualizações semanal/mensal e respeito aos filtros e ao perfil ativo nos detalhes exibidos.

O painel inicial verifica o indicador Consultas do dia independente da data e dos filtros anteriores da agenda, a abertura do dia atual e os atalhos de demonstração. Esses atalhos devem abrir o módulo, a ficha e a aba corretos com o perfil indicado, sem gravar ou modificar registros.

O estoque inclui filtragem por texto preservando quantidade disponível e controles, movimentação em uma única gravação, recarga dos registros, rejeição de quantidades inválidas e simulação de falha de armazenamento com rollback. As regras de dados também são verificadas diretamente para impedir que formulários contornados gravem registros inválidos.

O harness usa `node:vm`, um DOM mínimo simulado e armazenamento em memória. Ele verifica a lógica, o HTML produzido e a persistência, sem abrir navegador. Não valida aparência, responsividade, renderização de fontes/ícones, navegação por teclado ou comportamento nativo dos campos. As permissões continuam sendo uma simulação local do protótipo; estes testes não comprovam autorização em servidor.
