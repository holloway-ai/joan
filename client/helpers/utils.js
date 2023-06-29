function getHash (url) {
  return url.substring(url.indexOf('#') + 1)
};

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100)
  var seconds = Math.floor((duration / 1000) % 60)
  var minutes = Math.floor((duration / (1000 * 60)) % 60)
  var hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  return hours + ':' + minutes + ':' + seconds
}

function getElementSize (selector, property) {
  const element = document.querySelector(selector)
  const computedStyle = getComputedStyle(element)[property]
  const size = parseInt(computedStyle.slice(0, computedStyle.indexOf('px')))
  return size
};

export {
  getHash,
  msToTime,
  getElementSize
}
