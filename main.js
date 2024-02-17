const blockAds = () => {
  const video = document.querySelector("video");
  let blocked = 0;

  const handleSkip = async () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button");
    if (skipBtn) {
      skipBtn.click();
    }
  };

  const videoDuration = async () => {
    const adShowing = document.querySelector(".ad-showing");
    if (adShowing && video.currentTime) {
      video.currentTime = video.duration;
      blocked++;
      console.log(`屏蔽的广告数量: ${blocked}`);
      await handleSkip();
    }
  };

  video.addEventListener("timeupdate", videoDuration);
};

blockAds();
