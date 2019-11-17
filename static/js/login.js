// eslint-disable-next-line no-undef
$(document).ready(() => {
  function login() {
    const user = document.getElementById('username').nodeValue;
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/login',
      data: user,
      success: (data) => {
        // eslint-disable-next-line no-console
        console.log(data);
      },
    });
  }
});
