document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  let currentSection = 'home'; // ← NOVA (rastreia seção)

  // Check authentication
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userStr || !token) {
    window.location.href = 'index.html';
    return;
  }
  //JSON.parse(userStr);
  const dadosDoUsuario = fetch(
    'https://raizesdefe.com.br/api/pessoa:${userStr.id}',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const nomeUsuario = document.getElementById('NomeUsuario');

  const nomeCompleto = dadosDoUsuario.nome;

  if (nomeUsuario) {
    nomeUsuario.textContent = getFirstName(nomeCompleto);
  }

  function getFirstName(dado) {
    // Remove espaços em branco no início e no fim da string
    const nomeLimpo = dado ? dado.trim() : '';
    // Divide a string por um ou mais espaços em branco, ignorando múltiplos espaços
    const partes = nomeLimpo.split(/\s+/);
    // Retorna a primeira parte não vazia (primeiro nome)
    // Para nomes compostos como "Maria da Conceição", pega "Maria"
    // Para nome único como "João", retorna "João"
    // Lida com espaços extras e strings vazias
    return partes[0] || 'Anônimo';
  }

  // Mapeamento de seções para arquivos HTML externos (crie esses arquivos na mesma pasta)
  const contentsUrls = {
    atendimentos: 'pages/atendimentos.html',
    tratamentos: 'pages/tratamentos.html',
    trabalhadores: 'pages/trabalhadores.html',
    pessoas: 'pages/pessoas.html',
    usuarios: 'pages/usuarios.html',
    guias: 'pages/guias.html',
    consulentes: 'pages/consulentes.html',
    gerenciamento: 'pages/gerenciamento.html',
    itens: 'pages/itens.html',
    funcoes: 'pages/funcoes.html',
  };

  // Função para mostrar conteúdo carregado via fetch (substitui a versão estática)
  async function showContent(section) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Estado de loading (spinner simples)
    mainContent.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Carregando ${section}...</p>
    </div>
  `;

    try {
      const url = contentsUrls[section];
      if (!url) {
        throw new Error(`Seção "${section}" não mapeada.`);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const htmlContent = await response.text();
      mainContent.innerHTML = htmlContent;
      currentSection = section;
      if (section === 'funcoes' && window.initFuncoes) {
        window.initFuncoes();
      }
      lucide.createIcons();

      // Opcional: scripts inline nos arquivos HTML carregados (execute-os)
      const scripts = mainContent.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });
    } catch (error) {
      mainContent.innerHTML = `
      <div class="content-section error">
        <h2>Erro ao carregar</h2>
        <p>Não foi possível carregar "${section}". Verifique a conexão ou arquivo.</p>
        <details>
          <summary>Detalhes do erro</summary>
          <pre>${error.message}</pre>
        </details>
      </div>
    `;
    }

    // Close sidebar after navigation (good for mobile)
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
    }
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  // Menu toggle
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('open');
      }
    });
  }

  // SINGLE event listener on sidebar for submenus (.parent) and navigation (data-section)
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', function (e) {
      // Handle submenu toggle for .parent (ul > li > a.parent + ul.submenu)
      if (e.target.classList.contains('parent')) {
        e.preventDefault();
        const submenu = e.target.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
          submenu.classList.toggle('open');
        }
        return;
      }

      // Handle navigation for links with data-section
      const link = e.target.closest('a[data-section]');
      if (link) {
        e.preventDefault();
        showContent(link.dataset.section);
      }
    });
  }

  window.refreshCurrentContent = function () {
    showContent(currentSection);
  };

  document
    .getElementById('main-content')
    .addEventListener('click', function (e) {
      if (e.target.closest('#reload')) {
        e.preventDefault();
        window.refreshCurrentContent();
      }
    });
});
