document.addEventListener('DOMContentLoaded', () => {
  // 要素の取得
  const sideNav = document.querySelector('.side-nav');
  const notificationArea = document.querySelector('.notification-area');
  const overlay = document.querySelector('.overlay');
  const menuButton = document.createElement('button');
  const notificationButton = document.createElement('button');

  // メニューボタンの設定
  menuButton.className = 'menu-button';
  menuButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;
  document.querySelector('.header').insertBefore(menuButton, document.querySelector('.logo'));

  // お知らせボタンの設定
  notificationButton.className = 'notification-button';
  notificationButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
    <span class="notification-badge">2</span>
  `;
  document.querySelector('.header').insertBefore(notificationButton, document.querySelector('.header-right'));

  // メディアクエリの設定
  const mediaQuery = window.matchMedia('(max-width: 1024px)');

  // サイドナビの表示制御
  function toggleSideNav() {
    const isVisible = sideNav.classList.contains('is-visible');
    sideNav.classList.toggle('is-visible');
    
    if (mediaQuery.matches) {
      overlay.classList.toggle('is-visible');
      document.body.style.overflow = isVisible ? '' : 'hidden';
    }
  }

  // お知らせエリアの表示制御
  function toggleNotificationArea() {
    const isVisible = notificationArea.classList.contains('is-visible');
    notificationArea.classList.toggle('is-visible');
    overlay.classList.toggle('is-visible');
    document.body.style.overflow = isVisible ? '' : 'hidden';
  }

  // イベントリスナーの設定
  menuButton.addEventListener('click', toggleSideNav);
  notificationButton.addEventListener('click', toggleNotificationArea);
  overlay.addEventListener('click', () => {
    if (sideNav.classList.contains('is-visible')) {
      toggleSideNav();
    }
    if (notificationArea.classList.contains('is-visible')) {
      toggleNotificationArea();
    }
  });

  // メディアクエリの変更を監視
  mediaQuery.addEventListener('change', (e) => {
    if (!e.matches) {
      sideNav.classList.remove('is-visible');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  });

  // ESCキーでパネルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sideNav.classList.contains('is-visible')) {
        toggleSideNav();
      }
      if (notificationArea.classList.contains('is-visible')) {
        toggleNotificationArea();
      }
    }
  });
}); 