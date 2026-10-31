const releasePage = 'https://github.com/dxpdeagle/helix-drive/releases/latest';
const fallbackDownload = 'https://github.com/dxpdeagle/helix-drive/releases/latest/download/Helix-Setup.exe';

document.querySelectorAll('[data-download]').forEach((link) => { link.href = fallbackDownload; });
document.querySelector('[data-year]').textContent = String(new Date().getFullYear());

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
});

fetch('https://api.github.com/repos/dxpdeagle/helix-drive/releases/latest', {
  headers: { Accept: 'application/vnd.github+json' },
})
  .then((response) => { if (!response.ok) throw new Error('Release lookup unavailable'); return response.json(); })
  .then((release) => {
    const installer = release.assets?.find((asset) => asset.name === 'Helix-Setup.exe')
      ?? release.assets?.find((asset) => /^Helix-Setup-.*\.exe$/i.test(asset.name));
    if (!installer || !installer.browser_download_url.startsWith('https://github.com/dxpdeagle/helix-drive/releases/download/')) return;
    document.querySelectorAll('[data-download]').forEach((link) => { link.href = installer.browser_download_url; });
  })
  .catch(() => {
    document.querySelectorAll('[data-download]').forEach((link) => { link.href = releasePage; });
  });
