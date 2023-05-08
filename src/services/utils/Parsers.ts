export const tryParseFloatStrict = (value: string): number => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw Error('Cannot parse value to number!!!');
  }
  return num;
};

export const tryParseFloat = (value: string): number | undefined => {
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};
