# Clínicas Positivo
Protótipo de demonstração com dados fictícios. Cada clínica tem seu próprio HTML, CSS e JavaScript.

## Estrutura
- `index.html` + `index.css` + `app.js`: tela inicial com a seleção da clínica (o botão leva à página escolhida).
- `med_vet.*`: Clínica Veterinária
- `odonto.*`: Clínica Odontológica
- `fisioterapia.*`: Clínica de Fisioterapia
- `nutricao.*`: Clínica de Nutrição
- `psicologia.*`: Clínica de Psicologia
- `manifest.webmanifest`: configuração PWA.
- `img/logo.png` (opcional): logotipo exibido no topo; se não existir, aparece o texto "Universidade Positivo".

## Dados
Os registros criados na demonstração ficam no `localStorage` do navegador, separados por clínica.
Os exemplos iniciais são fictícios e estão embutidos no JavaScript de cada clínica.
