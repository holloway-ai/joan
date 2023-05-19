/* THEME SPECIFIC JAVASCRIPT */
window.onload = function () {
  
  function attachEventListeners() {
    const video = document.querySelector("#presentationVideo");    
    const textContainer = document.querySelector('.text-container');
    const highlights = document.querySelectorAll("[data-start]");
    
    if (video) {      
      window.addEventListener('scroll', function () {
        const pageHeight = window.innerHeight;   
        const isMobile = function () {
          return window.innerWidth < 460;
        }
        if (!isMobile()) { 
          if (window.pageYOffset > pageHeight * .4) {
            video.classList.add("sticky");
          } else {
            video.classList.remove("sticky");
          }  
        } else {
          if (window.pageYOffset > pageHeight * .4) {
            video.classList.add("sticky");
          } else {
            video.classList.remove("sticky");
          } 
        }
      })
    }

    if (video && highlights.length > 0) {
  		console.log(highlights);
      video.addEventListener("timeupdate", function () {
        const currentTime = video.currentTime;

        highlights.forEach(function (highlight) {
          const start = parseFloat(highlight.dataset.start);
          const end = parseFloat(highlight.dataset.end);

          if (currentTime >= start && currentTime <= end) {
            highlight.classList.add("highlighted");
          } else {
            highlight.classList.remove("highlighted");
          }
        });
 
          const highlightedSegment = document.querySelector(".highlighted");

          if (textContainer && highlightedSegment) {
            const textContainerRect = textContainer.getBoundingClientRect();
            const highlightedSegmentRect = highlightedSegment.getBoundingClientRect();
            const scrollToY = highlightedSegment.offsetTop - (textContainerRect.height / 2) + (highlightedSegmentRect.height / 2);

            textContainer.scrollTop = scrollToY;
          }
      });

      highlights.forEach(function (highlight) {
        highlight.addEventListener("dblclick", function () {
          const start = parseFloat(highlight.dataset.start);
          video.currentTime = start;
          video.play();
        });
      });

      return true;
    }

    return false;
  }

  function waitForElements() {
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && attachEventListeners()) {
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (!attachEventListeners()) {
    waitForElements();
  }
};
