# Melhorias da clínica veterinária

Esta entrega mantém a aplicação em HTML, CSS e JavaScript puro, com os mesmos módulos, perfis simulados e armazenamento local do projeto original. As alterações funcionais e visuais foram concentradas na clínica veterinária; os arquivos das demais clínicas foram preservados.

1. **Interface e painel inicial:** a Veterinária usa o layout da Odontologia com suas cores originais: menu lateral azul escuro (`#102f58`) com logotipo institucional, botões e destaques azuis (`#19517e`), cabeçalho branco, cartões arredondados, tabelas e formulários. A página inicial segue a composição da referência odontológica: caminho de navegação, título e descrição do perfil, indicadores no topo, cartões Próximos passos e Estado da demonstração lado a lado e seção Testar o sistema com atalhos para os cenários veterinários e seus perfis simulados. A grade de horários permanece na aba Agenda. O indicador Consultas do dia usa a data atual e abre a agenda diária com os filtros limpos. Os botões e formulários usam ações específicas, como Novo exame, Novo atendimento, Programar cirurgia, Internar paciente, Nova prescrição, Novo responsável, Novo paciente, Novo produto, Novo orçamento e Nova cobrança. As confirmações e mensagens de sucesso também acompanham cada ação. A composição se adapta a telas menores.
2. **Agenda:** seletor de data, navegação entre dias e botão Hoje, com visualizações Dia, Semana e Mês. O filtro combina data/período, profissional, status, sala e texto. A grade diária apresenta horários por consultório e um painel lateral do agendamento selecionado, no padrão da Odontologia; o painel oferece chegada, ficha do paciente, detalhes e reagendamento conforme as permissões existentes. Horários fora do período padrão são incluídos na grade e eventos sobrepostos ficam em colunas separadas; semana e mês incluem os fins de semana.
3. **Cadastros:** o perfil Recepção consegue editar pacientes e responsáveis. As listagens exibem a data de inclusão, preservada nas edições. O peso do paciente, em kg, é obrigatório e deve ser maior que zero; o formulário destaca os erros e a camada de dados também bloqueia valores inválidos.
4. **Exames:** o campo obrigatório Data de solicitação é gravado na criação e aparece na listagem e nos detalhes. Os exames antigos sem esse campo recuperam a data disponível no registro e recebem uma indicação explícita de que a data veio do legado.
5. **Cirurgias:** Programada usa amarelo, Concluída usa verde e o novo estado Cancelada usa vermelho. O cancelamento conserva o registro e exige motivo, além de registrar data e hora.
6. **Internamento:** cada episódio tem uma linha do tempo de procedimentos, evoluções, execução de cuidados e alta. Os procedimentos registram paciente, internamento, profissional, descrição e instante de realização. Alta clínica aparece em verde e exige data e hora. Medicações e cuidados realizados passam automaticamente para verde e mantêm o executor e o instante da execução.
7. **Estoque:** a tela separa consulta de produtos, ações de entrada/saída e histórico de movimentos. Cada item exibe numericamente o estoque disponível, a unidade, o mínimo, o lote e a validade. Movimento e atualização do saldo são persistidos juntos em uma única escrita; quantidades inválidas e saídas superiores ao saldo são bloqueadas.

**Arquivos da implementação:**

| Arquivo | Responsabilidade |
| --- | --- |
| `med_vet.html` | Estrutura visual e carregamento dos scripts. |
| `med_vet.css` | Importa a base visual de `odonto.css` e acrescenta os componentes veterinários e as regras responsivas. Mantenha ambos os arquivos na mesma pasta. |
| `med_vet.js` | Navegação, filtros, formulários, permissões simuladas, histórico e gravações compostas. |
| `med_vet-data.js` | Novo adaptador de validação e migração sobre o serviço `ClinicasData`. |

**Persistência e novos campos:** o projeto não possui backend ou banco de dados no servidor. Os registros continuam no `localStorage`, pela chave compartilhada existente `clinicas-positivo:v2`, identificados como clínica `med_vet`. O novo adaptador valida os registros novos ou alterados antes de chamar a persistência existente, sem impedir outras operações por causa de um registro antigo inválido que permaneça intocado.

| Registro/campo | Formato e comportamento |
| --- | --- |
| `created_at` | Instante ISO de inclusão; preservado nas edições. |
| `created_at_estimated` | `true` quando a inclusão ausente foi recuperada de `updated_at`; a listagem identifica essa origem. |
| Paciente: `peso` | Número positivo em kg; valores antigos como `12,4 kg` são normalizados. |
| Exame: `requestedAt` | Data `YYYY-MM-DD`, obrigatória nos novos exames. |
| Exame: `requestedAtEstimated` | `true` quando a solicitação foi recuperada da data disponível no registro antigo. |
| Cirurgia: `status`, `cancelReason`, `canceledAt` | Inclui `Cancelada`, motivo obrigatório e instante ISO do cancelamento. |
| Internamento: `admissionAt`, `dischargeAt`, `dischargedBy` | Instantes ISO de admissão/alta e responsável pela alta; `dischargeAt` é obrigatório em Alta clínica. |
| Procedimento: `admissionId`, `patientId`, `performedAt`, `notes`, `professional` | Vínculos com o episódio e paciente, instante ISO, descrição e profissional obrigatórios. |
| Prescrição/cuidado: `admissionId`, `executedAt`, `executedBy` | Vínculo com o episódio, instante ISO e executor do cuidado. |
| Produto/movimento: `stock`, `min`, `quantity` | Saldo e mínimo numéricos não negativos; quantidade movimentada numérica e positiva. |

Os formulários de data e hora usam o horário de São Paulo. Os instantes novos são armazenados em ISO com fuso explícito e apresentados usando `America/Sao_Paulo`. A migração é idempotente: não inventa uma data de alta ausente e preserva os campos antigos; quando encontra `dischargedAt` legível, também fornece o campo canônico `dischargeAt`.

**Como conferir:** abra `med_vet.html` no navegador, mantendo todos os arquivos desta pasta juntos. Também é possível iniciar um servidor estático na pasta e abrir a mesma página. Os agendamentos fictícios originais estão em **22/05/2026**; use o botão **Ver dia de demonstração** no painel para consultá-los. O seletor de perfil permite verificar a edição pela Recepção e os demais fluxos simulados. Fonte e ícones continuam sendo carregados por CDN, como no projeto original.

**Verificação:** a sintaxe JavaScript e a suíte automatizada em Node foram verificadas. A inspeção visual em um navegador completo ficou limitada: o navegador interno do aplicativo estava inacessível e a tentativa de abrir o Brave foi rejeitada pelo ambiente. Assim, o resultado visual e a responsividade ainda precisam de conferência no navegador do usuário; não há declaração de comparação visual validada por captura de tela.
