function initPerfil() {
  carregarDadosDoPerfil();
}

async function carregarDadosDoPerfil() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token não encontrado');
    return;
  }

  const saudacao = document.getElementById('saudacaoPerfil');
  const agora = new Date();
  const hora = agora.getHours(); // retorna número de 0 a 23

  if (hora >= 5 && hora < 12) {
    saudacao.textContent = 'Bom dia ';
  } else if (hora >= 12 && hora < 18) {
    saudacao.textContent = 'Boa tarde ';
  } else if (hora >= 18 && hora < 24) {
    saudacao.textContent = 'Boa noite ';
  } else {
    saudacao.textContent = 'ZZZZzzzzz ';
  }

  const user = localStorage.getItem('user');
  const usuarioPergil = JSON.parse(user);

  const pessoaUsuario = await fetch(
    `${API_URL}/pessoas/${usuarioPergil.pessoa}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const pessoaPerfil = await pessoaUsuario.json();
  const nomeUsuario = document.getElementById('nomeUsuario');
  const nomeCompleto = pessoaPerfil.nome;
  const nomeUsuarioPerfil = document.getElementById('nomeUsuarioPerfil');
  const dataNascimentoPerfil = document.getElementById('dataNascimentoPerfil');
  const dataNascimentoTratada = new Date(pessoaPerfil.dataNascimento);
  const telefonePerfil = document.getElementById('telefonePerfil');
  const telefoneMascara = pessoaPerfil.telefone.replace(
    /(\d{2})(\d{5})(\d{4})/,
    '($1) $2-$3',
  );

  if (nomeUsuario) {
    nomeUsuario.textContent = getFirstName(nomeCompleto);
  }

  if (nomeUsuarioPerfil) {
    nomeUsuarioPerfil.textContent = nomeCompleto;
  }

  if (dataNascimentoPerfil) {
    if (pessoaPerfil.dataNascimento) {
      // Se houver data cadastrada
      const dataNascimentoTratada = new Date(pessoaPerfil.dataNascimento);
      dataNascimentoPerfil.textContent =
        dataNascimentoTratada.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    } else {
      // Se não houver data cadastrada
      dataNascimentoPerfil.textContent = 'Data de nascimento não disponível';
    }
  }

  if (telefonePerfil) {
    telefonePerfil.textContent = telefoneMascara;
  }

  function getFirstName(dado) {
    const nomeLimpo = dado ? dado.trim() : '';
    const partes = nomeLimpo.split(/\s+/);
    return partes[0] || 'Anônimo';
  }
}
