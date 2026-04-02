(function () {
  function $(sel) {
    return document.querySelector(sel);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const message = $('#adminAccessMessage');
    if (!message) return;

    if (params.get('error') === '1') {
      message.textContent = "Don't be sneaky brat , Grandpa protects this site";
      message.classList.add('admin-warning');
      return;
    }

    if (params.get('logged_out') === '1') {
      message.textContent = 'You have been logged out.';
      return;
    }

    message.textContent = 'Authorized team members only.';
  });
})();
