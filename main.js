const handle = {
  counter: {
    skip: 0,
    duration: 0,
  },
  detectAds: () => {
    const adShowing = document.querySelector(".ad-showing");
    return adShowing ? true : false;
  },
  detectSkipBtn: () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button-modern");
    return skipBtn ? true : false;
  },
  jumpDuration: () => {
    const video = document.querySelector("video");
    if (video.currentTime) {
      video.currentTime = video.duration;
      handle.counter.duration++;
      handle.message();
    }
  },
  clickSkipBtn: () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button-modern");
    skipBtn.click();
    handle.counter.skip++;
    handle.message();
  },
  message: () => {
    console.log(`跳转广告: ${handle.counter.duration} 次`);
    console.log(`点击跳过: ${handle.counter.skip} 次`);
  },
};

const blockYouTubeAds = () => {
  setInterval(() => {
    const detectAds = handle.detectAds();
    const detectSkipBtn = handle.detectSkipBtn();
    if (detectAds) {
      handle.jumpDuration();
    }
    if (detectSkipBtn) {
      handle.clickSkipBtn();
    }
  }, 500);
};

blockYouTubeAds();
