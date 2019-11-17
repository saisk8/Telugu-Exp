/* eslint-disable no-console */
/* eslint-disable no-undef */
function login() {
  const user = document.getElementById('username').value;
  axios
    .post('/login-val', {
      user,
    })
    .then((response) => {
      if (response.data.status) {
        window.localStorage.setItem('user', user);
        window.location.href = '/exp';
      } else {
        window.location.href = '/register';
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = () => {
  document.getElementById('login').addEventListener('click', login, false);
};
