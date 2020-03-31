/* eslint-disable no-console */
/* eslint-disable no-undef */
window.onload = () => {
  const apiHost = `${window.location.protocol}//${window.location.hostname}:3001`;
  function login() {
    const user = document.getElementById('username');
    console.log(user.value);
    if (!user.value) {
      user.classList.add('is-invalid');
      return;
    }
    axios
      .post(`${apiHost}/login-val`, {
        user: user.value
      })
      .then(response => {
        if (response.data.status) {
          window.localStorage.setItem('telugu-exp-user', user.value);
          window.location.href = '/instructions';
        } else {
          window.localStorage.setItem('telugu-exp-temp-user', user.value);
          window.location.href = '/register';
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  const loginButton = document.getElementById('login');
  loginButton.addEventListener('click', login, false);
  document.querySelector('form').addEventListener('keypress', event => {
    if (event.keyCode === 13) loginButton.click();
  });
  document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
  });
};
