# Correções de QA — 13/11/2026

Ambiente de demonstração, com dados e contas fictícios. Versão cumulativa das etapas 1 a 6; as rotas existentes e a clínica veterinária foram preservadas.

## Correções entregues

| Problema | Correção | Regressão |
|---|---|---|
| Gravações de abas diferentes sobrescreviam o banco inteiro | Todas as mutações públicas de ClinicData aguardam um Web Lock compartilhado pela origem. A inicialização e as migrações usam a mesma fila; as leituras não persistem cópias antigas. As permissões são verificadas quando a operação executa. | Recebimentos simultâneos, limite do saldo, clínicas diferentes, inicialização simultânea e troca de conta durante a espera |
| Pagamento podia existir sem atualização do saldo | Recebimento e saldo são persistidos em uma única gravação; repetição da mesma operação é idempotente. Gravações genéricas de pagamentos ou alterações isoladas do recebido são rejeitadas. O mesmo padrão foi aplicado ao movimento e saldo de estoque odontológico. | Falha de armazenamento, retentativa, duplicação e movimento de estoque |
| Rascunho antigo substituía uma edição recente | Token com identificador da versão e revisão incrementada a cada alteração. Formulários antigos recebem erro e permanecem disponíveis para conferência. | Duas instâncias com armazenamento compartilhado e API de compatibilidade |
| Atualização em outra aba descartava formulário aberto | Eventos de dados recarregam as telas sem apagar o modal nem sua edição pendente. Mudança de identidade ou permissões continua invalidando o conteúdo protegido. | Cadastro, prontuário, atualização de outra clínica, troca de conta e revogação |
| Busca descartava filtros da Agenda e dos Encaminhamentos | A busca renderiza a lista pelo fluxo do módulo, mantendo filtros, foco e seleção do cursor. | Quatro clínicas, filtros de situação/direção e lista vazia |
| Seletores odontológicos mantinham o endereço anterior | Seleção e renderização atualizam a rota com o atendimento e o plano efetivamente abertos. | Troca de atendimento/plano e reabertura da rota |
| Desconto integral mantinha situação financeira anterior | A situação da cobrança é recalculada pelo valor líquido e pelo recebido. Saldo zero fica Paga, inclusive após desconto autorizado. | Desconto do saldo restante |
| Profissional validava prontuário sem tipo ou data | Envio e finalização compartilham a exigência de tipo, data válida e queixa. | Campos vazios e finalização válida nas quatro clínicas |

O envio dos formulários também aguarda a conclusão da gravação e ignora novos envios enquanto ela estiver pendente, evitando duplicação por clique duplo.

## Testes automatizados

Com Node.js 20 ou superior, na pasta do projeto:

```text
npm run check
npm test
```

Resultado desta entrega: **1.206 verificações passaram** em nove suítes. A checagem de integridade também passou: sintaxe, referências locais, manifesto e seis rotas.

As suítes novas são sincronizacao, ui-regressao, prontuario-regressoes e gravacao-regressoes. Os testes usam contextos JavaScript separados com armazenamento compartilhado, fila de bloqueio, eventos de janela e timers controlados. A simulação verifica concorrência e falhas de gravação sem alterar os dados do navegador do usuário.

A abertura no navegador integrado não foi concluída: a conexão ao servidor local terminou por timeout. Esta entrega não declara inspeção visual nem execução simultânea em abas reais.

## Conferência manual

Abra a aplicação pelo mesmo servidor e origem usados anteriormente, no Chrome ou Edge atualizado. Feche abas antigas antes de substituir os arquivos. Use somente os dados fictícios.

1. Abra duas abas da mesma clínica com a conta Financeiro. Receba valores diferentes sobre uma cobrança com saldo suficiente; confira os dois pagamentos, o total recebido e a persistência após recarregar.
2. Confirme um recebimento com dois cliques rápidos. Deve existir um único pagamento. Repita com um novo cadastro ou plano para verificar que o formulário também impede duplicação enquanto salva.
3. Com Profissional responsável, abra o mesmo rascunho nas duas abas. Salve uma alteração na segunda e tente salvar o formulário antigo na primeira. A primeira deve rejeitar a gravação desatualizada e preservar o texto digitado para conferência. Feche e reabra o formulário para obter a revisão atual.
4. Deixe um cadastro ou prontuário aberto com alterações não salvas. Grave uma agenda na outra aba. O formulário deve continuar aberto. Ao trocar a conta ou revogar a permissão clínica, o conteúdo protegido deve ser fechado.
5. Na Agenda, selecione uma situação e uma data; digite na busca. Os controles e filtros devem continuar ativos. Repita em Encaminhamentos com direção e situação, incluindo uma busca sem resultados.
6. Na Odontologia, troque atendimento e plano pelos seletores. Recarregue a página: a mesma seleção deve reabrir.
7. Com a conta que possui desconto, desconte todo o saldo de uma cobrança parcialmente paga. Confira saldo zero e situação Paga nas telas financeiras e após recarga.
8. Com Profissional responsável, apague tipo ou data de um rascunho. A finalização deve ser recusada. Preencha os campos e finalize novamente.

## Manutenção

As APIs de leitura continuam síncronas. As mutações públicas de ClinicData retornam Promise e precisam de await; aguarde ClinicData.ready para inspecionar dados persistidos imediatamente após o carregamento. Nenhuma chamada interna adquire novamente o bloqueio, evitando espera circular.

As permissões continuam simuladas no navegador. Os bloqueios coordenam esta versão da demonstração na mesma origem; uma futura API deve executar autorização, transações, idempotência e controle de revisão no servidor.
