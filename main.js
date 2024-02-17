const blockAds = () => {
  let interval;
  let video = document.querySelector("video");
  let blocked = 0;

  const handleSkip = () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button");
    if (skipBtn) {
      skipBtn.click();
    }
  };

  const videoDuration = () => {
    const adShowing = document.querySelector(".ad-showing");

    if (adShowing && video.currentTime) {
      video.currentTime = video.duration;
      blocked++;
      console.log(`屏蔽的广告数量: ${blocked}`);
      handleSkip();
    }
  };

  function checkVideoNotNull() {
    if (video) {
      clearInterval(interval);
      video.addEventListener("timeupdate", videoDuration);
    }
  }

  interval = setInterval(checkVideoNotNull, 500); 
};

blockAds();
