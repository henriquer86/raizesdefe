function initTrabalhadores() {
  carregarTrabalhadores();
}

//Carega a lista de funções cadastradas
async function carregarTrabalhadores() {
  const trabalhadoresList = document.getElementById('trabalhadoresLista');
  if (!trabalhadoresList) {
    console.error('Elemento #trabalhadoresLista não encontrado.');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    trabalhadoresList.innerHTML = 'Token não encontrado.';
    return;
  }
  try {
    const response = await fetch(`${API_URL}/trabalhadores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    trabalhadoresList.innerHTML = '';

    if (!Array.isArray(data)) {
      throw new Error('A API não retornou uma lista válida.');
    }

    if (data.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="9">Nenhum trabalhador encontrado.</td>';
      trabalhadoresList.appendChild(row);
      return;
    }

    for (const trabalhador of data) {
      // Buscar dados da pessoa vinculada
      const responsePessoa = await fetch(
        `${API_URL}/pessoas/${trabalhador.pessoa}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let pessoa = {};
      if (responsePessoa.ok) {
        pessoa = await responsePessoa.json();
      }

      // Buscar dados da função vinculada
      const responseFuncao = await fetch(
        `${API_URL}/funcoes/${trabalhador.funcao}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let funcao = {};
      if (responseFuncao.ok) {
        funcao = await responseFuncao.json();
      }

      // Buscar dados da pessoa responsável pela última alteração ou cadastro
      const responseUsuario = await fetch(
        `${API_URL}/usuarios/${trabalhador.cadastradopor || trabalhador.alteradopor}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let usuario = {};
      if (responseUsuario.ok) {
        usuario = await responseUsuario.json();
      }

      const responseUsuarioPessoa = await fetch(
        `${API_URL}/pessoas/${usuario.pessoa}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let pessoaUsuario = {};
      if (responseUsuarioPessoa.ok) {
        pessoaUsuario = await responseUsuarioPessoa.json();
      }

      const telefoneInput = pessoa.telefone;
      telefoneMascara = telefoneInput.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      );

      const row = document.createElement('tr');
      row.innerHTML = `
    <td>${pessoa.nome.toUpperCase()}</td>
    <td class="vDesktop">${funcao.nome}</td>
    <td class="vDesktop">${telefoneMascara}</td>
    <td class="vDesktop">${pessoa.datadenascimento ? new Date(pessoa.datadenascimento).toLocaleDateString('pt-BR') : ''}</td>
    <td class="vDesktop">${trabalhador.dataultimaalteracao ? new Date(trabalhador.dataultimaalteracao).toLocaleString('pt-BR') : new Date(trabalhador.datacadastro).toLocaleString('pt-BR')}</td>
    <td class="vDesktop">${pessoaUsuario.nome.toUpperCase()}</td>
    <td>
      <button id="verTrabalhador" class="btn-default" onclick="verTrabalhador('${trabalhador.id}')">
        <i data-lucide="eye"></i>Visualizar
      </button>
    </td>
    <td>
      <button id="editarTrabalhador" class="btn-default" onclick="editarTrabalhador('${trabalhador.id}')">
        <i data-lucide="pencil"></i>Editar
      </button>
    </td>
    <td>
      <button id="excluirTrabalhador" class="btn-default" onclick="excluirTrabalhador('${trabalhador.id}')">
        <i data-lucide="trash-2"></i>Excluir
      </button>
    </td>
  `;
      trabalhadoresList.appendChild(row);
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Erro ao carregar trabalhadores:', error);
    trabalhadoresList.innerHTML = `${error.message}`;
  }
}

// Abrir o modal de cadastro
// Seleciona elementos
const containerTrabalhador = document.getElementById('main-content');

// Função para abrir modal
containerTrabalhador.addEventListener('click', (event) => {
  const btn = event.target.closest(
    '#criarTrabalhador, #editarTrabalhador, #verTrabalhador, #btnCadastrarTrabalhador, #criarUsuario, #btnSalvarCadastrarUsuario, #btnSalvarModalEditarTrabalhador',
  );

  if (btn) {
    if (btn.id === 'criarTrabalhador') {
      document.getElementById('overlayModalTrabalhador').style.display = 'flex';
      carregarFuncoes();
      // mascarar telefone no modal de cadastro
      const telefoneInput = document.getElementById('telefoneTrabalhador');
      telefoneInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // só números

        if (valor.length > 10) {
          valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (valor.length > 6) {
          valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (valor.length > 2) {
          valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }

        e.target.value = valor;
      });
    } else if (btn.id === 'btnCadastrarTrabalhador') {
      cadastrarTrabalhador();
    } else if (btn.id === 'editarTrabalhador') {
      document.getElementById('overlayModalTrabalhadorEditar').style.display =
        'flex';
    } else if (btn.id === 'verTrabalhador') {
      document.getElementById(
        'overlayModalTrabalhadorVisualizar',
      ).style.display = 'flex';
    } else if (btn.id === 'criarUsuario') {
      document.getElementById('modalCadastrarUsuario').style.display = 'flex';
    } else if (btn.id === 'btnSalvarCadastrarUsuario') {
      cadastrarUsuario(trabalhadorSelecionadoId);
    } else if (btn.id === 'btnSalvarModalEditarTrabalhador') {
      salvarEdicaoTrabalhador(trabalhadorSelecionadoEditarId);
    }
  }
});

// Função para fechar modal
containerTrabalhador.addEventListener('click', (event) => {
  const btn = event.target.closest(
    '#btnFecharModalTrabalhador, #btnCancelarModalTrabalhador, #btnFecharModalEditarTrabalhador, #btnCancelarModalEditarTrabalhador, #btnFecharModalVisualizarTrabalhador, #btnFecharModalCadastrarUsuario, #btnCancelarCadastrarUsuario',
  );
  if (btn) {
    if (
      btn.id === 'btnFecharModalTrabalhador' ||
      btn.id === 'btnCancelarModalTrabalhador'
    ) {
      document.getElementById('overlayModalTrabalhador').style.display = 'none';
    } else if (
      btn.id === 'btnFecharModalEditarTrabalhador' ||
      btn.id === 'btnCancelarModalEditarTrabalhador'
    ) {
      document.getElementById('overlayModalTrabalhadorEditar').style.display =
        'none';
    } else if (btn.id === 'btnFecharModalVisualizarTrabalhador') {
      document.getElementById(
        'overlayModalTrabalhadorVisualizar',
      ).style.display = 'none';
    } else if (
      btn.id === 'btnFecharModalCadastrarUsuario' ||
      btn.id === 'btnCancelarCadastrarUsuario'
    ) {
      document.getElementById('modalCadastrarUsuario').style.display = 'none';
    }
  }
});

// Fecha modal clicando fora dele (overlay)
containerTrabalhador.addEventListener('click', function (event) {
  const overlayTrabalhador = document.getElementById('overlayModalTrabalhador');
  if (overlayTrabalhador && event.target === overlayTrabalhador) {
    overlayTrabalhador.style.display = 'none';
  }
  if (event.target === overlayModalTrabalhadorEditar) {
    document.getElementById('overlayModalTrabalhadorEditar').style.display =
      'none';
  }
  if (event.target === overlayModalTrabalhadorVisualizar) {
    document.getElementById('overlayModalTrabalhadorVisualizar').style.display =
      'none';
  }
});

//preencher o select de funções
async function carregarFuncoes() {
  try {
    const funcaoSelect = document.getElementById('funcaoTrabalhador');
    if (!funcaoSelect) {
      console.warn('Elemento #funcaoTrabalhador não encontrado nesta página.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    const response = await fetch(`${API_URL}/funcoes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const funcoes = await response.json();
    funcaoSelect.innerHTML = '<option value="">Selecione a função</option>';

    funcoes.forEach((funcao) => {
      const option = document.createElement('option');
      option.value = funcao.id;
      option.textContent = funcao.nome;
      funcaoSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar funções:', error);
  }
}

async function cadastrarTrabalhador() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    const nome = document.getElementById('nomeTrabalhador').value;
    const telefone = document
      .getElementById('telefoneTrabalhador')
      .value.replace(/\D/g, '');
    const datadenascimento = document.getElementById(
      'datadenascimentoTrabalhador',
    ).value;
    const funcao = document.getElementById('funcaoTrabalhador').value;
    const cadastradopor = JSON.parse(localStorage.getItem('user')).id;

    const bodyPessoa = {
      nome,
      telefone,
      datadenascimento: datadenascimento || null,
      cadastradopor,
    };

    // 1º POST → cadastra pessoa
    const responsePessoa = await fetch(`${API_URL}/pessoas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        telefone: String(telefone),
        datadenascimento: datadenascimento || null,
        cadastradopor,
      }),
    });

    if (!responsePessoa.ok) {
      throw new Error('Erro ao cadastrar pessoa.');
    }

    const pessoaCriada = await responsePessoa.json();
    const pessoaId = pessoaCriada.id; // ← pega o id retornado

    // 2º POST → cadastra trabalhador usando id da pessoa
    const responseTrabalhador = await fetch(`${API_URL}/trabalhadores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pessoa: pessoaId,
        funcao: funcao,
        cadastradopor: cadastradopor,
      }),
    });

    if (!responseTrabalhador.ok) {
      throw new Error('Erro ao cadastrar trabalhador.');
    }

    const trabalhadorCriado = await responseTrabalhador.json();

    alert('Trabalhador cadastrado com sucesso!');
    document.getElementById('overlayModalTrabalhador').style.display = 'none';
    carregarTrabalhadores();
  } catch (error) {
    console.error('Erro ao cadastrar trabalhador:', error);
    alert(`Erro: ${error.message}`);
  }
}

