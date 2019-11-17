// eslint-disable-next-line no-undef
function login() {
  const user = document.getElementById('username').value;
  axios
    .post('/login', {
      user,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = () => {
  document.getElementById('login').addEventListener('click', login, false);
};
