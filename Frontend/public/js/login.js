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
    fetch('https://raizesdefe.com.br/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        // Log do resultado
        console.log(result);

        // Verifica token e user
        if (result.token && result.user) {
          // Salva no localStorage
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          // Redireciona
          window.location.href = '/dashboard';
        } else {
          throw new Error('Resposta inválida do servidor.');
        }
      })
      .catch((error) => {
        console.error('Erro no login:', error);
        errorMsg.textContent =
          'Erro no login. Verifique suas credenciais ou tente novamente.';
      });
  });
});
