/* eslint-disable no-undef */
// Example starter JavaScript for disabling form submissions if there are invalid fields

window.onload = () => {
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
    const name = document.getElementById('language');
    if (!name.value) name.classList.add('is-invalid');
    let attr = '';
    if (checkboxValidate(boxes, checkedBoxes) === false) return;
    for (let i = 0; i < checkedBoxes.length; i += 1) {
      if (checkedBoxes[i].value === 'on') attr += ` ${checkedBoxes[i].id}`;
    }
    attr = attr.trim();
    languages.push({
      name: name.value,
      attr: attr.trim()
    });
    const parent = document.getElementById('languages');
    const newElement = document.createElement('li');
    newElement.innerHTML = `${name.value}: ${attr.trim()}`;
    parent.appendChild(newElement);
    console.log(languages);
    boxes.forEach(element => {
      element.classList.remove('is-invalid');
      if (element.checked) element.click();
    });
    name.classList.remove('is-invalid');
    name.value = '';
  }

  function validateForm(event) {
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }

  function addEventListeners() {
    const forms = document.getElementsByClassName('needs-validation');
    document.getElementById('add').addEventListener('click', addLanguage, false);
    document.getElementById('remove').addEventListener('click', removeLanguage, false);
    document.getElementById('submit').addEventListener('click', validateForm, false);
    Array.prototype.filter.call(forms, form => {
      form.addEventListener('submit', validateForm, false);
    });
  }

  addEventListeners();
};
