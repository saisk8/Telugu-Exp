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

  document.getElementById('next').addEventListener('click', () => {
    window.location.href = '/exp';
  });

  function fillData(doc) {
    document.getElementById('staticEmail').value = doc.user;
    document.getElementById('unique').value = doc.short;
    document.getElementById('completion').value = doc.numberOfCompletedSets;
    document.getElementById('Remaining').value = 10 - doc.numberOfCompletedSets;
    if (+document.getElementById('completion').value === 10)
      document.getElementById('next').setAttribute('disabled', 'disabled');
  }

  function getData() {
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
  }
  getData();
};
