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
    .toast-question { font-size: 17px; font-weight: 500; margin-bottom: 16px; }
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
    @property --border-angle-1 {
      syntax: "<angle>"; inherits: true; initial-value: 0deg;
    }
    @property --border-angle-2 {
      syntax: "<angle>"; inherits: true; initial-value: 90deg;
    }
    @property --border-angle-3 {
      syntax: "<angle>"; inherits: true; initial-value: 180deg;
    }
    :root {
      --bright-blue: rgb(0, 100, 255);
      --bright-green: rgb(0, 255, 0);
      --bright-red: rgb(255, 0, 0);
      --background: black;
      --foreground: white;
      --border-size: 2px;
      --border-radius: 0.75em;
    }
    @keyframes rotateBackground {
      to { --border-angle-1: 360deg; }
    }
    @keyframes rotateBackground2 {
      to { --border-angle-2: -270deg; }
    }
    @keyframes rotateBackground3 {
      to { --border-angle-3: 540deg; }
    }
    .popup {
      position: fixed; top: 20px; left: 50%;
      transform: scale(0.5); z-index: 1000;
      opacity: 0; pointer-events: none;
      transition: transform 0.5s ease, opacity 0.5s ease;
      transform-origin: center center;
    }
    .popup.show { transform: scale(1); opacity: 1; }
    .popup.hide { transform: scale(0.5); opacity: 0; }
    .popup.gradient-border {
      --border-angle-1: 0deg;
      --border-angle-2: 90deg;
      --border-angle-3: 180deg;
      padding: var(--border-size);
      background-image: conic-gradient(
          from var(--border-angle-1) at 10% 15%,
          transparent, var(--bright-blue) 10%, transparent 30%, transparent
        ),
        conic-gradient(
          from var(--border-angle-2) at 70% 60%,
          transparent, var(--bright-green) 10%, transparent 60%, transparent
        ),
        conic-gradient(
          from var(--border-angle-3) at 50% 20%,
          transparent, var(--bright-red) 10%, transparent 50%, transparent
        );
      animation:
        rotateBackground 3s linear infinite,
        rotateBackground2 8s linear infinite,
        rotateBackground3 13s linear infinite;
      border-radius: var(--border-radius);
    }
    .popup-inner {
      background: var(--background); padding: 12px 24px;
      border-radius: calc(var(--border-radius) - var(--border-size));
      color: var(--foreground); font-size: 16px; font-weight: bold;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);

  // Logic
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
    currentAudio.play();

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

  const allowBtn = document.querySelector('.toast-accept');
  const declineBtn = document.querySelector('.toast-decline');
  const toast = document.getElementById('toast-prompt');

  allowBtn.addEventListener('click', () => {
    toast.remove();
    playRandomSong();
  });

  declineBtn.addEventListener('click', () => {
    toast.remove();
  });
});
