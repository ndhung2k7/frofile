
// Inject HTML
document.addEventListener('DOMContentLoaded', () => {
  const html = `
    <div id="toast-prompt" class="toast-modal">
      <div class="toast-icon">
        <img src="https://i.imgur.com/aGMqekz.gif" alt="icon">
      </div>
      <div class="toast-question">
        🎧 Bạn có muốn cho phép vừa nghe nhạc vừa lướt trang web không?
      </div>
      <button class="toast-decline">Không hẹn lại lần sau</button>
      <button class="toast-accept">Cho phép luôn</button>
    </div>

    <div id="popupNotification" class="popup gradient-border">
      <div class="popup-inner"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    /* TOAST */
    .toast-modal {
      position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
      background-color: #1e1e1e; color: #fff; padding: 24px 20px 20px;
      border-radius: 24px; text-align: center; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      width: 90vw; max-width: 400px; z-index: 2000; animation: fadeUp 0.4s ease;
      font-family: sans-serif;
    }
    .toast-icon img { width: 40px; height: 40px; margin-bottom: 12px; }

    .toast-question {
      font-size: 17px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    /* Trên màn hình lớn: không cho xuống dòng */
    @media (min-width: 768px) {
      .toast-question {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .toast-decline {
      background: transparent; color: #aaa; font-size: 14px; border: none;
      margin-bottom: 14px; cursor: pointer; transition: color 0.3s;
    }
    .toast-decline:hover { color: #fff; }
    .toast-accept {
      display: block; width: 100%; background-color: #2d42fc; color: #fff;
      font-size: 16px; font-weight: 600; padding: 12px 0; border: none;
      border-radius: 100px; cursor: pointer; transition: background-color 0.3s ease;
    }
    .toast-accept:hover { background-color: #1f2dcc; }
    @keyframes fadeUp {
      from { transform: translateX(-50%) translateY(80px); opacity: 0; }
      to   { transform: translateX(-50%) translateY(0); opacity: 1; }
    }

    /* POPUP */
    .popup {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) scale(0.5);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: transform 0.5s ease, opacity 0.5s ease;
      transform-origin: center top;
      max-width: 90vw;
    }
    .popup.show {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    .popup.hide {
      transform: translateX(-50%) scale(0.5);
      opacity: 0;
    }
    .popup.gradient-border {
      padding: 2px;
      background: linear-gradient(135deg, #00f, #0f0, #f00);
      border-radius: 12px;
    }
    .popup-inner {
      background: black;
      padding: 10px 18px;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      text-align: center;
    }
    @media (max-width: 480px) {
      .popup-inner {
        font-size: 14px;
        padding: 8px 14px;
      }
    }
  `;
  document.head.appendChild(style);

  // Danh sách bài nhạc
  const songs = [
    { name: "Bài hát 1", file: "https://files.catbox.moe/22en11.mp3" },
    { name: "Bài hát 2", file: "song2.mp3" },
    { name: "Bài hát 3", file: "song3.mp3" },
  ];

  let currentAudio = null;

  function playRandomSong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
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

  // Gán sự kiện sau khi phần tử đã được inject
  setTimeout(() => {
    const allowBtn = document.querySelector('.toast-accept');
    const declineBtn = document.querySelector('.toast-decline');
    const toast = document.getElementById('toast-prompt');

    allowBtn?.addEventListener('click', () => {
      toast.remove();
      playRandomSong();
    });

    declineBtn?.addEventListener('click', () => {
      toast.remove();
    });
  }, 100);
});

