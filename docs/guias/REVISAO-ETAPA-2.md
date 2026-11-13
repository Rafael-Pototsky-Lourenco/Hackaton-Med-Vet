# Revisão completa da etapa 2

A ficha geral foi revisada nas quatro clínicas. Para abrir: Pacientes → clique no nome ou identificador do paciente. A aba Cadastro aparece junto das demais seções autorizadas: Agenda, Encaminhamentos, Prontuários e Financeiro.

Correções desta revisão:
- Encaminhamentos agora usa sua própria permissão, independentemente da Agenda.
- A ficha consulta os vínculos da conta em cada clínica. Prontuários autorizados aparecem por especialidade e caso, com links para a clínica responsável. Não são concedidos novos acessos clínicos.
- A aba Prontuários considera também acesso autorizado a exames, procedimentos e supervisão. Financeiro considera cobranças e orçamentos.
- As seções sem acesso são identificadas por uma mensagem, evitando confusão com abas ausentes por falha da tela.
- A busca por telefone funciona com ou sem pontuação; os resultados diferenciam homônimos com ID, nascimento e contatos.
- Datas impossíveis, como 29/02/2001, são rejeitadas pelo formulário e pelo serviço de gravação.

Conferência dos demais requisitos:
- ID global estável: mantido após edição, vínculo em outra clínica e recarga.
- Nome completo, nome social, nascimento, telefone, e-mail e responsável: cadastro e edição persistentes.
- Idade calculada pelo nascimento; idade legada preservada e identificada enquanto o nascimento não é informado.
- Possíveis duplicidades mostradas antes da gravação, com seleção de cadastro existente e confirmação de homônimo distinto.
- Dados administrativos compartilhados; conteúdo clínico separado por especialidade/caso e filtrado pela atribuição.
- Inativação preserva o histórico e bloqueia novos agendamentos no formulário e no serviço. Reativação libera agendamento.
- As abas mostram os registros existentes. A criação e tramitação completa de encaminhamentos continuam aguardando as regras específicas dessa etapa; não foram acrescentadas nesta revisão do cadastro.

Contas para conferir abas:
- Alice · Administração com atribuição clínica: as cinco abas nos pacientes explicitamente atribuídos, como Helena (P-001) e Beatriz (P-003).
- Bia · Recepção: Cadastro, Agenda e Encaminhamentos.
- Caio · Financeiro: Cadastro e Financeiro.
- Alice · Administração sem atribuição clínica: não recebe a aba Prontuários. Essa restrição decorre da etapa 3.

122 verificações do cadastro passaram, além das 244 da regressão de permissões: 366 no total. Foram usados scripts reais das páginas e DOM simulado. A inspeção visual no navegador permanece pendente.

Atenção à pasta utilizada: as alterações cumulativas foram entregues em outputs/clinicas-positivo. Os arquivos originais em Documents/Hackton/Hackaton-Med-Vet-testes/Hackaton-Med-Vet-testes ainda contêm o sistema anterior e não carregam os componentes compartilhados. Para testar esta entrega, use todos os arquivos desta pasta (ou extraia o ZIP revisado) e sirva index.html. Para conservar os dados existentes do navegador, mantenha o mesmo protocolo, host e porta de antes.
