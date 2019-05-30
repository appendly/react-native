export const isEmpty = prop =>
  prop === null ||
  prop === undefined ||
  (prop.hasOwnProperty("length") && prop.length === 0) ||
  (prop.constructor === Object && Object.keys(prop).length === 0);

export const filterMax = arr => max => arr.filter((item, index) => index < max);

export const zeroPad = number =>
  number < 10 && number > 0 ? `0${number}` : number;

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export const toDataURL = url => {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
};
