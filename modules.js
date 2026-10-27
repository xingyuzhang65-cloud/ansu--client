(() => {
  const routes = {
    '#waybill': { name: '运单管理' },
    '#overseas-storage': { name: '暂存管理', view: 'storage' },
    '#instruction-list': { name: '指令列表', view: 'instructions' }
  };
  const originalNavigate = navigate;
  const frame = document.querySelector('#overseas-frame');
  const host = document.querySelector('#overseas-view');
  const loading = document.querySelector('#module-loading');
  const loadingText = document.querySelector('#module-loading-text');
  const retry = document.querySelector('#module-retry');
  let activeHash = '', loadedHash = '', readyTimer;

  function loadModule(hash) {
    const route = routes[hash];
    loadedHash = hash;
    loading.hidden = false;
    loading.classList.remove('failed');
    loadingText.textContent = `正在加载${route.name}…`;
    retry.hidden = true;
    host.setAttribute('aria-busy', 'true');
    frame.title = route.name;
    frame.src = `./overseas-app/index.html?view=${route.view}&v=nsu-20261026${hash}`;
    clearTimeout(readyTimer);
    readyTimer = setTimeout(() => {
      if (activeHash !== hash) return;
      loading.classList.add('failed');
      loadingText.textContent = '页面加载失败，请重试';
      retry.hidden = false;
      host.setAttribute('aria-busy', 'false');
    }, 20000);
  }

  function ensureTab(route) {
    let tab = [...document.querySelectorAll('[data-workspace]')].find(b => b.dataset.workspace === route.name);
    if (!tab) {
      tab = document.createElement('button');
      tab.dataset.workspace = route.name;
      const label = document.createTextNode(route.name + ' ');
      const close = document.createElement('span');
      close.className = 'tab-close';
      close.textContent = '×';
      tab.append(label, close);
      document.querySelector('.workspace-tabs').append(tab);
    }
    document.querySelectorAll('[data-workspace]').forEach(b => b.classList.toggle('active', b === tab));
    tab.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }

  function renderRoute(hash) {
    const route = routes[hash];
    if (!route) return;
    activeHash = hash;
    document.title = `${route.name} · NSU 安速物流`;
    document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === route.name));
    ensureTab(route);
    document.querySelector('#waybill-view').hidden = !!route.view;
    host.hidden = !route.view;
    document.body.classList.toggle('overseas-active', !!route.view);
    if (route.view && loadedHash !== hash) loadModule(hash);
  }

  function go(hash) {
    if (location.hash === hash) renderRoute(hash);
    else location.hash = hash;
  }

  navigate = function(name) {
    const entry = Object.entries(routes).find(([, route]) => route.name === name);
    if (entry) { go(entry[0]); return; }
    originalNavigate(name);
  };

  document.querySelector('.workspace-tabs').addEventListener('click', event => {
    const tab = event.target.closest('[data-workspace]');
    if (!tab) return;
    const entry = Object.entries(routes).find(([, route]) => route.name === tab.dataset.workspace);
    if (!entry) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.target.closest('.tab-close')) {
      if (entry[0] === '#waybill') { toast('运单管理为默认工作页'); return; }
      tab.remove();
      if (activeHash === entry[0]) go('#waybill');
    } else go(entry[0]);
  }, true);

  window.addEventListener('hashchange', () => renderRoute(routes[location.hash] ? location.hash : '#waybill'));
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'tiantu-overseas-ready' && event.data.view === loadedHash) {
      clearTimeout(readyTimer);
      loading.hidden = true;
      host.setAttribute('aria-busy', 'false');
    }
    if (event.data?.type === 'nsu-overseas-route' && routes[event.data.view]?.view && event.data.view !== activeHash) go(event.data.view);
  });
  retry.onclick = () => loadModule(activeHash);
  renderRoute(routes[location.hash] ? location.hash : '#waybill');
})();
