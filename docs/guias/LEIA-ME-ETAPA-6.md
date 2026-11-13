# Etapa 6 — Odontologia

Entrega cumulativa das etapas 1 a 6. Use todos os arquivos do ZIP da etapa 6. Sirva a pasta clinicas-positivo no servidor local habitual e abra index.html; mantenha o mesmo protocolo, host e porta para conservar os dados do navegador. Os arquivos originais em Hackton continuam sem alterações.

## Onde abrir

Selecione Odontologia e a conta Ana · Profissional responsável. Em Atendimentos e prontuários, crie um atendimento para Helena (odonto:P-001) ou outro paciente atribuído e salve um rascunho. Na ficha do atendimento, clique Abrir odontograma e plano deste atendimento. O menu Odontograma e planos também permite escolher um atendimento autorizado.

O painel possui Anamnese, Odontograma, Plano de tratamento, Evolução e Exames e documentos. O cabeçalho informa paciente, caso, atendimento ativo e plano ativo. As permissões continuam vinculadas à conta e ao caso.

## Teste mínimo solicitado

1. Com Ana, crie um atendimento de Odontologia para Helena, informe tipo, data e queixa e salve como Rascunho. Para um teste profissional sem revisão docente, mantenha Sem supervisão docente. Para testar aluno/supervisor, use Camila e vincule Elisa.
2. Abra o odontograma. Na arcada inferior, selecione o dente 36 e clique na face central O, ou selecione o número 36 e o botão Oclusal (O). Confira Dente ativo: 36 e Face: Oclusal (O).
3. Clique Registrar achado e informe uma descrição fictícia. O achado guarda paciente, dente, face, autor, atendimento, versão e data.
4. Crie um Novo plano. Em Incluir procedimento, escolha Restauração demonstrativa, alvo Dente selecionado, dente 36, face O, quantidade 1. O preço é copiado do catálogo; no catálogo inicial da demonstração, a restauração vale R$ 120,00. Se o catálogo tiver sido alterado, use o preço exibido.
5. Opcionalmente, inclua Profilaxia demonstrativa como procedimento geral, sem dente. Isso permite conferir a aprovação parcial.
6. Clique Gerar orçamento e selecione os itens. O orçamento copia procedimento, dente/região, face, quantidade, preço unitário, total e atendimento de origem.
7. Troque para Caio · Financeiro. Abra Orçamentos e vendas e selecione o orçamento odontológico recém-criado. Use Aprovar por item e aprove somente a restauração, identificando o responsável pela confirmação. Se houver outro item não aprovado, a proposta fica Parcialmente aprovado. Se houver somente a restauração, fica Aprovado.
8. Clique Criar cobrança dos itens aprovados. A cobrança deve conter apenas a restauração do dente 36/O, com quantidade, preço e ID do atendimento original.
9. Clique Registrar recebimento, informe o saldo e o meio de pagamento fictício. A cobrança passa a Paga, ou Parcialmente paga se o recebimento for menor que o saldo.
10. Abra o recebimento vinculado e confira paciente, plano, orçamento, cobrança, dente 36, face O, quantidade, preço e atendimento. Recarregue a página: os dados e o endereço do recebimento permanecem utilizáveis pela conta autorizada.

O teste acima passou tanto pelo serviço de dados quanto pelos eventos e formulários reais em DOM simulado. Receber um pagamento não marca um procedimento como realizado.

## Anamnese e evolução

A anamnese contém o registro geral, antecedentes, medicamentos, alergias/reações, histórico cirúrgico/odontológico e hábitos informados. Nenhuma condição não informada é preenchida como normal. A evolução possui campo próprio por atendimento e aparece no histórico do caso, identificada por data, conta e versão.

Esses campos usam o prontuário versionado da etapa 5. Um rascunho próprio pode ser editado; conteúdo validado permanece bloqueado. Correções textuais e adendos seguem a autorização docente de uso único. Para novos achados ou registros operacionais após a validação, use outro atendimento autorizado do mesmo caso. As versões anteriores preservam seus snapshots odontológicos.

## Desenho e achados

O desenho esquemático usa os 32 dentes permanentes na numeração FDI, com as duas arcadas e a indicação da direita e esquerda do paciente. O número de cada grupo e de cada superfície aponta ao mesmo identificador. Dentes posteriores oferecem Oclusal; anteriores, Incisal. As faces vestibular, mesial, distal e palatina/lingual aparecem conforme o dente.

Legenda: A/vermelho para achados; P/azul para itens planejados, aprovados ou em execução; R/verde para procedimentos realizados e validados. A seleção ativa usa destaque âmbar e texto explícito. Sem registro não significa condição normal. Quando a face não é informada, o marcador pertence ao dente inteiro e não colore uma superfície específica.

