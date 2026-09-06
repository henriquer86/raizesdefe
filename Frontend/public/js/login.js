const API_URL = window.APP_CONFIG.API_URL;

document.addEventListener('DOMContentLoaded', function () {
  // Elementos necessários
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');
  const nomeInput = document.getElementById('nomeusuario');
  const senhaInput = document.getElementById('senha');

  if (!form || !errorMsg || !nomeInput || !senhaInput) {
    console.error('Elementos do formulário não encontrados.');
    return;
  }

  // Limpa erro ao digitar
  nomeInput.addEventListener('input', () => {
    errorMsg.textContent = '';
  });
  senhaInput.addEventListener('input', () => {
    errorMsg.textContent = '';
  });

  // Intercepta submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpa mensagem de erro
    errorMsg.textContent = '';

    // Lê campos
    const nomeusuario = nomeInput.value.trim();
    const senha = senhaInput.value;

    // Validação básica
    if (!nomeusuario || !senha) {
      errorMsg.textContent = 'Preencha todos os campos.';
      return;
    }

    // Dados para envio
    const data = { nomeusuario, senha };

    // Envia POST
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          // Usa a mensagem do backend se existir
          const msg = result?.message || `Erro HTTP: ${response.status}`;
          throw { status: response.status, message: msg };
        }

        return result;
      })
      .then((result) => {
        if (result.token && result.user) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          window.location.href = '/dashboard';
        } else {
          throw { status: 500, message: 'Resposta inválida do servidor.' };
        }
      })
      .catch((error) => {
        console.error('Erro no login:', error);
        // Aqui garante que a mensagem aparece na página
        errorMsg.textContent = error.message || 'Erro inesperado no login.';
        errorMsg.style.display = 'block'; // força a div aparecer
      });
  });
});
