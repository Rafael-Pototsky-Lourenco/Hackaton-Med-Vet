const select = document.getElementById('clinic-select');
const error = document.getElementById('entry-error');

document.getElementById('enter-btn').addEventListener('click', () => {
  if (!select.value) {
    error.textContent = 'Selecione uma clínica para continuar.';
    select.focus();
    return;
  }
  location.href = select.value;
});

select.addEventListener('change', () => { error.textContent = ''; });
