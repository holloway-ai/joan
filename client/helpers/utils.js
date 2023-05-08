function getHash (url) {
  return url.substring(url.indexOf('#') + 1);
};

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  console.log('seconds: ', seconds);
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  return hours + ":" + minutes + ":" + seconds;
}

export { 
  getHash,
  msToTime
}
