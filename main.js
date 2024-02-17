const handle = {
  counter: {
    skip: 0,
    duration: 0,
    time: "",
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
      handle.recordTime();
      handle.message();
    }
  },
  clickSkipBtn: () => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button-modern");
    skipBtn.click();
    handle.counter.skip++;
    handle.recordTime();
    handle.message();
  },
  message: () => {
    console.log('*************** Block Youtube Ads ***************')
    console.log(`跳转广告: ${handle.counter.duration} 次`);
    console.log(`点击跳过: ${handle.counter.skip} 次`);
    console.log(`时间: ${handle.counter.time}`);
  },
  recordTime: () => {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedTime = hours + ":" + minutes + amPm;
    handle.counter.time = formattedTime;
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