//ver trabalhador
async function verTrabalhador(id) {
  trabalhadorSelecionadoId = id;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }
    const response = await fetch(`${API_URL}/trabalhadores/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const data = await response.json();

    const trabalhadorPessoaResponse = await fetch(
      `${API_URL}/pessoas/${data.pessoa}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const trabalhadorPessoaData = await trabalhadorPessoaResponse.json();

    const telefoneInput = trabalhadorPessoaData.telefone;
    telefoneMascara = telefoneInput.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3',
    );

    const usuarioCriadoraTrabalhadorResponse = await fetch(
      `${API_URL}/usuarios/${data.cadastradopor}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const usuarioCriadoraTrabalhadorData =
      await usuarioCriadoraTrabalhadorResponse.json();

    const pessoaCriadoraTrabalhadorResponse = await fetch(
      `${API_URL}/pessoas/${usuarioCriadoraTrabalhadorData.pessoa}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const pessoaCriadoraTrabalhadorData =
      await pessoaCriadoraTrabalhadorResponse.json();

    //Preenche o campo usuario ultima alteração
    let pessoaUsuarioUltimaAlteracao = { nome: 'sem registro' }; // valor padrão

    if (data.alteradopor) {
      const responseUsuarioUltimaAlteracao = await fetch(
        `${API_URL}/usuarios/${data.alteradopor}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (responseUsuarioUltimaAlteracao.ok) {
        const usuarioUltimaAlteracao =
          await responseUsuarioUltimaAlteracao.json();

        if (usuarioUltimaAlteracao.pessoa) {
          const responseUsuarioAlteracaoPessoa = await fetch(
            `${API_URL}/pessoas/${usuarioUltimaAlteracao.pessoa}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (responseUsuarioAlteracaoPessoa.ok) {
            pessoaUsuarioUltimaAlteracao =
              await responseUsuarioAlteracaoPessoa.json();
          }
        }
      }
    }

    const funcaoTrabalhadorResponse = await fetch(
      `${API_URL}/funcoes/${data.funcao}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const funcaoTrabalhador = await funcaoTrabalhadorResponse.json();

    const atribuicoesTrabalhadorResponse = await fetch(
      `${API_URL}/atribuicoes/${funcaoTrabalhador.id}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const atribuicoesTrabalhador = await atribuicoesTrabalhadorResponse.json();

    // Preencher os campos do modal com os dados do trabalhador
    document.getElementById('idTrabalhadorVisualizar').value = id;
    document.getElementById('nomeVisualizarTrabalhador').textContent =
      trabalhadorPessoaData.nome.toUpperCase();
    document.getElementById('telefoneVisualizarTrabalhador').textContent =
      telefoneMascara;
    document.getElementById(
      'datadenascimentoVisualizarTrabalhador',
    ).textContent = trabalhadorPessoaData.datadenascimento
      ? new Date(trabalhadorPessoaData.datadenascimento).toLocaleDateString(
          'pt-BR',
        )
      : 'sem registro';
    document.getElementById('criadoEmVisualizarTrabalhador').textContent =
      data.datacadastro
        ? new Date(data.datacadastro).toLocaleString('pt-BR')
        : 'sem registro';
    document.getElementById('criadoPorVisualizarTrabalhador').textContent =
      pessoaCriadoraTrabalhadorData.nome.toUpperCase() || 'sem registro';
    document.getElementById('atualizadoEmVisualizarTrabalhador').textContent =
      data.dataultimaalteracao
        ? new Date(data.dataultimaalteracao).toLocaleString('pt-BR')
        : 'sem registro';
    document.getElementById('atualizadoPorVisualizarTrabalhador').textContent =
      pessoaUsuarioUltimaAlteracao.nome.toUpperCase() || 'sem registro';
    document.getElementById('nomeFuncaoVisualizarTrabalhador').textContent =
      funcaoTrabalhador.nome || 'sem registro';
    const ul = document.getElementById('listaAtribuicoesTrabalhadorVisualizar');
    ul.innerHTML = '';
    if (atribuicoesTrabalhador.length === 0) {
      ul.innerHTML = '<li>Sem atribuições cadastradas.</li>';
    } else {
      atribuicoesTrabalhador.forEach((atribuicao) => {
        const li = document.createElement('li');
        li.innerHTML = `${atribuicao.nome} <span class="vDesktop">- ${atribuicao.descricao}</span>`;
        ul.appendChild(li);
        lucide.createIcons();
      });
    }
  } catch (error) {
    console.error('Erro ao buscar trabalhador:', error);
    alert(`Erro: ${error.message}`);
  }
}

