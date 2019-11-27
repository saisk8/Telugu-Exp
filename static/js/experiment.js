/* eslint-disable no-undef */
/* eslint-disable no-console */
window.onload = () => {
  let updateTime = 0;
  let firstMouseMoveTime = 0;
  const fontClasses = ['font1', 'font2', 'font3', 'font4', 'font5', 'font6', 'font7'];
  const next = document.getElementById('next');
  const btns = document.querySelectorAll('p[name="score"]');
  let expId = 0;
  let size = 0;
  let clicked = false;

  if (!window.localStorage.getItem('telugu-exp-user')) {
    window.location.href = '/login';
    return;
  }
  const expData = {
    user: window.localStorage.getItem('telugu-exp-user')
  };

  function completeExp() {
    axios
      .post('/complete', {
        expData
      })
      .then(response => {
        if (response.data.status) window.location.href = '/thanks';
      })
      .catch(error => {
        console.log(error);
      });
  }

  function updateScore(event) {
    const time = new Date();
    console.log(event.target.id);
    document.getElementById('scorecard').innerHTML = event.target.id;
    const newData = {
      value: event.target.id,
      firstMouseMoveTime,
      reactionTime: (time.getTime() - updateTime.getTime()) / 1000
    };
    expData.data[expId] = newData;
    clicked = true;
    console.log(expData.data);
  }

  function displayEditor() {
    document.getElementById('letter-1').style.visibility = 'hidden';
    document.getElementById('letter-2').style.visibility = 'hidden';
  }

  function updateScreen() {
    updateTime = new Date();
    document.getElementById('scorecard').innerHTML = 0;
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
    document.querySelector('body').addEventListener(
      'mousemove',
      () => {
        firstMove = new Date();
        firstMouseMoveTime = (firstMove.getTime() - updateTime.getTime()) / 1000;
      },
      {
        once: true
      }
    );
    window.setTimeout(displayEditor, 2000);
  }

  function updateScreenToNext() {
    console.log(expData.data.length, expId);
    if (!clicked) {
      document.getElementById('error').innerHTML = 'Please select a score';
      return;
    }
    clicked = false;
    expId += 1;
    if (expId === size) completeExp();
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
    updateScreen();
  }

  axios
    .get('/get-exp-data')
    .then(response => {
      if (response.data) {
        expData.set = response.data.set;
        expData.setNumber = response.data.setNumber;
        expData.data = Array(expData.set.length);
        nextSteps();
      }
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};
