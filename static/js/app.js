const telugu = ['అ', 'న', 'వ', 'మ', 'య', 'ల', 'ర', 'ఒ', 'జ', 'ఠ', 'ఆ', 'ఉ',
  'ఊ', 'ఎ', 'ఏ', 'ప', 'ఫ', 'ద', 'డ', 'బ', 'త', 'క', 'హ', 'ణ'];

function conductExperiment() {
  const size = (telugu.length * (telugu.length - 1)) / 2;
  const diffs = Array(size);
}

$(document)
  .ready(() => {
    document.getElementById('letter-1').innerHTML = letter1;
    document.getElementById('letter-2').innerHTML = telugu.length;
    // eslint-disable-next-line no-console
    console.log(letter1, letter2);
  });
