<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Music Prompt</title>
  <style>
    /* Thông báo hỏi phát nhạc */
    .music-toast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #111;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      display: none;
      flex-direction: column;
      align-items: center;
      max-width: 90%;
    }

    .music-toast.show {
      display: flex;
    }

    .toast-question {
      font-size: 17px;
      font-weight: 500;
      margin-bottom: 16px;
      text-align: center;
    }

    @media (min-width: 768px) {
      .toast-question {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .toast-buttons {
      display: flex;
      gap: 16px;
    }

    .toast-buttons button {
      background: #444;
      color: white;
      border: none;
      padding: 8px 20px;
      font-size: 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .toast-buttons button:hover {
      background: #666;
    }

    /* Popup đang phát nhạc */
    #popupNotification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #222;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 15px;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    #popupNotification.show {
      opacity: 1;
      pointer-events: auto;
    }

    #popupNotification.hide {
      opacity: 0;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <!-- Khung thông báo phát nhạc -->
  <div class="music-toast" id="musicToast">
    <div class="toast-question">🎧 Bạn có muốn cho phép vừa nghe nhạc vừa lướt trang web không?</div>
    <div class="toast-buttons">
      <button onclick="handleMusicPermission(true)">Có</button>
      <button onclick="handleMusicPermission(false)">Không</button>
    </div>
  </div>

  <!-- Popup thông báo đang phát bài -->
  <div id="popupNotification">
    <div class="popup-inner"></div>
  </div>

  <script>
    const songs = [
      { name: "Bài hát 1", file: "https://files.catbox.moe/22en11.mp3" },
      { name: "Bài hát 2", file: "song2.mp3" },
      { name: "Bài hát 3", file: "song3.mp3" },
    ];

    let currentAudio = null;
    let lastPlayedIndex = -1;

    function playRandomSong() {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === lastPlayedIndex && songs.length > 1);

      lastPlayedIndex = randomIndex;
      const song = songs[randomIndex];

      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      currentAudio = new Audio(song.file);
      currentAudio.play().catch(err => {
        console.warn("Không thể phát nhạc tự động:", err);
      });

      const popup = document.getElementById('popupNotification');
      const popupInner = popup.querySelector('.popup-inner');
      popupInner.textContent = '🎵 Đang phát: ' + song.name;

      popup.classList.add('show');
      setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => {
          popup.classList.remove('show', 'hide');
        }, 500);
      }, 3000);

      currentAudio.addEventListener('ended', playRandomSong);
    }

    function handleMusicPermission(allow) {
      document.getElementById('musicToast').style.display = 'none';
      if (allow) playRandomSong();
    }

    // Hiển thị thông báo sau khi trang tải xong
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('musicToast').classList.add('show');
      }, 800);
    });
  </script>
</body>
</html>
