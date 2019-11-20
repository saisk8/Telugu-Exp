/* eslint-disable no-undef */
/* eslint-disable no-console */
function startExperiment() {
  if (!window.localStorage.getItem('telugu-exp-user')) {
    window.location.href = '/login';
    return;
  }
  const expData = {
    user: window.localStorage.getItem('telugu-exp-user')
  };
  window.localStorage.removeItem('telugu-exp-user');
  // Get data
  axios
    .get('/get-exp-data', {
      user: expData.user
    })
    .then(response => {
      console.log(response.data);
      if (response.data.user === expData.user) {
        expData.set = response.data.set;
        expData.setNumber = response.data.setNumber;
      }
    })
    .catch(error => {
      console.log(error);
      throw error;
    });

  function getSetData() {
    const data = window.localStorage.getItem(`telugu-${expData.user}-${expData.setNumber}`);
    if (data) return data;
    return Array(expData.set.length).fill(0);
  }

  const fontClasses = ['font1', 'font2', 'font3', 'font4', 'font5'];
  const currentSet = expData.set;
  expData.data = getSetData();
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const btns = document.querySelectorAll('p[name="score"]');
  let expId = expData.data.indexOf(0);
  if (expId === -1) expId = -5; // To indicate that the exp is done
  const size = currentSet.length;

  function completeExp() {
    axios
      .post('/complete', {
        expData
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function save() {
    window.localStorage.setItem(`telugu-${expData.user}-${expData.setNumber}`, expData.data);
  }

  function updateScore(e) {
    document.getElementById('score').innerHTML = e.target.innerHTML;
    expData.data[expId] = +e.target.innerHTML;
  }

  function updateScreen() {
    document.getElementById('score').innerHTML = expData.data[expId];
    const shape1 = currentSet[expId][0];
    const shape2 = currentSet[expId][1];
    const element1 = document.getElementById('letter-1');
    const element2 = document.getElementById('letter-1');
    element1.innerHTML = shape1;
    element1.classList.remove(fontClasses);
    element1.classList.add(fontClasses[Math.floor(Math.random() * fontClasses.length)]);
    element2.innerHTML = shape2;
    element2.classList.remove(fontClasses);
    element2.classList.add(fontClasses[Math.floor(Math.random() * fontClasses.length)]);
  }

  function updateScreenToPrev() {
    expId -= 1;
    if (expId === -1) expId = 0;
    document.getElementById('expNo').innerHTML = `Exp ${expId + 1} of ${size}`;
    if (expData.data[expId] === 0) {
      document.getElementById('error').innerHTML = 'Please select a score';
      return;
    }
    document.getElementById('error').innerHTML = '';
    save(expData);
    updateScreen();
  }

  function updateScreenToNext() {
    if (expData.data[expId] === 0) {
      document.getElementById('error').innerHTML = 'Please select a score';
      return;
    }
    document.getElementById('error').innerHTML = '';
    expId += 1;
    document.getElementById('expNo').innerHTML = `Exp ${expId + 1} of ${size}`;
    if (expId === size) completeExp();
    save(expData);
    updateScreen();
  }

  function addEventListner() {
    next.addEventListener('click', updateScreenToNext, false);
    prev.addEventListener('click', updateScreenToPrev, false);
    for (let i = 0; i < btns.length; i += 1) {
      btns[i].addEventListener('click', updateScore, false);
    }
  }

  // Intialise the experiment page
  addEventListner();
  document.getElementById('expNo').innerHTML = `Exp ${expId + 1} of ${size}`;
  if (expId === -5) completeExp();
  updateScreen(updateScreenToNext);
}

window.onload = startExperiment;
