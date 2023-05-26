import { getStyle } from '@coreui/utils';

export const getStyleString = (property: string): string => {
  const style = getStyle(property);
  return style !== undefined ? style : '';
};
