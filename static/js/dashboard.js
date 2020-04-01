/* eslint-disable no-undef */
window.onload = () => {
  let apiHost = '';
  if (window.location.hostname === 'localhost')
    apiHost = `${window.location.protocol}//${window.location.hostname}:3001/api`;
  else apiHost = `${window.location.protocol}//${window.location.hostname}/api`;

  const user = window.localStorage.getItem('telugu-exp-user');
  if (!window.localStorage.getItem('telugu-exp-user')) {
    window.location.href = '/';
  }

  function fillData(doc) {
    document.getElementById('staticEmail').value = doc.user;
    document.getElementById('unique').value = doc.short;
    document.getElementById('completion').value = doc.numberOfCompletedSets;
    document.getElementById('Remaining').value = 10 - doc.numberOfCompletedSets;
    const next = document.getElementById('next');
    if (+document.getElementById('completion').value === 10)
      next.setAttribute('disabled', 'disabled');
    else
      next.addEventListener('click', () => {
        window.location.href = '/exp';
      });
  }

  axios
    .get(`${apiHost}/dashboard/${user}`)
    .then(response => {
      if (response.data) {
        fillData(response.data);
      }
    })
    .catch(error => {
      throw error;
    });
};