//cadastrar usuário para o trabalhador
async function cadastrarUsuario(id) {
  trabalhadorSelecionadoId = id;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }
    const cadastradopor = JSON.parse(localStorage.getItem('user')).id;
    const trabalhador = await fetch(`${API_URL}/trabalhadores/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const trabalhadorData = await trabalhador.json();
    const pessoaId = trabalhadorData.pessoa;

    const nomeusuario = document.getElementById('nomeUsuario').value;
    const senhahash = document.getElementById('senhaUsuario').value;
    const pessoa = pessoaId;
    const nivelacesso = document.getElementById('nivelAcessoUsuario').value;

    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeusuario,
        senhahash,
        nivelacesso,
        pessoa,
        cadastradopor,
      }),
    });
    const result = await response.json();
    alert('Usuário criado com sucesso!');
    document.getElementById('modalCadastrarUsuario').style.display = 'none';
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    alert(`Erro: ${error.message}`);
  }
}

// Editar trabalhador
async function editarTrabalhador(id) {
  trabalhadorSelecionadoEditarId = id;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }
    const response = await fetch(`${API_URL}/trabalhadores/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const data = await response.json();

    const trabalhadorPessoaResponse = await fetch(
      `${API_URL}/pessoas/${data.pessoa}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const trabalhadorPessoaData = await trabalhadorPessoaResponse.json();
    const telefoneInput = trabalhadorPessoaData.telefone;
    telefoneMascara = telefoneInput.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3',
    );

    const dataDeNascimentoInput = trabalhadorPessoaData.datadenascimento;
    const dataDeNascimentoFormatada = dataDeNascimentoInput
      ? new Date(dataDeNascimentoInput).toISOString().split('T')[0]
      : '';

    //Traz a função atual do trabalhador
    const funcaoResponse = await fetch(`${API_URL}/funcoes/${data.funcao}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const funcaoData = await funcaoResponse.json();

    //Puxa todas as funções para preencher o select
    const funcaoSelect = document.getElementById('novaFuncaoTrabalhadorEditar');
    if (!funcaoSelect) {
      console.warn(
        'Elemento #novaFuncaoTrabalhadorEditar não encontrado nesta página.',
      );
      return;
    }

    const responseListaFuncoes = await fetch(`${API_URL}/funcoes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const funcoesLista = await responseListaFuncoes.json();
    funcaoSelect.innerHTML = `<option value="${funcaoData.id}">Selecione a função</option>`;

    funcoesLista.forEach((funcao) => {
      const option = document.createElement('option');
      option.value = funcao.id;
      option.textContent = funcao.nome;
      funcaoSelect.appendChild(option);
    });

    document.getElementById('idTrabalhadorEditar').value = id;
    document.getElementById('nomeTrabalhadorEditar').value =
      trabalhadorPessoaData.nome;
    document.getElementById('telefoneTrabalhadorEditar').value =
      telefoneMascara;
    document.getElementById('dataDeNascimentoTrabalhadorEditar').value =
      dataDeNascimentoFormatada;
    document.getElementById('funcaoTrabalhadorEditar').value = funcaoData.nome;
  } catch (error) {
    console.error('Erro ao buscar trabalhador para edição:', error);
    alert(`Erro: ${error.message}`);
  }
}

async function salvarEdicaoTrabalhador(id) {
  let trabalhadorSelecionadoEditarId = id;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    const responseTrabalhador = await fetch(
      `${API_URL}/trabalhadores/${trabalhadorSelecionadoEditarId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const trabalhadorData = await responseTrabalhador.json();

    const nomeAlterar = document.getElementById('nomeTrabalhadorEditar').value;
    const telefoneAlterar = document
      .getElementById('telefoneTrabalhadorEditar')
      .value.replace(/\D/g, '');

    const funcaoAlterar = document.getElementById(
      'novaFuncaoTrabalhadorEditar',
    ).value;
    const alteradopor = JSON.parse(localStorage.getItem('user')).id;

    let dataDeNascimentoAlterar = document.getElementById(
      'dataDeNascimentoTrabalhadorEditar',
    ).value;

    // Se vier vazio, manda null para não quebrar
    dataDeNascimentoAlterar = dataDeNascimentoAlterar
      ? dataDeNascimentoAlterar
      : null;

    const payloadPessoa = {
      nome: nomeAlterar,
      telefone: telefoneAlterar,
      datadenascimento: dataDeNascimentoAlterar,
      alteradopor: alteradopor,
    };

    // 1º PUT → alterar pessoa
    const responsePessoa = await fetch(
      `${API_URL}/pessoas/${trabalhadorData.pessoa}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadPessoa),
      },
    );

    if (!responsePessoa.ok) {
      throw new Error('Erro ao atualizar a pessoa.');
    }

    // 2º PUT → Alterar trabalhador
    const payloadTrabalhador = {
      funcao: funcaoAlterar,
      alteradopor: alteradopor,
    };
    const responseTrabalhadorEdicao = await fetch(
      `${API_URL}/trabalhadores/${trabalhadorSelecionadoEditarId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadTrabalhador),
      },
    );
    if (!responseTrabalhadorEdicao.ok) {
      alert('Erro ao atualizar o trabalhador.');
    }

    const result = await responseTrabalhadorEdicao.json();
    document.getElementById('overlayModalTrabalhadorEditar').style.display =
      'none';
    carregarTrabalhadores();
  } catch (error) {
    console.error('Erro ao salvar edição do trabalhador:', error);
    alert(`Erro: ${error.message}`);
  }
}
