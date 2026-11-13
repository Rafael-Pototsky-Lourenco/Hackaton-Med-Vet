# Etapa 5 — prontuário, supervisão e correção

Entrega cumulativa das etapas 1 a 5, com a revisão do cadastro único. Abra a pasta do ZIP da etapa 5 no servidor local usado anteriormente e acesse index.html. Mantenha protocolo, host e porta para conservar os dados do navegador. Os arquivos originais em Hackton não foram modificados.

## Contas fictícias para o teste

- Camila · Aluna: login de confirmação aluno (não pode autorizar correções).
- Elisa · Supervisora: login de confirmação supervisor.
- Ana · Profissional responsável: login profissional.
- Para confirmar uma autorização docente, selecione a conta da supervisora e informe login supervisor e senha fictícia Demo@2026.
- Contas docentes adicionais usam seu próprio ID de conta como login e a mesma senha pública de demonstração. O diálogo já apresenta o login correto da conta atual.

A confirmação valida a conta selecionada, seu vínculo docente e a atribuição ao registro. Informar o login de outra conta não troca a identidade nem concede permissão. A senha é usada apenas na confirmação em memória; o aplicativo não a grava no histórico, nos registros ou nos logs. O campo é limpo após a tentativa. Não use senhas reais.

## Registro inicial

1. Selecione Camila e abra Atendimentos e prontuários → Novo registro, em um paciente atribuído como Helena.
2. Escolha o supervisor Elisa e preencha tipo, data, queixa e o formulário da especialidade. Salve: Rascunho.
3. Edite e salve quantas vezes precisar enquanto for rascunho. Clique Enviar para revisão: Em revisão.
4. Selecione Elisa e abra Supervisão acadêmica. A fila contém apenas versões e pedidos de correção vinculados a essa conta.
5. Abra o registro e escolha Validar ou Devolver para ajustes. A devolução exige orientação e deixa o registro Devolvido.
6. Volte à aluna, edite o devolvido e reenvie. A correção de um rascunho devolvido não exige autorização para alterar conteúdo validado, pois ele ainda não foi validado.
7. Valide com Elisa. A versão passa a Validado e registra ID, nome e data/hora da supervisora. A edição direta fica bloqueada.

Cada registro mantém paciente, clínica, autor identificado, responsável profissional ou supervisor aplicável, tipo, data, formulário e situação. Cada clínica possui campos próprios, sem preenchimento automático de achados clínicos. Em um atendimento iniciado pela agenda, os vínculos e horários continuam preservados.

Um profissional responsável pode finalizar seu próprio rascunho sem supervisão docente, conforme sua permissão. Quando existe supervisor vinculado, usa o fluxo de revisão. Registros profissionais finalizados também ficam Validado e bloqueados, com a identificação do responsável. Ao validar ou finalizar, a sessão de agenda é concluída sem alterar o financeiro.

## Correção de conteúdo validado

1. Na conta autora ou em outra conta clínica autorizada ao caso, abra o registro Validado e clique Solicitar correção.
2. Informe o motivo e marque os campos que precisam de ajuste. O pedido registra o prontuário e a versão de origem.
3. Na conta da supervisora vinculada, abra o pedido pela fila ou pelo registro. Recusar exige motivo. Para aprovar, clique Aprovar com minha conta e confirme o login e a senha fictícios.
4. A autorização guarda solicitante, registro, versão de origem, campos, motivo, supervisor com ID e nome, data/hora, identificador próprio e situação Autorizada. O solicitante não pode aprovar a própria correção.
5. Volte à conta solicitante e clique Aplicar correção autorizada. O formulário permite alterar somente os campos aprovados.
6. Salvar cria uma nova versão Em revisão e consome a autorização. Uma segunda tentativa com a mesma autorização é bloqueada. A autorização também não vale para outro pedido, prontuário ou versão de origem.
7. A versão validada anterior permanece intacta e vigente. A leitura corrente continua com seu conteúdo até a validação da nova versão.
8. A supervisora pode devolver a nova versão para ajustes dos campos autorizados ou validá-la. Depois da validação, a nova versão passa a ser vigente; a anterior permanece no histórico.

O registro mostra quem solicitou, quem autorizou, quando, quem alterou, quando, motivo, campos e comparação Antes/Depois. As versões anteriores, pedidos e eventos só podem ser lidos por usuários com acesso ao prontuário. Recepção e Financeiro não recebem esses conteúdos. A autorização é de uso único; ajustes posteriores de um candidato devolvido editam aquele mesmo candidato ainda não validado, sem gerar outra versão validada ou reutilizar a autorização.

## Adendos

Solicitar adendo abre o mesmo fluxo de autorização docente para o conteúdo validado. A solicitação fica limitada ao campo do adendo. Após autorização, o solicitante informa o conteúdo, que gera uma nova versão em revisão. O adendo pode ser devolvido, ajustado e reenviado. Na validação, é publicado com vínculo ao registro original, versão de origem, autorização, autoria, data e motivo. O conteúdo anterior não é apagado. Adendos legados existentes continuam acessíveis aos usuários autorizados.

## Legado e vínculos

Antes da migração, a base é copiada para clinicas-positivo:shared:v1:before-clinical-v1. Finalizado é migrado para Validado; Aguardando supervisão para Em revisão. Não são inventados IDs de autoria ou validação quando os dados legados continham apenas rótulos genéricos. Esses casos ficam identificados como legado.

Autorizações antigas baseadas apenas em texto, como Professor ou supervisor, são arquivadas sem poder de reutilização. Para corrigir um registro legado sem supervisor identificado, Ana, em um caso atribuído, ou a Administração com acesso clínico expresso pode usar Vincular supervisor. O vínculo e a ação ficam no histórico, e a correção passa pelo novo pedido e pela confirmação docente.

Os vínculos padrão recebem as ações do novo fluxo; permissões personalizadas continuam exigindo concessão explícita em Configurações. O snapshot anterior da política fica em clinicas-positivo:access:v1:before-clinical-v1.

## Roteiro adicional de tentativas negadas

- Tentar editar diretamente um registro Validado.
- Tentar validar com um docente que não está vinculado.
- Aprovar com login de outra conta ou senha incorreta.
- Aplicar a correção antes da aprovação, fora dos campos autorizados ou pela segunda vez.
- Ler versões, comparações ou pedidos na Recepção ou no Financeiro.
- Criar um adendo diretamente para contornar a autorização.
- Recarregar após criar, autorizar, corrigir ou validar: versões e situações devem permanecer.

## Validação e limites

754 verificações automatizadas passaram: 247 de prontuário e correções, 272 de agenda/encaminhamentos, 122 de cadastro e 113 de permissões/financeiro. As suites anteriores foram ajustadas às novas regras e situações; relatórios das etapas anteriores são históricos.

Os testes executam os scripts completos das quatro páginas com DOM simulado, incluindo submissões reais de formulários e confirmação fictícia. Não houve inspeção visual em navegador nesta etapa. Para repetir em Node.js, execute os arquivos da pasta tests. Veja VALIDACAO-ETAPA-5.txt.

O projeto continua sem backend. Contas, autorização e confirmação de senha são simulações no navegador para testar comportamento e podem ser inspecionadas ou alteradas por quem controla esse navegador. Uma API futura deverá autenticar, reautenticar e validar todas as leituras, alterações e transações no servidor, sem registrar senhas.
