(() => {
  const allowed = new Set(['#overseas-storage', '#instruction-list']);
  const announce = () => {
    if (!allowed.has(location.hash)) return;
    document.title = `${location.hash === '#instruction-list' ? '指令列表' : '暂存管理'} · NSU 安速物流`;
    parent.postMessage({type: 'nsu-overseas-route', view: location.hash}, location.origin);
  };
  const replaceState = history.replaceState.bind(history);
  history.replaceState = function(...args) { const result = replaceState(...args); announce(); return result; };
  window.addEventListener('hashchange', announce);
  window.addEventListener('error', () => {
    parent.postMessage({type: 'nsu-overseas-error', view: location.hash}, location.origin);
  });
  announce();
})();
