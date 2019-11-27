/* eslint-disable no-undef */
/* eslint-disable no-console */
window.onload = () => {
  document.getElementById('continue').addEventListener('click', () => {
    window.location.href = '/exp';
  });
  document.getElementById('logout').addEventListener('click', () => {
    window.localStorage.removeItem('telugu-exp-user');
    window.location.href = '/login';
  });
};
