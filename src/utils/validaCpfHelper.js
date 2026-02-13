const validaCpf = (cpf) => {
  if (typeof cpf !== 'string') return false;

  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false;
  }

  cpf = cpf.split('');

  const validator = cpf.filter((digit, index, array) => {
    return index >= array.length - 2;
  }).map(el => +el);

  const toValidate = (popUp) => cpf.filter((digit, index, array) => {
    return index < array.length - popUp;
  }).map(el => +el);

  const calcDigit = (accumulator) => {
    const total = accumulator.reduce((ac, current, index) => {
      let reverse = accumulator.length + 1 - index;
      return ac + (current * reverse);
    }, 0);

    const rest = 11 - (total % 11);

    return rest > 9 ? 0 : rest;
  };

  const firstNineDigits = toValidate(2);
  const firstCheckDigit = calcDigit(firstNineDigits);
  const secondCheckDigit = calcDigit(firstNineDigits.concat(firstCheckDigit));

  return validator[0] === firstCheckDigit && validator[1] === secondCheckDigit;
};

module.exports = validaCpf;
