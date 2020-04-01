/* eslint-disable no-undef */
window.onload = () => {
  let apiHost = '';
  if (window.location.hostname === 'localhost')
    apiHost = `${window.location.protocol}//${window.location.hostname}:3001/api`;
  else apiHost = `${window.location.protocol}//${window.location.hostname}/api`;

  function validateEmail(emailField) {
    const matchString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return matchString.test(emailField);
  }

  function login() {
    const user = document.getElementById('username');
    if (!validateEmail(user.value)) {
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
        throw error;
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
