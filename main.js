const blockAds = () => {
  const video = document.querySelector("video");
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

  const handleTimeUpdate = () => {
    videoDuration();
  };

  video.addEventListener("timeupdate", handleTimeUpdate);
};

blockAds();
