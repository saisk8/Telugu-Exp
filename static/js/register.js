/* eslint-disable no-undef */
// Example starter JavaScript for disabling form submissions if there are invalid fields

window.onload = () => {
  let apiHost = '';
  if (window.location.hostname === 'localhost')
    apiHost = `${window.location.protocol}//${window.location.hostname}:3001/api`;
  else apiHost = `${window.location.protocol}//${window.location.hostname}/api`;

  const languages = [];

  function checkboxValidate(boxes, checkedBoxes) {
    if (checkedBoxes.length === 0) {
      boxes.forEach(element => element.classList.add('is-invalid'));
      return false;
    }
    return true;
  }

  function removeLanguage() {
    if (languages.length === 0) return;
    languages.pop();
    const parent = document.getElementById('languages');
    parent.removeChild(parent.lastChild);
  }

  function addLanguage() {
    const boxes = document.querySelectorAll(`input[type=checkbox]`);
    const checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
    const lang = document.getElementById('language');
    const name = lang.options[lang.selectedIndex].value;
    if (!lang) name.classList.add('is-invalid');
    let attr = '';
    if (checkboxValidate(boxes, checkedBoxes) === false) return;
    for (let i = 0; i < checkedBoxes.length; i += 1) {
      if (checkedBoxes[i].value === 'on') attr += ` ${checkedBoxes[i].id}`;
    }
    attr = attr.trim();
    languages.push({
      name,
      attr
    });
    const parent = document.getElementById('languages');
    const newElement = document.createElement('li');
    newElement.innerHTML = `${name}: ${attr.trim()}`;
    parent.appendChild(newElement);
    boxes.forEach(element => {
      element.classList.remove('is-invalid');
      if (element.checked) element.click();
    });
    lang.classList.remove('is-invalid');
  }

  function validateForm(event) {
    let isValid = true;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      isValid = true;
      return;
    }
    if (isValid) form.classList.add('was-validated');
    const user = document.getElementById('user').value;
    const read = document.querySelector('input[name="inlineRadioOptions-read"]:checked').value;
    const write = document.querySelector('input[name="inlineRadioOptions-write"]:checked').value;
    const speak = document.querySelector('input[name="inlineRadioOptions-speak"]:checked').value;
    axios
      .post(`${apiHost}/add-user`, {
        user,
        read,
        write,
        speak,
        languages
      })
      .then(response => {
        if (response.data.status) {
          window.localStorage.setItem('telugu-exp-user', user);
          window.location.href = '/dashboard';
        }
      })
      .catch(error => {
        throw error;
      });
  }

  function validateEmail(emailField) {
    const matchString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return matchString.test(emailField);
  }

  function validateUser(event) {
    const user = event.target.value;
    axios
      .post(`${apiHost}/login-val`, {
        user
      })
      .then(response => {
        document.getElementById('user').classList.remove('is-invalid', 'is-valid');
        if (!user || !validateEmail(user) || response.data.status) {
          document.getElementById('user').classList.add('is-invalid');
        } else {
          document.getElementById('user').classList.add('is-valid');
        }
      })
      .catch(error => {
        throw error;
      });
  }

  function addEventListeners() {
    const forms = document.getElementsByClassName('needs-validation');
    document.getElementById('add').addEventListener('click', addLanguage, false);
    document.getElementById('remove').addEventListener('click', removeLanguage, false);
    document.getElementById('submit').addEventListener('click', validateForm, false);
    document.getElementById('user').addEventListener('input', validateUser, false);
    Array.prototype.filter.call(forms, form => {
      form.addEventListener('submit', validateForm, false);
    });
  }

  addEventListeners();
  document.getElementById('user').value = window.localStorage.getItem('telugu-exp-temp-user');
  window.localStorage.removeItem('telugu-exp-temp-user');
};
