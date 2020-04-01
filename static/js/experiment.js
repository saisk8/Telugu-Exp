/* eslint-disable no-undef */
window.onload = () => {
  let apiHost = '';
  if (window.location.hostname === 'localhost')
    apiHost = `${window.location.protocol}//${window.location.hostname}:3001/api`;
  else apiHost = `${window.location.protocol}//${window.location.hostname}/api`;

  let updateTime = 0;
  const fontClasses = ['font1', 'font2', 'font3', 'font4', 'font5'];
  const next = document.getElementById('next');
  const btns = document.querySelectorAll('p[name="score"]');
  let expId = 0;
  let size = 0;
  let clicked = null;
  let timeOutId = '';

  if (!window.localStorage.getItem('telugu-exp-user')) {
    window.location.href = '/';
    return;
  }
  const expData = {
    user: window.localStorage.getItem('telugu-exp-user')
  };
  function completeExp() {
    axios
      .post(`${apiHost}/complete`, {
        expData
      })
      .then(response => {
        if (response.data.status) window.location.href = '/dashboard';
      })
      .catch(error => {
        throw error;
      });
  }

  function updateScore(event) {
    const time = new Date();
    if (clicked !== null) {
      clicked.classList.remove('btn-info');
      clicked.classList.add('btn-outline-info');
    }
    event.target.classList.remove('btn-outline-info');
    event.target.classList.add('btn-info');
    const newData = {
      value: event.target.id,
      reactionTime: (time.getTime() - updateTime.getTime()) / 1000
    };
    expData.data[expId] = newData;
    clicked = event.target;
    next.removeAttribute('disabled');
    next.classList.add('hover');
    next.classList.remove('hover-bad');
  }

  function displayEditor() {
    document.getElementById('letter-1').style.visibility = 'hidden';
    document.getElementById('letter-2').style.visibility = 'hidden';
  }

  function updateScreen() {
    window.clearTimeout(timeOutId);
    updateTime = new Date();
    const shape1 = expData.set[expId][0];
    const shape2 = expData.set[expId][1];
    const element1 = document.getElementById('letter-1');
    const element2 = document.getElementById('letter-2');
    fontClasses.forEach(value => {
      element1.classList.remove(value);
      element2.classList.remove(value);
    });
    element1.innerHTML = shape1;
    element1.classList.add(fontClasses[Math.floor(Math.random() * fontClasses.length)]);
    element2.innerHTML = shape2;
    element2.classList.add(fontClasses[Math.floor(Math.random() * fontClasses.length)]);
    element1.style.visibility = 'visible';
    element2.style.visibility = 'visible';
    timeOutId = window.setTimeout(displayEditor, 2000);
  }

  function updateScreenToNext() {
    next.setAttribute('disabled', 'disabled');
    next.classList.add('hover-bad');
    next.classList.remove('hover');
    clicked.classList.remove('btn-info');
    clicked.classList.add('btn-outline-info');
    expId += 1;
    if (expId >= size) {
      completeExp();
      return;
    }
    document.getElementById('error').innerHTML = '';
    document.getElementById('expNo').innerHTML = `Pair ${expId + 1} of ${size}`;
    updateScreen();
  }

  function addEventListner() {
    next.addEventListener('click', updateScreenToNext, false);
    for (let i = 0; i < btns.length; i += 1) {
      btns[i].addEventListener('click', updateScore, false);
    }
  }

  function nextSteps() {
    size = expData.set.length;
    addEventListner();
    document.getElementById('expNo').innerHTML = `Pair ${expId + 1} of ${size}`;
    document.getElementById('set').innerHTML = `Set ${expData.setNumber}`;
    updateScreen();
  }

  axios
    .get(`${apiHost}/get-exp-data/${expData.user}`)
    .then(response => {
      if (response.data) {
        expData.set = response.data.set;
        expData.setNumber = response.data.setNumber;
        expData.data = Array(expData.set.length);
        nextSteps();
      }
    })
    .catch(error => {
      throw error;
    });
};