Referência da numeração e orientação FDI: [IHACPA — Dental Notation](https://www.ihacpa.gov.au/sites/default/files/2022-08/Retired%20National%20Coding%20Advice.pdf). O desenho local é esquemático e não reproduz a interface de um serviço externo.

## Plano, catálogo e execução

O catálogo inicial contém restauração, profilaxia e avaliação demonstrativas. A Administração mantém o catálogo em Catálogo de serviços. Os valores são fictícios. Editar o catálogo não altera o preço de itens já incluídos em um orçamento.

Um item pode indicar dente e face ou uma região/procedimento geral sem dente. Quantidade, referência de preço, autor, atendimento e versão de origem são preservados. Itens Planejados podem ser editados antes de serem orçados, no rascunho que os criou. Depois do orçamento, seus dados financeiros ficam congelados; use cancelamento e novo item para uma reformulação, respeitando as cobranças existentes.

As situações dos itens são Planejado, Aprovado, Em execução, Realizado e Cancelado. A aprovação do orçamento atualiza apenas os itens aprovados. No rascunho ativo, Iniciar execução registra o vínculo com o atendimento; Confirmar realização exige evolução/descrição. O item permanece Em execução até a finalização ou validação desse atendimento, quando passa a Realizado. O evento guarda o atendimento e a versão que confirmaram o procedimento. Uma correção posterior de texto do prontuário não duplica nem religa essa execução.

Cancelar um item exige motivo. Um item com cobrança ativa exige regularização ou estorno pelo Financeiro antes do cancelamento. Item Realizado e confirmação clínica não são apagados. A conclusão clínica e os pagamentos continuam independentes.

## Aprovação e financeiro

O orçamento permite aprovação total ou por item. Somente os aprovados entram na cobrança. Se outros itens forem aprovados depois, uma cobrança complementar contém apenas os aprovados ainda não cobrados. O serviço impede cobrança duplicada do mesmo item e alterações diretas nos vínculos ou linhas para contornar a aprovação.

O recebimento é gravado junto da atualização do saldo, numa única operação local, com a conta identificada do operador. Mantém referências ao plano, orçamento, cobrança e itens originais. A repetição da mesma operação não duplica o pagamento. Desconto e estorno continuam exigindo permissões próprias; Davi · Financeiro com estorno e desconto permite testar essas ações. O preço de referência dos itens permanece preservado e o desconto aparece separado do valor original da cobrança.

Funções clínicas recebem leitura das propostas dos seus casos odontológicos. Aprovar, cobrar e receber exigem as ações financeiras correspondentes. Configurações permite definir, para funções clínicas, leitura de orçamento limitada aos casos ou acesso administrativo explicitamente concedido. O Financeiro não recebe anamnese, achados ou evolução por meio do orçamento.

## Impressão, documentos e exames

- O orçamento possui Visualizar impressão do orçamento e Imprimir / salvar PDF.
- O odontograma possui Visualizar impressão do odontograma, inclusive antes de criar um plano. A impressão apresenta o paciente, o caso, os achados, a legenda e, quando selecionado, o plano.
- Exames e documentos permite vincular modelos de termo de consentimento, orientações demonstrativas e acompanhamento do plano. Cada documento guarda paciente, plano, atendimento, versão, autor e data. Pode ser visualizado e impresso.
- Os modelos são identificados como demonstração e não registram assinatura ou consentimento real.
- As prévias de impressão consultam novamente as permissões. Trocar para uma conta sem acesso remove a prévia protegida.
- Exames e radiografias continuam associados ao caso. Não foi acrescentado upload binário: os laudos e referências existentes seguem as permissões clínicas. Evoluções de outro atendimento não são expostas pelo plano compartilhado sem a atribuição correspondente.

## Persistência e validação

A base mantém a chave compartilhada anterior. O snapshot anterior à etapa 6 fica em clinicas-positivo:shared:v1:before-dental-v1. As permissões anteriores são copiadas em clinicas-positivo:access:v1:before-dental-v1. Os procedimentos iniciais usam IDs estáveis e não são duplicados ao recarregar. A política de escopo das propostas possui snapshot adicional before-dental-scope-v1 na mesma chave de acesso.

899 verificações automatizadas passaram: 144 odontológicas, 247 de prontuários/correção, 272 de agenda/encaminhamentos, 122 de cadastro e 114 de permissões/financeiro. Os testes conferem o desenho dos 32 dentes, o fluxo mínimo 36/O, aprovação parcial, recebimento, complementação, preços congelados, autoria, versões, privacidade e recarga. Veja docs/validacao/VALIDACAO-ETAPA-6.txt.

Execute node tests/odontologia.test.cjs para repetir a suite odontológica em um ambiente com Node.js. A aplicação continua sem dependência de build. Os testes usam DOM simulado; não houve inspeção visual em navegador nem conferência do PDF gerado pela impressora nesta etapa. A autorização permanece simulada no navegador; não foi acrescentado backend.
