/* eslint-disable no-undef */
// Example starter JavaScript for disabling form submissions if there are invalid fields

window.onload = () => {
  const languages = [];

  // function showList() {
  //   let html = '';
  //   for (let i = 0; i < languages.length; i += 1) {
  //     html += `<li>${languages[i].name}: ${languages[i].attr}
  //     <button type="button" class="btn btn-danger mb-2" id="${i}" onclick='${remove()};'>x</button>
  //     `;
  //   }
  //   document.getElementById('languages').innerHTML = html;
  // }

  function removeLanguage() {
    languages.pop();
    const parent = document.getElementById('languages');
    parent.removeChild(parent.lastChild);
  }

  function addLanguage() {
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    let attr = '';
    for (let i = 0; i < checkboxes.length; i += 1) {
      if (checkboxes[i].value === 'on') attr += ` ${checkboxes[i].id}`;
    }
    attr = attr.trim();
    const name = document.getElementById('language').value;
    languages.push({
      name,
      attr
    });
    const parent = document.getElementById('languages');
    const newElement = document.createElement('li');
    newElement.innerHTML = `${name}: ${attr}`;
    parent.appendChild(newElement);
    console.log(languages);
  }

  function checkboxValidate(name) {
    const min = 1; // minumum number of boxes to be checked for this form-group
    if ($(`input[name="${name}"]:checked`).length < min) {
      $(`input[name="${name}"]`).prop('required', true);
    } else {
      $(`input[name="${name}"]`).prop('required', false);
    }
  }

  function validateForm(event) {
    checkboxValidate('attr');
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
    Array.prototype.filter.call(forms, form => {
      form.addEventListener('submit', validateForm, false);
    });
  }

  addEventListeners();
};
