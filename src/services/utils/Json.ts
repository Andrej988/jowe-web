export const jsonEscape = (value: string): string => {
  return value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
};

export const jsonRemoveEscape = (value: string): string => {
  const regex = /\\n/g;
  return value.replace(regex, '\n');
};
