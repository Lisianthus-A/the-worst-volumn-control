export const detectMobile = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
};

export const random = (min: number, max: number) => {
  const diff = max - min + 1;
  return (min + Math.random() * diff) >> 0;
};

export const randomString = (len = 16) => {
  let str = "";

  while (str.length < len) {
    if (random(0, 1) === 1) {
      str += String.fromCharCode(random(97, 122));
    } else {
      str += String.fromCharCode(random(48, 57));
    }
  }

  return str;
};
