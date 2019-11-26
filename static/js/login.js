/* eslint-disable no-console */
/* eslint-disable no-undef */
window.onload = () => {
  function login() {
    const user = document.getElementById('username');
    console.log(user.value);
    if (!user.value) {
      user.classList.add('is-invalid');
      return;
    }
    axios
      .post('/login-val', {
        user: user.value
      })
      .then(response => {
        console.log(response.data.status);
        if (response.data.status) {
          window.localStorage.setItem('telugu-exp-user', user);
          window.location.href = '/instructions';
        } else {
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
};
