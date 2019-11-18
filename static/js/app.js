/* eslint-disable no-undef */
/* eslint-disable no-console */
function startExperiment() {
  const expData = { user: window.localStorage.getItem('user'), data: null, set: null };
  // Get data
  axios
    .get('/get-exp-data', {
      user: expData.user,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.user === expData.user) {
        expData.data = response.data.data;
        expData.set = response.data.set;
      }
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  const telugu = [
    ['అ', 'న', 'వ', 'మ', 'య', 'ల', 'ర', 'ఒ'],
    ['జ', 'ఠ', 'ఆ', 'ఉ', 'ఊ', 'ఎ', 'ఏ', 'ప'],
    ['ఫ', 'ద', 'డ', 'బ', 'త', 'క', 'హ', 'ణ'],
  ];
  const currentSet = telugu[expData.set].flatMap((shape1, index) => {
    telugu[expData.set].slice(index + 1).map((shape2) => [shape1, shape2]);
  });

  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const btns = document.querySelectorAll('p[name="score"]');
  let expId = expData.data.indexOf(0);
  if (expId === -1) expId = -5; // To indicate that the exp is done
  const size = currentSet.length;

  function completeExp() {
    axios
      .post('/complete', {
        data: expData,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function save(data) {
    axios
      .post('/save', { data })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateScore(e) {
    document.getElementById('score').innerHTML = e.target.innerHTML;
    expData.data[expId] = +e.target.innerHTML;
  }

  function updateScreen() {
    document.getElementById('score').innerHTML = expData.data[expId];
    const shape1 = currentSet[expId][0];
    const shape2 = currentSet[expId][1];
    document.getElementById('letter-1').innerHTML = shape1;
    document.getElementById('letter-2').innerHTML = shape2;
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
