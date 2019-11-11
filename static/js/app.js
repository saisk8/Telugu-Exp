// eslint-disable-next-line no-undef
$(document).ready(() => {
  const telugu = [
    'అ',
    'న',
    'వ',
    'మ',
    'య',
    'ల',
    'ర',
    'ఒ',
    'జ',
    'ఠ',
    'ఆ',
    'ఉ',
    'ఊ',
    'ఎ',
    'ఏ',
    'ప',
    'ఫ',
    'ద',
    'డ',
    'బ',
    'త',
    'క',
    'హ',
    'ణ',
  ];
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const btns = document.querySelectorAll('p[name="score"]');
  let expId = 0;
  const size = (telugu.length * (telugu.length - 1)) / 2;
  const diffs = Array(size).fill(0);

  function completeExp() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/complete', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(
      JSON.stringify({
        value: diffs,
      }),
    );
  }

  function updateScore(e) {
    document.getElementById('score').innerHTML = e.target.innerHTML;
    diffs[expId] = +e.target.innerHTML;
  }

  function updateScreen(callback) {
    document.getElementById('score').innerHTML = diffs[expId];
    const i = Math.floor(expId / size);
    const j = expId % size;
    if (i === j) {
      callback();
      return;
    }
    const letter1 = telugu[i];
    const letter2 = telugu[j];
    document.getElementById('letter-1').innerHTML = letter1;
    document.getElementById('letter-2').innerHTML = letter2;
  }

  function updateScreenToPrev() {
    expId -= 1;
    if (diffs[expId] === 0) {
      document.getElementById('error').innerHTML = 'Please select a score';
    } else {
      document.getElementById('error').innerHTML = '';
    }
    if (expId === 0) expId = 1;
    updateScreen(updateScreenToPrev);
  }

  function updateScreenToNext() {
    if (diffs[expId] === 0) {
      document.getElementById('error').innerHTML = 'Please select a score';
    } else {
      document.getElementById('error').innerHTML = '';
    }
    expId += 1;
    if (expId === diffs.length) completeExp();
    updateScreen(updateScreenToNext);
  }

  function startExp() {
    expId += 1;
    if (expId === diffs.length) completeExp();
    updateScreen(updateScreenToNext);
  }

  function addEventListner() {
    next.addEventListener('click', updateScreenToNext, false);
    prev.addEventListener('click', updateScreenToPrev, false);
    for (let i = 0; i < btns.length; i += 1) {
      btns[i].addEventListener('click', updateScore, false);
    }
  }
  addEventListner();
  startExp();
});
