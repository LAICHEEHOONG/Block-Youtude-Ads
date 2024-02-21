

const handle = {
    data: {
        currentTabId: '',
        stopButton: document.querySelector('.stop-btn'),
        startButton: document.querySelector('.start-btn'),
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
                const { duration, skip, time, videoDuration, tabId, activate } = message.data
                const popupContent = document.querySelector('#popup-content');

                popupContent.innerHTML = `
                    <div class="text">Tab ID: ${tabId} </div>
                    <div class="text">跳转广告: ${duration} 次</div>
                    <div class="text">点击跳过: ${skip} 次</div>
                    <div class="text">时间: ${time}</div>
                    <div class="text duration">跳转广告总时长: ${videoDuration.toFixed(2)} 秒</div>
                `;

                if (activate === 'on') {
                    handle.data.stopButton.style.display = 'block';
                    handle.data.startButton.style.display = 'none';
                } else if (activate === 'off') {
                    handle.data.stopButton.style.display = 'none';
                    handle.data.startButton.style.display = 'block';
                } else {
                    handle.data.stopButton.style.display = 'block';
                    handle.data.startButton.style.display = 'none';
                }


            }
        });
    },
    clickButton: () => {

        // if (handle.data.activate === 'on') {
        //     handle.data.stopButton.style.display = 'block';
        //     handle.data.startButton.style.display = 'none';
        // } else if (handle.data.activate === 'off') {
        //     handle.data.stopButton.style.display = 'none';
        //     handle.data.startButton.style.display = 'block';
        // }
        document.querySelector('.stop-btn').addEventListener('click', () => {
            handle.offExtension();
            handle.data.stopButton.style.display = 'none';
            handle.data.startButton.style.display = 'block';
        })

        document.querySelector('.start-btn').addEventListener('click', () => {
            handle.onExtension();
            handle.data.stopButton.style.display = 'block';
            handle.data.startButton.style.display = 'none';
        })

    }
}


handle.getTabId();
handle.render();
handle.clickButton();










