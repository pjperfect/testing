document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const stream1Src = 'https://vcpout-sf01-altnetro.internetmultimediaonline.org/vcp/966d3657/playlist.m3u8'; // HD stream link
    const stream2Src = 'https://vcpout-sf01-altnetro.internetmultimediaonline.org/vcp/966d3658/playlist.m3u8'; // SD stream link

    const username = sessionStorage.getItem('username');

    if (username) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `Welcome: ${username}`;
        welcomeMessage.style.fontWeight = 'bold';
        welcomeMessage.style.fontSize = '18px';
        welcomeMessage.style.color = '#007bff';
        welcomeMessage.style.cursor = 'pointer';
        welcomeMessage.addEventListener('click', function() {
            location.reload();
        });
    }

    function loadStream(source) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
            hls.on(Hls.Events.ERROR, function(event, data) {
                console.error('HLS error:', data);
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
            video.addEventListener('error', function() {
                console.error('Video error:', video.error);
            });
        }
    }

    loadStream(stream1Src); // Load the default stream (HD)

    document.getElementById('stream1Button').addEventListener('click', function() {
        loadStream(stream1Src);
    });

    document.getElementById('stream2Button').addEventListener('click', function() {
        loadStream(stream2Src);
    });

    document.getElementById('dropdownButton').addEventListener('click', function() {
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        sessionStorage.removeItem('username');
        window.location.href = './index.html';
    });

    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const chatBox = document.getElementById('chatBox');
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value;
        if (message.trim()) {
            const newMessage = document.createElement('div');
            newMessage.classList.add('chat-message');
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            newMessage.innerHTML = `<strong>${username}</strong>: ${message} <span class="timestamp">(${timestamp})</span>`;
            chatBox.appendChild(newMessage);
            chatInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    window.openTab = function(event, tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }
        const tabButtons = document.getElementsByClassName('tab-button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].className = tabButtons[i].className.replace(' active', '');
        }
        document.getElementById(tabName).style.display = 'block';
        event.currentTarget.className += ' active';
    };
});
