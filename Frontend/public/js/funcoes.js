function initFuncoes() {
  listarFuncoes();
}

//Carega a lista de funções cadastradas
async function listarFuncoes() {
  const funcoesList = document.getElementById('funcoesLista');
  if (!funcoesList) {
    console.error('Elemento #funcoesLista não encontrado.');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    funcoesList.innerHTML = 'Token não encontrado.';
    return;
  }
  try {
    const response = await fetch(`${API_URL}/funcoes`, {
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

    funcoesList.innerHTML = '';

    if (!Array.isArray(data)) {
      throw new Error('A API não retornou uma lista válida.');
    }

    if (data.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="7">Nenhuma função encontrada.</td>';
      funcoesList.appendChild(row);
      return;
    }

    for (const funcao of data) {
      // Buscar dados da pessoa responsável pela última alteração ou cadastro
      const responseUsuario = await fetch(
        `${API_URL}/usuarios/${funcao.alteradopor || funcao.cadastradopor}`,
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

      const row = document.createElement('tr');
      row.innerHTML = `
    <td>${funcao.nome ?? ''}</td>
    <td class="vDesktop">${funcao.descricao ?? ''}</td>
    <td class="vDesktop">${
      funcao.dataultimaalteracao
        ? new Date(funcao.dataultimaalteracao).toLocaleString('pt-BR')
        : new Date(funcao.datacadastro).toLocaleString('pt-BR')
    }</td>
    <td class="vDesktop">${pessoaUsuario.nome}</td>
    <td>
      <button id="verFuncao" class="btn-default" onclick="verFuncao('${funcao.id}')">
        <i data-lucide="eye"></i>Visualizar
      </button>
    </td>
    <td>
      <button id="editarFuncao" class="btn-default" onclick="editarFuncao('${funcao.id}')">
        <i data-lucide="pencil"></i>Editar
      </button>
    </td>
    <td>
      <button id="excluirFuncao" class="btn-default" onclick="excluirFuncao('${funcao.id}')">
        <i data-lucide="trash-2"></i>Excluir
      </button>
    </td>
  `;
      funcoesList.appendChild(row);
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Erro ao carregar funções:', error);
    funcoesList.innerHTML = `${error.message}`;
  }
}

// Abrir o modal de cadastro
// Seleciona elementos
const container = document.getElementById('main-content');

// Função para abrir modal
container.addEventListener('click', (event) => {
  const btn = event.target.closest(
    '#create, #editarFuncao, #verFuncao, #adicionarAtribuicao, #btnAdicionarAtribuicaoAFuncao, #btnSalvarModalAtributos, #btnRemoverAtribuicao',
  );

  if (btn) {
    if (btn.id === 'create') {
      document.getElementById('overlayModalFuncao').style.display = 'flex';
    } else if (btn.id === 'editarFuncao') {
      document.getElementById('overlayModalFuncaoEditar').style.display =
        'flex';
    } else if (btn.id === 'verFuncao') {
      document.getElementById('overlayModalFuncaoVisualizar').style.display =
        'flex';
    } else if (btn.id === 'adicionarAtribuicao') {
      document.getElementById('modalAtributos').style.display = 'flex';
      listarAtribuicoesExistentes();
    } else if (btn.id === 'btnSalvarModalAtributos') {
      criarAtribuicaoParaFuncao();
    } else if (btn.id === 'btnRemoverAtribuicao') {
      const id = btn.getAttribute('data-id');
      removerAtribuicaoDaFuncao(id);
    }
  }
});

// Função para fechar modal
container.addEventListener('click', (event) => {
  const btn = event.target.closest(
    '#btnFecharModalFuncao, #btnCancelarModalFuncao, #btnFecharModalEditarFuncao, #btnCancelarModalEditarFuncao, #btnFecharModalVisualizarFuncao, #btnFecharModalAtributos, #btnCancelarModalAtributos',
  );
  if (btn) {
    if (
      btn.id === 'btnFecharModalFuncao' ||
      btn.id === 'btnCancelarModalFuncao'
    ) {
      document.getElementById('overlayModalFuncao').style.display = 'none';
    } else if (
      btn.id === 'btnFecharModalEditarFuncao' ||
      btn.id === 'btnCancelarModalEditarFuncao'
    ) {
      document.getElementById('overlayModalFuncaoEditar').style.display =
        'none';
    } else if (btn.id === 'btnFecharModalVisualizarFuncao') {
      document.getElementById('overlayModalFuncaoVisualizar').style.display =
        'none';
    } else if (
      btn.id === 'btnFecharModalAtributos' ||
      btn.id === 'btnCancelarModalAtributos'
    ) {
      document.getElementById('modalAtributos').style.display = 'none';
    }
  }
});

// Fecha modal clicando fora dele (overlay)
container.addEventListener('click', function (event) {
  const overlayFuncao = document.getElementById('overlayModalFuncao');
  if (overlayFuncao && event.target === overlayFuncao) {
    overlayFuncao.style.display = 'none';
  }
  const overlayEditar = document.getElementById('overlayModalFuncaoEditar');
  if (overlayEditar && event.target === overlayEditar) {
    overlayEditar.style.display = 'none';
  }
  const overlayVisualizar = document.getElementById(
    'overlayModalFuncaoVisualizar',
  );
  if (overlayVisualizar && event.target === overlayVisualizar) {
    overlayVisualizar.style.display = 'none';
  }
  const modalAtributosEl = document.getElementById('modalAtributos');
  if (modalAtributosEl && event.target === modalAtributosEl) {
    modalAtributosEl.style.display = 'none';
  }
});

//Funcoes
// Cadastrar função
async function cadastrarFuncao() {
  const nome = document.getElementById('nomeFuncao').value.trim();
  const descricao = document.getElementById('descricaoFuncao').value.trim();
  const cadastradopor = JSON.parse(localStorage.getItem('user')).id;
  const datacadastro = new Date().toISOString();

  if (!nome) {
    alert('O campo "Nome" é obrigatório.');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/funcoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, descricao, cadastradopor, datacadastro }),
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const data = await response.json();
    alert('Função cadastrada com sucesso!');
    document.getElementById('overlayModalFuncao').style.display = 'none';
    listarFuncoes();
  } catch (error) {
    console.error('Erro ao cadastrar função:', error);
    alert(`Erro: ${error.message}`);
  }
}

container.addEventListener('click', (event) => {
  if (event.target.id === 'btnCadastrarModalFuncao') {
    cadastrarFuncao();
  }
});

// Editar função
async function editarFuncao(id) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/funcoes/${id}`, {
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
    // Preencher os campos do modal com os dados da função
    document.getElementById('idFuncaoEditar').value = id;
    document.getElementById('nomeFuncaoEditar').value = data.nome;
    document.getElementById('descricaoFuncaoEditar').value = data.descricao;
  } catch (error) {
    console.error('Erro ao buscar função:', error);
    alert(`Erro: ${error.message}`);
  }
}

async function salvarEdicaoFuncao(id) {
  const nome = document.getElementById('nomeFuncaoEditar').value.trim();
  const descricao = document
    .getElementById('descricaoFuncaoEditar')
    .value.trim();
  const alteradopor = JSON.parse(localStorage.getItem('user')).id;
  const dataultimaalteracao = new Date().toISOString();
  if (!nome) {
    alert('O campo "Nome" é obrigatório.');
    return;
  }
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/funcoes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        descricao,
        alteradopor,
        dataultimaalteracao,
      }),
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const data = await response.json();
    alert('Função atualizada com sucesso!');
    document.getElementById('overlayModalFuncaoEditar').style.display = 'none';
    listarFuncoes();
  } catch (error) {
    console.error('Erro ao atualizar função:', error);
    alert(`Erro: ${error.message}`);
  }
}

container.addEventListener('click', (event) => {
  const btn = event.target.closest('#btnSalvarModalEditarFuncao');

  if (btn) {
    const id = document.getElementById('idFuncaoEditar').value;
    salvarEdicaoFuncao(id);
  }
});

// ver função
//Preenche os detalhes da função no modal de visualização
async function verFuncao(id) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/funcoes/${id}`, {
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
    //Preenche o campo usuario cadastro
    const responseUsuarioCadastro = await fetch(
      `${API_URL}/usuarios/${data.cadastradopor}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let usuarioCadastro = {};
    if (responseUsuarioCadastro.ok) {
      usuarioCadastro = await responseUsuarioCadastro.json();
    }

    const responseUsuarioPessoa = await fetch(
      `${API_URL}/pessoas/${usuarioCadastro.pessoa}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let pessoaUsuarioCadastro = {};
    if (responseUsuarioPessoa.ok) {
      pessoaUsuarioCadastro = await responseUsuarioPessoa.json();
    }

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

    // Preencher os campos do modal com os dados da função
    document.getElementById('idFuncaoVisualizar').value = id;
    document.getElementById('nomeVisualizarFuncao').textContent = data.nome;
    document.getElementById('descricaoVisualizarFuncao').textContent =
      data.descricao;
    document.getElementById('criadoEmVisualizarFuncao').textContent = new Date(
      data.datacadastro,
    ).toLocaleString('pt-BR');
    document.getElementById('criadoPorVisualizarFuncao').textContent =
      pessoaUsuarioCadastro.nome;
    document.getElementById('atualizadoEmVisualizarFuncao').textContent =
      data.dataultimaalteracao
        ? new Date(data.dataultimaalteracao).toLocaleString('pt-BR')
        : 'sem registro';
    document.getElementById('atualizadoPorVisualizarFuncao').textContent =
      pessoaUsuarioUltimaAlteracao.nome || 'sem registro';
  } catch (error) {
    console.error('Erro ao buscar função:', error);
    alert(`Erro: ${error.message}`);
  }

  //listar atribuições da função
  try {
    const response = await fetch(`${API_URL}/atribuicoes/${id}`, {
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
    // Processar os dados das atribuições
    const ul = document.getElementById('listaAtribuicoesVisualizarFuncao');
    ul.innerHTML = '';
    if (data.length === 0) {
      ul.innerHTML = '<li>Sem atribuições cadastradas.</li>';
    } else {
      data.forEach((atribuicao) => {
        const li = document.createElement('li');
        li.innerHTML = `${atribuicao.nome} <span class="vDesktop">- ${atribuicao.descricao}</span> <button id="btnRemoverAtribuicao" data-id="${atribuicao.id}" class="btn-default"><i data-lucide="trash-2"></i> Remover</button>`;
        ul.appendChild(li);
        lucide.createIcons();
      });
    }
  } catch (error) {
    console.error('Erro ao buscar atribuições:', error);
    alert(`Erro: ${error.message}`);
  }

  //listar trabalhadores da função
  try {
    const response = await fetch(`${API_URL}/trabalhadores/funcao/${id}`, {
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

    const responseTrabalhadorPessoa = await fetch(
      `${API_URL}/pessoas/${data[0].pessoa}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let pessoaTrabalhador = {};
    if (responseTrabalhadorPessoa.ok) {
      pessoaTrabalhador = await responseTrabalhadorPessoa.json();
    }
    // Processar os dados dos trabalhadores
    const ul = document.getElementById('listaTrabalhadoresVisualizarFuncao');
    ul.innerHTML = '';
    if (data.length === 0) {
      ul.innerHTML = '<li>Sem trabalhadores cadastrados para esta função.</li>';
    } else {
      data.forEach((trabalhador) => {
        const li = document.createElement('li');
        li.innerHTML = `${pessoaTrabalhador.nome}`;
        ul.appendChild(li);
        lucide.createIcons();
      });
    }
  } catch (error) {
    console.error('Erro ao buscar trabalhadores:', error);
    alert(`Erro: ${error.message}`);
  }
}

//Excluir função
async function excluirFuncao(id) {
  if (!confirm('Tem certeza que deseja excluir esta função?')) {
    return;
  }
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/atribuicoes/funcao/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao excluir as atribuições dessa função:', error);
    alert(`Erro: ${error.message}`);
  }

  try {
    const response = await fetch(`${API_URL}/funcoes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    alert(
      'A função, e todas as suas atribuições, foram excluídas com sucesso!',
    );
    listarFuncoes();
  } catch (error) {
    console.error('Erro ao excluir função:', error);
    alert(`Erro: ${error.message}`);
  }
}

//Atribuicoes
//Listar atribuições existentes
async function listarAtribuicoesExistentes() {
  const atribuicoesList = document.getElementById('atribuicoesExistentes');
  if (!atribuicoesList) {
    console.error('Elemento #atribuicoesExistentes não encontrado.');
    return;
  }

  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/atribuicoes`, {
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

    atribuicoesList.innerHTML = '';

    if (data.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="2">Nenhuma atribuição encontrada.</td>';
      atribuicoesList.appendChild(row);
      return;
    }

    data.forEach((atribuicao) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${atribuicao.nome}</td>
      <td>
        <button id="btnAdicionarAtribuicaoAFuncao" class="btn-default"
          data-nome="${atribuicao.nome}"
          data-descricao="${atribuicao.descricao}">
          <i data-lucide="plus"></i>
        </button>
      </td>
      `;
      atribuicoesList.appendChild(row);
      lucide.createIcons();
    });

    // delegação de evento
    atribuicoesList.addEventListener('click', async (event) => {
      const btn = event.target.closest('#btnAdicionarAtribuicaoAFuncao');
      if (btn) {
        const nome = btn.getAttribute('data-nome');
        const descricao = btn.getAttribute('data-descricao');
        await adicionarAtribuicaoAFuncao(nome, descricao);
      }
    });

    //Adicionar atribuição à função
    async function adicionarAtribuicaoAFuncao(nome, descricao) {
      const funcao = document.getElementById('idFuncaoVisualizar').value;
      const cadastradopor = JSON.parse(localStorage.getItem('user')).id;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/atribuicoes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, descricao, funcao, cadastradopor }),
        });

        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

        alert('Atribuição adicionada à função com sucesso!');
        document.getElementById('modalAtributos').style.display = 'none';
        verFuncao(funcao);
      } catch (error) {
        console.error('Erro ao adicionar atribuição à função:', error);
        alert(`Erro: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar atribuições:', error);
    alert(`Erro: ${error.message}`);
  }
}

//Criar atribuição para função
async function criarAtribuicaoParaFuncao() {
  const funcao = document.getElementById('idFuncaoVisualizar').value;
  const nome = document.getElementById('nomeAtribuicao').value.trim();
  const descricao = document.getElementById('descricaoAtribuicao').value.trim();
  const cadastradopor = JSON.parse(localStorage.getItem('user')).id;

  try {
    const response = await fetch(`${API_URL}/atribuicoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nome,
        descricao,
        funcao,
        cadastradopor,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const data = await response.json();
    alert('Atribuição criada com sucesso!');
    document.getElementById('modalAtributos').style.display = 'none';
    verFuncao(funcao); // Atualiza a visualização da função para mostrar a nova atribuição
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

//remover atribuição da função
async function removerAtribuicaoDaFuncao(id) {
  if (!confirm('Tem certeza que deseja remover esta atribuição da função?')) {
    return;
  }
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/atribuicoes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    alert('Atribuição removida da função com sucesso!');
    const funcao = document.getElementById('idFuncaoVisualizar').value;
    verFuncao(funcao);
  } catch (error) {
    console.error('Erro ao remover atribuição da função:', error);
    alert(`Erro: ${error.message}`);
  }
}

window.initFuncoes = initFuncoes;
