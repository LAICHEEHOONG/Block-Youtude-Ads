const blockAds = () => {
  let blocked = 0;

  const handleSkip = () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button");
    if (skipBtn) {
      skipBtn.click();
    }
  };

  const videoDuration = () => {
    const adShowing = document.querySelector(".ad-showing");
    const video = document.querySelector("video");

    if (adShowing && video.currentTime) {
      video.currentTime = video.duration;
      blocked++;
      console.log(`屏蔽的广告数量: ${blocked}`);
      handleSkip();
    }
  };

  document.querySelector("video").addEventListener("timeupdate", videoDuration);
};

blockAds();
