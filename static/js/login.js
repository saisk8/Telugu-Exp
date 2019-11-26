/* eslint-disable no-console */
/* eslint-disable no-undef */
function login() {
  const user = document.getElementById('username');
  if (!user.value) {
    user.classList.add('is-invalid');
    return;
  }
  axios
    .post('/login-val', {
      user
    })
    .then(response => {
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

window.onload = () => {
  document.getElementById('login').addEventListener('click', login, false);
};
