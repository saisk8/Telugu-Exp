
$(document)
  .ready(() => {
    const telugu = ['అ', 'న', 'వ', 'మ', 'య', 'ల', 'ర', 'ఒ', 'జ', 'ఠ', 'ఆ', 'ఉ',
      'ఊ', 'ఎ', 'ఏ', 'ప', 'ఫ', 'ద', 'డ', 'బ', 'త', 'క', 'హ', 'ణ'];
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const btns = document.querySelectorAll('p[name="score"]');
    let expId = 0;
    const size = (telugu.length * (telugu.length - 1)) / 2;
    const diffs = Array(size).fill(0);

    function updateScore(e) {
      document.getElementById('score').innerHTML = e.target.innerHTML;
      diffs[expId] = +e.target.innerHTML;
      console.log(diffs[expId], expId, diffs);
    }

    function updateScreenToPrev() {
      expId -= 1;
      if (expId === 0) expId = 1;
      document.getElementById('score').innerHTML = diffs[expId];
      const i = Math.floor(expId / size);
      const j = expId % size;
      if (i === j) {
        updateScreenToPrev();
        return;
      }
      const letter1 = telugu[i];
      const letter2 = telugu[j];
      document.getElementById('letter-1').innerHTML = letter1;
      document.getElementById('letter-2').innerHTML = letter2;
    }

    function updateScreenToNext() {
      expId += 1;
      if (expId === diffs.length) expId = diffs.length - 1;
      document.getElementById('score').innerHTML = diffs[expId];
      const i = Math.floor(expId / size);
      const j = expId % size;
      if (i === j) {
        updateScreenToNext();
        return;
      }
      const letter1 = telugu[i];
      const letter2 = telugu[j];
      document.getElementById('letter-1').innerHTML = letter1;
      document.getElementById('letter-2').innerHTML = letter2;
    }

    function addEventListner() {
      next.addEventListener('click', updateScreenToNext, false);
      prev.addEventListener('click', updateScreenToPrev, false);
      for (let i = 0; i < btns.length; i += 1) {
        btns[i].addEventListener('click', updateScore, false);
      }
    }
    addEventListner();
    updateScreenToNext();
  });
