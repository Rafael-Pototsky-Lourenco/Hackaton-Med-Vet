# Etapa 3 — usuários, vínculos e permissões

A entrega cumulativa das etapas 1, 2 e 3 está nesta pasta. Execute index.html no mesmo endereço/origem usado anteriormente para conservar o localStorage. O seletor do cabeçalho agora troca contas fictícias; a conta selecionada é lembrada ao recarregar e ao trocar de clínica.

## Contas para conferir o comportamento

| Conta fictícia | Comportamento inicial |
|---|---|
| Alice · Administração | Gerencia contas, vínculos, clínicas e catálogo. Não lê prontuários. |
| Alice · Administração com atribuição clínica | Administração com leitura clínica expressa de Helena e Beatriz da clínica selecionada. |
| Rafael · Gestão da clínica | Operação e indicadores; sem conteúdo clínico por padrão. |
| Bia · Recepção | Cadastro administrativo, agenda e presença; situação operacional de encaminhamentos. |
| Camila · Aluna | Somente Helena da clínica selecionada; cria rascunhos próprios e envia à revisão. |
| Elisa · Supervisora | Casos de Helena e Beatriz da clínica selecionada; devolve, autoriza correção e valida versões enviadas. |
| Ana · Profissional responsável | Casos de Helena e Beatriz da clínica selecionada; registra atendimento, exame, procedimento e adendo conforme o módulo existente. |
| Caio · Financeiro | Cadastro administrativo, catálogo, orçamentos, recebimentos e cobranças. Sem desconto ou estorno. |
| Davi · Financeiro com estorno e desconto | Ações financeiras com permissões próprias de desconto e estorno. |
| Marina · Funções diferentes por clínica | Recepção em Odontologia, Financeiro em Nutrição; sem vínculo com Psicologia ou Fisioterapia. |
| Pedro · Estoque | Operações de estoque nos módulos existentes. |

Os IDs legados de Helena terminam em P-001; os de Beatriz em P-003. Pacientes homônimos de origens diferentes continuam separados. Nenhum paciente novo é atribuído automaticamente à equipe: a Administração deve conceder a atribuição expressa.

## Administrar contas e permissões

Selecione Alice · Administração e abra Configurações. Os botões permitem criar uma conta fictícia, editar o nome da clínica atual e editar vínculos. Uma nova conta começa sem vínculos e sem acesso.

No editor de vínculos, escolha conta, clínica e função. As ações são salvas explicitamente por módulo. A seleção de função carrega uma proposta de ações, que pode ser ajustada. A leitura clínica exige a opção Autorização clínica expressa, a ação visualizar no módulo e atribuições por identificador global do paciente, caso ou atendimento. IDs devem ser separados por vírgula. Uma atribuição por atendimento não libera os demais casos do paciente.

Administração e Gestão não têm acesso clínico implícito. Desconto, estorno, revisão e autorização de correção são ações independentes. Para um aluno corrigir um registro devolvido, a supervisora deve abrir o rascunho e usar Autorizar correção. O aluno pode então editar seu rascunho e reenviar; a supervisora valida a versão enviada. Registros finalizados continuam protegidos e as correções posteriores usam adendo.

O Catálogo de serviços está disponível nas quatro clínicas para Administração e Financeiro. Administração cadastra e edita descrições e valores; Financeiro consulta.

## Conferência sugerida

1. Em Psicologia, selecione Bia: a agenda fica disponível, mas prontuários, evoluções, escalas e anotações não aparecem na busca, nos detalhes ou nos relatórios.
2. Selecione Caio: o financeiro exibe a descrição administrativa Sessão de Psicologia, valores e situações. Desconto e estorno ficam indisponíveis.
3. Selecione Davi: desconto e estorno aparecem e podem ser gravados.
4. Selecione Camila: somente o caso atribuído de Helena aparece; crie um rascunho e envie para supervisão. Troque para Elisa, devolva e autorize a correção; volte à aluna para corrigir e reenviar.
5. Compare Alice sem atribuição com Alice com atribuição clínica: a segunda pode ler os casos expressamente atribuídos.
6. Selecione Marina e troque entre Odontologia, Nutrição e Psicologia: as funções variam por clínica e a clínica sem vínculo retorna Acesso restrito.
7. Recarregue a página e confira a conta, os vínculos e os registros salvos.

Links diretos usam #modulo/identificador. Exemplo de tentativa restrita: psicologia.html#atendimentos/psicologia%3AAT-001. Recepção e Financeiro recebem Acesso restrito. Um usuário com atribuição e ação de leitura pode abrir o registro. A busca, filtros, indicadores, exportações e ações utilizam a mesma política.

## Persistência e limites da demonstração

assets/js/core/clinic-auth.js concentra a política e os vínculos. assets/js/core/clinic-data.js filtra e projeta os dados nas leituras e revalida as ações e atribuições na gravação. As telas recebem apenas os registros permitidos e os campos administrativos destinados à função. Os dados clínicos legados permanecem guardados na especialidade.

As contas e permissões ficam em clinicas-positivo:access:v1; a seleção fica em clinicas-positivo:demo-account. O banco compartilhado mantém sua chave anterior. A atualização preserva os backups anteriores e cria o snapshot clinicas-positivo:shared:v1:before-access-v1 antes de reorganizar dados clínicos legados. Alternar contas não reinicializa o banco.

Permissões simuladas no navegador servem para testar o comportamento da interface. O projeto não contém backend ou autenticação real. Quem controla o navegador pode inspecionar ou alterar os arquivos e o localStorage. Uma futura API deve autenticar o usuário e validar clínica, ação e atribuição no servidor em todas as leituras e alterações. O portal do paciente não existe nesta versão; nenhuma rota de portal foi criada.

A rota veterinária e seus arquivos permanecem disponíveis e sem alterações.

## Validação

244 verificações passaram com os scripts completos das quatro páginas em contexto JavaScript isolado e DOM simulado, incluindo formulários e eventos reais, persistência, troca de conta, revisão, links diretos, exportações e tentativas negadas. Veja VALIDACAO-ETAPA-3.txt.

Para repetir em um ambiente com Node.js: node tests/permissoes.test.cjs. A aplicação continua sem dependência de build ou Node para uso.

A tentativa de inspeção visual pelo navegador integrado foi bloqueada por timeout ao acessar o servidor local. O layout não foi homologado visualmente nesta etapa.
