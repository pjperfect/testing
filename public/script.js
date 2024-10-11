document.addEventListener('DOMContentLoaded', function() {
    // Predefined users and passwords
    const users = {
        'ce_nairobi': '63115',
        'ce_mombasa': '70659',
        'ce_thika': '97618',
        'ce_kisumu': '80914'
    };

    // Login functionality
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;

            if (username.trim() && password.trim()) {
                if (users[username] && users[username] === password) {
                    sessionStorage.setItem('username', username);
                    loginMessage.textContent = 'Successfully logged in.';
                    loginMessage.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = './rtmp.html';
                    }, 1000);
                } else {
                    loginMessage.textContent = 'Invalid username or password';
                    loginMessage.style.color = 'red';
                }
            } else {
                loginMessage.textContent = 'Please enter both username and password.';
                loginMessage.style.color = 'red';
            }
        });
    }

    // RTMP functionality
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

    function loadStream(source, button) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }

        // Highlight the active stream button
        document.querySelectorAll('.stream-options button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    if (video) {
        loadStream(stream1Src, document.getElementById('stream1Button')); // Load the default stream (HD)

        document.getElementById('stream1Button').addEventListener('click', function() {
            loadStream(stream1Src, this);
        });

        document.getElementById('stream2Button').addEventListener('click', function() {
            loadStream(stream2Src, this);
        });
    }

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
