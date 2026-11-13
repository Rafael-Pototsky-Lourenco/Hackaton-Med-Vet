# Etapa 4 — agenda, recepção e encaminhamentos

Esta pasta contém a entrega cumulativa das etapas 1 a 4, incluindo a revisão do cadastro único. Use a pasta extraída do ZIP da etapa 4 no mesmo servidor local/origem utilizado antes para conservar os dados do navegador. Abra index.html. A rota veterinária continua disponível e não foi alterada.

## Agenda e séries

Com Bia · Recepção, abra Agenda → Novo agendamento ou série. Informe paciente ativo, serviço, profissional, sala, data, início e fim. Se houver aluno vinculado, selecione o supervisor da clínica. A clínica responsável é a página em uso.

Escolha Única, Diária, Semanal, Quinzenal ou Mensal e informe de 1 a 52 ocorrências. Para séries, o primeiro clique valida todas as sessões e apresenta as datas; o segundo confirma a gravação integral. Qualquer conflito impede a gravação da série inteira. Na recorrência mensal, o dia é ajustado ao último dia do mês quando necessário, preservando o dia original nos meses seguintes.

A validação consulta todos os registros, incluindo os não visíveis à conta. Ela verifica término posterior ao início, paciente ativo, profissional, sala, bloqueios de recurso e sobreposição de consultas do mesmo paciente entre clínicas. Um conflito retorna uma mensagem sem expor os dados da outra consulta. Profissionais são identificados pelo nome informado na demonstração; use a mesma grafia para o mesmo profissional. Salas pertencem à clínica. Datas e horários representam America/Sao_Paulo.

A agenda possui as situações Agendado, Confirmado, Chegou, Em atendimento, Concluído, Falta e Cancelado. O detalhe de cada sessão permite confirmar, registrar chegada, reagendar, marcar falta e cancelar, conforme as ações autorizadas. Reagendamento guarda data, início, fim anteriores, novos valores, autor, data da alteração e motivo. Uma sessão recorrente possui ID próprio e mantém o identificador da série mesmo após reagendamento, falta ou cancelamento.

Os filtros permitem visualizar por data de referência, dia/semana/mês, profissional e situação. Sem data de referência, são exibidos os registros disponíveis, incluindo os exemplos antigos. Recepção e fila apresenta as sessões operacionais e as ações permitidas.

## Iniciar e concluir atendimento

Com Ana · Profissional responsável ou Camila · Aluna em um caso atribuído, clique em Iniciar atendimento na agenda ou na fila. Paciente, clínica, serviço, profissional, sala, data, horários e vínculos acadêmicos são copiados para um único atendimento vinculado. Novo clique reabre o mesmo registro; não cria duplicata.

O atendimento inicia como rascunho com situação clínica Em atendimento. Continue o rascunho para preencher o registro. Se a autoria for da aluna, envie para supervisão; Elisa revisa, devolve, autoriza correção ou valida, conforme o fluxo da etapa 3. A atribuição explícita de aluno/supervisor na sessão também permite acessar aquele atendimento e o contexto administrativo do paciente, sem liberar outros prontuários.

Quando o registro é finalizado ou validado, a situação clínica e a sessão passam a Concluído. O fluxo interno do prontuário mantém o estado Finalizado para preservar as regras existentes de imutabilidade e adendo. A cobrança não é alterada: pode continuar Em aberto. Sessões encerradas ou em atendimento não podem ser reagendadas pelo fluxo de remarcação.

## Encaminhamentos

Com Ana em um paciente atribuído, abra Encaminhamentos → Novo encaminhamento. Informe o mesmo paciente global, outra clínica de destino e um motivo resumido de até 500 caracteres. Origem, autor, data e situação inicial Pendente são registrados automaticamente. Nenhuma nota, escala, evolução ou documento do prontuário de origem é copiado.

Na página da clínica de destino, a Recepção autorizada encontra o encaminhamento em Recebidos e pode aceitar ou recusar. A aceitação acrescenta um vínculo à clínica de destino sem duplicar o cadastro do paciente. Motivo clínico resumido é mostrado apenas à equipe clínica autorizada; Recepção acompanha a situação operacional.

Após aceitar, use Agendar no destino. A sessão e o encaminhamento são vinculados e a situação passa a Agendado. Iniciar a sessão vincula também o atendimento de destino. Finalizar ou validar esse atendimento conclui o encaminhamento. O fluxo completo é Pendente → Aceito → Agendado → Concluído.

Recusa e cancelamento exigem motivo. Um encaminhamento pendente só pode ser aceito ou recusado no destino. A origem pode cancelar os ainda não agendados. Para um encaminhamento já agendado, o destino deve realizar o cancelamento; sessão e encaminhamento são cancelados juntos, respeitando as permissões de agenda. Falta ou cancelamento individual de uma sessão devolve o encaminhamento a Aceito, permitindo uma nova marcação e preservando o histórico.

O prontuário da origem continua protegido pelas atribuições da etapa 3. A aceitação de um encaminhamento não atribui automaticamente toda a equipe de destino ao prontuário da origem. A Administração pode conceder as atribuições clínicas necessárias no destino; aluno e supervisor também podem ser vinculados à sessão.

## Conferência sugerida

1. Com Bia, crie uma série semanal de três sessões e confira a prévia. Remarque uma, cancele outra e marque falta na terceira; confira os IDs, o vínculo da série e os históricos.
2. Crie um bloqueio em uma das datas da série. Tente confirmar uma série que alcance esse bloqueio: nenhuma sessão dela deve ser gravada.
3. Agende o mesmo paciente em outra clínica em horário sobreposto: o serviço deve impedir.
4. Em um caso atribuído, inicie o atendimento duas vezes e confirme que o ID permanece o mesmo. Finalize e confira que a sessão conclui enquanto a cobrança mantém seu estado próprio.
5. Envie um encaminhamento de Odontologia para Nutrição. No destino, aceite com Bia e agende usando o mesmo ID do paciente. Atribua a equipe responsável no destino ou vincule aluno/supervisor à sessão. Inicie, conclua e confira o histórico do encaminhamento nas duas páginas.
6. Confira recusa sem motivo, recusa com motivo, falta da sessão encaminhada e cancelamento no destino. Recarregue as páginas e confirme os vínculos salvos.

## Persistência e validação

Há um snapshot adicional da base antes da migração: clinicas-positivo:shared:v1:before-workflow-v1. Os backups anteriores permanecem intactos. As permissões operacionais dos vínculos que ainda correspondem aos modelos padrão são atualizadas para o novo fluxo; concessões personalizadas são preservadas. Seu snapshot anterior fica em clinicas-positivo:access:v1:before-workflow.

638 verificações automatizadas passaram: 272 da etapa 4, 244 de permissões e 122 de cadastro. Incluem fluxos reais de formulário em DOM simulado, conflitos, ausência de gravação parcial, recorrências, reabertura, vínculos acadêmicos, privacidade, transições e recarga. Veja VALIDACAO-ETAPA-4.txt e a pasta tests.

A conferência visual foi interrompida porque o controle do computador não conseguiu confirmar a URL do navegador no Windows com segurança. A inspeção visual permanece pendente. A autorização continua simulada no navegador; uma futura API deve validar todas essas regras no servidor.
