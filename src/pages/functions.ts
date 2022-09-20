export const numberOfDigits = (serialNumber: string | string[] | undefined) => {
  let number = '00000000000' + serialNumber;
  number = number.slice(-11);
  return number;
};
