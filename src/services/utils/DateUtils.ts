export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return day + '.' + month + '.' + year;
};

export const getLocalDateTimeString = (date: Date, withSeconds: boolean = true): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds();

  let dateString = getLocalDateString(date) + ' ' + hours + ':' + minutes;
  if (withSeconds && seconds > 0) {
    dateString = dateString + ':' + seconds.toString().padStart(2, '0');
  }
  return dateString;
};

export const toFormattedDateString = (date: Date | undefined): string => {
  if (date === undefined) {
    return '';
  }

  const year = date.getFullYear().toString();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate().toString();

  return month + ' ' + day + ', ' + year;
};

export const toFormattedDateTimeString = (
  date: Date | undefined,
  withSeconds: boolean = true,
): string => {
  if (date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds();

    let dateString = toFormattedDateString(date) + ' ' + hours + ':' + minutes;
    if (withSeconds && seconds > 0) {
      dateString = dateString + ':' + seconds.toString().padStart(2, '0');
    }
    return dateString;
  } else {
    return '';
  }
};

export const toFormattedDateTimeStringFromTimestamp = (timestamp: number | undefined): string => {
  if (timestamp) {
    return toFormattedDateTimeString(new Date(timestamp));
  } else {
    return '';
  }
};
