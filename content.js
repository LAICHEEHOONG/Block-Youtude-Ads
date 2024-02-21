const handle = {
  counter: {
    skip: 0,
    duration: 0,
    time: "",
    videoDuration: 0,
    tabId: '',
    activate: 'on',
    intervalId: '',
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
      handle.counter.videoDuration += video.duration;
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
    console.log("*************** Block Youtube Ads ***************");
    console.log(`                  跳转广告: ${handle.counter.duration} 次`);
    console.log(`                  跳转广告总时长: ${handle.counter.videoDuration.toFixed(2)} 秒`);
    console.log(`                  点击跳过: ${handle.counter.skip} 次`);
    console.log(`                  时间: ${handle.counter.time}`);
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
  updateData: () => {
    chrome.runtime.sendMessage({ type: "dataUpdated", data: handle.counter });
  },
  getTabId: () => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      handle.counter.tabId = request.tabId
      if (request.tabId) {
        handle.updateData();
      }
      if (request.activate === 'off') {
        handle.counter.activate = 'off';
      }

      if (request.activate === 'on') {
        handle.counter.activate = 'on'
        handle.blockYouTubeAds();
      }
    });
  },
  blockYouTubeAds: () => {
    handle.counter.intervalId = setInterval(() => {
      const detectAds = handle.detectAds();
      const detectSkipBtn = handle.detectSkipBtn();
      if (detectAds) {
        handle.jumpDuration();
      }
      if (detectSkipBtn) {
        handle.clickSkipBtn();
      }
      if (handle.counter.activate === 'off') {
        clearInterval(handle.counter.intervalId);
      }
    }, 500);
  }

};



handle.getTabId();
handle.blockYouTubeAds();


















