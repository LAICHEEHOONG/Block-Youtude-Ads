const handle = {
  counter: {
    skip: 0,
    duration: 0,
    time: "",
    videoDuration: 0,
    tabId: '',
    activate: 'on',
    intervalId: '',
    language: 'english',
    accountName: '',
    accountId: '',
    startDate: new Date(),
    unlimited: false,
    accessMessageEng: '',
    accessMessageCh: '',
    exp: true
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
    // console.log("*************** Block Youtube Ads ***************");
    // console.log(`                  跳转广告: ${handle.counter.duration} 次`);
    // console.log(`                  跳转广告总时长: ${handle.counter.videoDuration.toFixed(2)} 秒`);
    // console.log(`                  点击跳过: ${handle.counter.skip} 次`);
    // console.log(`                  时间: ${handle.counter.time}`);
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
      if (request.language) {
        handle.counter.language = request.language;
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
      handle.calculateDate();
      console.log('blockYouTubeAds')
    }, 500);
  },

  getUserNameAndId: () => {
    let clickAvatar = false;
    let getIdAndNameInterval = setInterval(() => {
      const avatar = document.getElementById('avatar-btn');
      if (avatar && !clickAvatar) {
        avatar.click();
        clickAvatar = true;
      }
      if (!handle.counter.accountName || !handle.counter.accountId) {
        const accountName = document.getElementById('account-name');
        const channelHandle = document.getElementById('channel-handle');
        if (accountName) {
          handle.counter.accountName = accountName.innerHTML;
        }
        if (channelHandle) {
          handle.counter.accountId = channelHandle.innerHTML;
        }
      }

      if (handle.counter.accountName && handle.counter.accountId) {
        if (clickAvatar) {
          avatar.click();
        }
        clearInterval(getIdAndNameInterval)
        handle.connectDB();
      }
    }, 1000)

  },
  connectDB: () => {
    const postData = {
      accountName: handle.counter.accountName,
      accountId: handle.counter.accountId,
      startDate: handle.counter.startDate,
      unlimited: handle.counter.unlimited
    }
    fetch('https://block-youtube-ads-server.vercel.app/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
      .then(response => {
        if (!response.ok) {
          console.log(`HTTP error! Status: ${response.status}`)
          // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const { accountName, accountId, startDate, unlimited } = data.accountInfo;
        handle.counter.accountName = accountName;
        handle.counter.accountId = accountId;
        handle.counter.startDate = startDate,
        handle.counter.unlimited = unlimited;
        return true
      })
      .then(run => {
        if(run) {
          handle.blockYouTubeAds()
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
      });
  },
  calculateDate: () => {
    if (handle.counter.unlimited) {
      handle.counter.accessMessageEng = `<i class="bi bi-infinity"></i> Unlimited Use`;//无限制访问
      handle.counter.accessMessageCh = '<i class="bi bi-infinity"></i> 无限制使用'
      handle.counter.activate = 'on';
      handle.counter.exp = true
    } else {
      const dateString = handle.counter.startDate;
      const providedDate = new Date(dateString);
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate - providedDate;

      const differenceInDays = (0.0010 - differenceInMilliseconds / (1000 * 60 * 60 * 24));
      if (differenceInDays > 0) {
        handle.counter.accessMessageEng = `${differenceInDays}-Day Free Trial`
        handle.counter.accessMessageCh = `${differenceInDays}天免费试用`
        handle.counter.activate = 'on';
        handle.counter.exp = true
      } else if (differenceInDays <= 0) {
        handle.counter.accessMessageEng = `Trial Expired`;//试用期满
        handle.counter.accessMessageCh = `试用期满`;
        handle.counter.activate = 'off';
        handle.counter.exp = false
      }
    }





  }
};

handle.getTabId();
handle.getUserNameAndId();
// handle.blockYouTubeAds();









// const postData = {
//   // Your data to be sent in the request body
//   accountName: 'exampleUser',
//   accountId: '123456',
//   startDate: '2024-02-23T12:34:56.789Z',
//   unlimited: false
// };

// fetch('https://block-youtube-ads-server.vercel.app/users', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other headers if needed
//   },
//   body: JSON.stringify(postData)
// })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Response:', data);
//     // Handle the response as needed
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     // Handle errors
//   });

// fetch('https://block-youtube-ads-server.vercel.app/users', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other headers if needed
//   },
// })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Response:', data);
//     // Handle the response as needed
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     // Handle errors
//   });





















