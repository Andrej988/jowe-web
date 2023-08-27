export const jsonEscape = (value: string): string => {
  return value.replace(/\n/g, '\\\\n').replace(/\r/g, '\\\\r').replace(/\t/g, '\\\\t');
};
