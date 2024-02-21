

const handle = {
    data: {
        currentTabId: '',
        stopButton: document.querySelector('.stop-btn'),
        startButton: document.querySelector('.start-btn'),
        progressBar: document.querySelector('.progress'),
        progressBarColor: document.querySelector('.progress-bar'),
        progressBarPercentage: 0,
        intervalBar: '',
    },
    getTabId: () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            handle.data.currentTabId = tabs[0].id;
            // chrome.tabs.sendMessage(currentTabId, { tabId: currentTabId }, function (response) {
            //     console.log(response);
            // });
            chrome.tabs.sendMessage(handle.data.currentTabId, { tabId: handle.data.currentTabId });
        });
    },
    offExtension: () => {
        chrome.tabs.sendMessage(handle.data.currentTabId, { activate: 'off' });
    },
    onExtension: () => {
        chrome.tabs.sendMessage(handle.data.currentTabId, { activate: 'on' });
    },
    render: () => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

            if (message.type === "dataUpdated" && handle.data.currentTabId === message.data.tabId) {
                const { duration, skip, time, videoDuration, tabId, activate } = message.data;
                console.log(message.data)
                const popupContent = document.querySelector('#popup-content');

                popupContent.innerHTML = `
                    <div class="text">Tab ID: ${tabId} </div>
                    <div class="text">跳转广告: ${duration} 次</div>
                    <div class="text">点击跳过: ${skip} 次</div>
                    <div class="text">时间: ${time}</div>
                    <div class="text">跳转广告总时长: ${videoDuration.toFixed(2)} 秒</div>
                `;

                handle.displayBtnGroup(activate);
                handle.runProgressBar();
            }
        });
    },
    clickButton: () => {
        document.querySelector('.stop-btn').addEventListener('click', () => {
            handle.offExtension();
            handle.displayBtnGroup('off');
            clearInterval(handle.data.intervalBar);
            handle.data.progressBarPercentage = 0;
        })
        document.querySelector('.start-btn').addEventListener('click', () => {
            handle.onExtension();
            handle.displayBtnGroup('on');
            handle.runProgressBar();
        })
    },
    displayBtnGroup: (activate) => {
        if (activate === 'on' || activate === '') {
            handle.data.stopButton.style.display = 'block';
            handle.data.startButton.style.display = 'none';
            handle.data.progressBar.style.display = 'flex';
        } else {
            handle.data.stopButton.style.display = 'none';
            handle.data.startButton.style.display = 'block';
            handle.data.progressBar.style.display = 'none';
        }
    },
    percentageCal: () => {
        if (handle.data.progressBarPercentage < 100) {
            handle.data.progressBarPercentage += 20;
        } else {
            handle.data.progressBarPercentage = 0;
        }
    },
    runProgressBar: () => {
        handle.data.intervalBar = setInterval(() => {
            handle.percentageCal()
            handle.data.progressBarColor.style.width = `${handle.data.progressBarPercentage}%`
        }, 500)
    }


}


handle.getTabId();
handle.render();
handle.clickButton();










