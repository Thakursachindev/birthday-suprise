
document.addEventListener("DOMContentLoaded", () => {

  const pages = [...document.querySelectorAll(".page")];
  const music = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const stepCounter = document.getElementById("stepCounter");
  const flowerLayer = document.getElementById("flowerLayer");
  const toast = document.getElementById("toast");

  let currentPage = "home";
  let musicStarted = false;
  let toastTimer;

  const pageOrder = [
    "home",
    "tree",
    "gallery",
    "gift",
    "photo",
    "letter",
    "voice",
    "final"
  ];

  const completed = new Set();

  /* PHOTO CAPTIONS */

  const photoCaptions = [
    [
      "A Piece of my heart, written for you",
      "Some moments become precious simply because they're shared with you."
    ],
    [
      "A smile I adore",
      "Your smile has a way of making even an ordinary day feel brighter."
    ],
    [
      "Our little adventure",
      "Every little adventure feels better when you're right there."
    ],
    [
      "A favourite day",
      "If I could revisit a thousand moments, I'd still choose the ones with you."
    ],
    [
      "Just us",
      "The simplest moments with you often become my favourite memories."
    ],
    [
      "Always worth remembering",
      "A little snapshot of a feeling I want to keep forever."
    ]
  ];

  /* GIFT MESSAGES */

  const giftMessages = [
    [
      "A little reminder",
      "Whenever you doubt how wonderful you are, remember that you make someone's world brighter just by being in it. ❤️"
    ],
    [
      "A little promise",
      "I promise to keep cheering for you, laughing with you, and making room for new memories together. 🎀"
    ],
    [
      "A little wish",
      "May this year bring you gentle days, brave dreams, unexpected joy, and all the love your heart can hold. 💗"
    ]
  ];

  let photoIndex = 0;
  const openedGifts = new Set();
  let voicePlayedToEnd = false;
  let activeGiftIndex = null;


  /* TOAST MESSAGE */

  function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);

  }


  /* BACKGROUND MUSIC */

  function startMusic() {

    if (!music || musicStarted) return;

    music.volume = 0.42;

    music.play().then(() => {

      musicStarted = true;
      musicToggle.innerHTML = "♫ <span>Music on</span>";

    }).catch(() => {

      showToast("Add music.mp3, then tap Music to play it.");

    });

  }


  musicToggle.addEventListener("click", () => {

    if (!music) return;

    if (music.paused) {

      music.play().then(() => {

        musicStarted = true;
        musicToggle.innerHTML = "♫ <span>Music on</span>";

      }).catch(() => {

        showToast("Please add your music.mp3 file first.");

      });

    } else {

      music.pause();
      musicToggle.innerHTML = "♫ <span>Music off</span>";

    }

  });


  /* FLOATING FLOWERS */

  function flowerBurst(amount = 18) {

    const flowers = ["🌸", "🌷", "🌺", "✿", "💮"];

    for (let i = 0; i < amount; i++) {

      const flower = document.createElement("span");

      flower.className = "floating-flower";

      flower.textContent =
        flowers[Math.floor(Math.random() * flowers.length)];

      flower.style.left = `${Math.random() * 100}%`;

      flower.style.fontSize =
        `${14 + Math.random() * 17}px`;

      flower.style.setProperty(
        "--duration",
        `${3.5 + Math.random() * 3}s`
      );

      flower.style.setProperty(
        "--drift",
        `${-90 + Math.random() * 180}px`
      );

      flowerLayer.appendChild(flower);

      flower.addEventListener(
        "animationend",
        () => flower.remove(),
        { once: true }
      );

    }

  }


  /* PAGE COUNTER */

  function updateCounter(id) {

    const index = pageOrder.indexOf(id);

    stepCounter.textContent =
      `SURPRISE ${index + 1} OF ${pageOrder.length}`;

  }


  /* PAGE NAVIGATION AND LOCKING */

  function goTo(id) {

    const targetIndex = pageOrder.indexOf(id);
    const currentIndex = pageOrder.indexOf(currentPage);

    if (targetIndex < 0) return;

    // FINAL SURPRISE PROTECTION
    // Never allow the final page before the voice note finishes.

    if (id === "final" && !voicePlayedToEnd) {

      showToast("Listen to my voice note completely first. ❤️");

      return;

    }

    if (
      targetIndex > currentIndex &&
      !completed.has(currentPage)
    ) {

      showToast(
        "Complete this surprise first to unlock the next one. ♡"
      );

      return;

    }

    if (targetIndex > currentIndex + 1) {

      showToast("Follow the surprises one by one. ♡");

      return;

    }

    if (id === currentPage) return;

    const oldPage = document.getElementById(currentPage);
    const nextPage = document.getElementById(id);

    if (!oldPage || !nextPage) return;

    oldPage.classList.add("leaving");

    setTimeout(() => {

      oldPage.classList.remove("active", "leaving");
      oldPage.setAttribute("aria-hidden", "true");

      nextPage.classList.add("active");
      nextPage.setAttribute("aria-hidden", "false");

      currentPage = id;

      updateCounter(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      flowerBurst(22);

      if (id === "tree") {
        buildTreeLeaves();
      }

      if (id === "gallery") {
        renderPhoto();
      }

    }, 240);

  }

  window.goTo = goTo;


  function completePage(id) {

    completed.add(id);

    const next = document.querySelector(
      `#${id} .next-btn`
    );

    if (next) {
      next.disabled = false;
    }

  }


  /* STEP 1: ARCHERY */

  const shootArrow =
    document.getElementById("shootArrow");

  const targetHeart =
    document.getElementById("targetHeart");

  const continueButton =
    document.getElementById("continueButton");

  let arrowDone = false;


  shootArrow.addEventListener("click", () => {

    if (arrowDone) return;

    arrowDone = true;

    startMusic();

    shootArrow.disabled = true;
    shootArrow.classList.add("shoot");

    document.getElementById("archeryHint").textContent =
      "A little arrow, carrying a whole lot of love. ❤️";

    setTimeout(() => {

      targetHeart.classList.add("hit");

      flowerBurst(28);

    }, 650);


    setTimeout(() => {

      continueButton.disabled = false;

      completePage("home");

      showToast("Your first surprise is ready! ♡");

    }, 1250);

  });


  continueButton.addEventListener("click", () => {

    goTo("tree");

  });



  /* STEP 2: MAGICAL TREE */

  document
    .querySelector('#tree [data-next="gallery"]')
    .addEventListener("click", () => {

      goTo("gallery");

    });


  function buildTreeLeaves() {

    const holder =
      document.getElementById("treeLeaves");

    if (holder.childElementCount) return;

    const leaves = [
      [45, 12],
      [30, 22],
      [57, 25],
      [18, 35],
      [43, 38],
      [70, 39],
      [28, 51],
      [55, 52],
      [80, 55],
      [12, 61],
      [42, 67],
      [68, 70],
      [25, 79],
      [54, 83],
      [77, 24],
      [8, 45],
      [88, 44],
      [37, 8]
    ];

    leaves.forEach(([x, y], i) => {

      const leaf = document.createElement("span");

      leaf.className = "tree-leaf";

      leaf.textContent =
        ["🌸", "🌷", "🌺", "💮"][i % 4];

      leaf.style.left = `${x}%`;
      leaf.style.top = `${y}%`;

      leaf.style.animationDelay =
        `${1.1 + i * .09}s`;

      holder.appendChild(leaf);

    });


    setTimeout(() => {

      completePage("tree");

      showToast("Our little tree has bloomed. 🌸");

    }, 3400);

  }



  /* STEP 3: SIX-PHOTO GALLERY */

  const memoryPhoto =
    document.getElementById("memoryPhoto");

  const placeholder =
    document.getElementById("photoPlaceholder");

  const photoNumber =
    document.getElementById("photoNumber");

  const captionNumber =
    document.getElementById("captionNumber");

  const memoryTitle =
    document.getElementById("memoryTitle");

  const memoryText =
    document.getElementById("memoryText");

  const previousPhoto =
    document.getElementById("previousPhoto");

  const nextPhoto =
    document.getElementById("nextPhoto");

  const galleryContinue =
    document.getElementById("galleryContinue");

  const dots =
    document.getElementById("photoDots");


  function renderPhoto() {

    const number = photoIndex + 1;

    const filename = `photos/photo${number}.jpg`;

    memoryPhoto.alt = `Our memory ${number}`;

    memoryPhoto.style.display = "block";

    memoryPhoto.onerror = () => {

      memoryPhoto.style.display = "none";

      if (placeholder) {
        placeholder.style.display = "grid";
      }

      showToast(
        `Could not find ${filename}. Check your photos folder and filename.`
      );

    };


    memoryPhoto.onload = () => {

      memoryPhoto.style.display = "block";

      if (placeholder) {
        placeholder.style.display = "none";
      }

    };


    if (placeholder) {
      placeholder.style.display = "none";
    }

    memoryPhoto.src = filename;


    photoNumber.textContent =
      `${String(number).padStart(2, "0")} / 06`;

    captionNumber.textContent =
      String(number).padStart(2, "0");


    memoryTitle.textContent =
      photoCaptions[photoIndex][0];

    memoryText.textContent =
      photoCaptions[photoIndex][1];


    previousPhoto.disabled =
      photoIndex === 0;


    nextPhoto.textContent =
      photoIndex === 5
        ? "All memories seen ✓"
        : "Next memory →";

    nextPhoto.disabled =
      photoIndex === 5;


    dots.innerHTML = "";

    for (let i = 0; i < 6; i++) {

      const dot = document.createElement("span");

      dot.className =
        `dot${i === photoIndex ? " current" : ""}`;

      dots.appendChild(dot);

    }


    if (photoIndex === 5) {

      completePage("gallery");

      galleryContinue.disabled = false;

      document.getElementById(
        "galleryUnlockNote"
      ).textContent =
        "All six memories unlocked the next surprise. ♡";

    }

  }


  previousPhoto.addEventListener("click", () => {

    if (photoIndex > 0) {

      photoIndex--;

      renderPhoto();

      flowerBurst(10);

    }

  });


  nextPhoto.addEventListener("click", () => {

    if (photoIndex < 5) {

      photoIndex++;

      renderPhoto();

      flowerBurst(18);

    }

  });


  galleryContinue.addEventListener("click", () => {

    goTo("gift");

  });



  /* STEP 4: SURPRISE GIFT BOXES */

  const giftModal =
    document.getElementById("giftModal");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalMessage =
    document.getElementById("modalMessage");

  const giftCards = [
    ...document.querySelectorAll(".gift-card")
  ];

  const giftContinue =
    document.getElementById("giftContinue");


  function closeGiftModal() {

    giftModal.classList.remove("show");

    giftModal.setAttribute(
      "aria-hidden",
      "true"
    );

    if (activeGiftIndex !== null) {

      openedGifts.add(activeGiftIndex);

      giftCards[activeGiftIndex]
        .classList.add("opened");

      giftCards[activeGiftIndex]
        .querySelector("b")
        .textContent = "Opened ♡";

      document.getElementById(
        "giftProgress"
      ).textContent =
        `${openedGifts.size} of 3 surprises opened`;

      flowerBurst(22);


      if (openedGifts.size === 3) {

        completePage("gift");

        showToast(
          "All your little gifts are open! 💝"
        );

      }

      activeGiftIndex = null;

    }

  }


  giftCards.forEach(card => {

    card.addEventListener("click", () => {

      const index = Number(card.dataset.gift);

      if (openedGifts.has(index)) {

        showToast(
          "You have already opened this little gift. ♡"
        );

        return;

      }

      activeGiftIndex = index;

      modalTitle.textContent =
        giftMessages[index][0];

      modalMessage.textContent =
        giftMessages[index][1];

      giftModal.classList.add("show");

      giftModal.setAttribute(
        "aria-hidden",
        "false"
      );

      flowerBurst(24);

    });

  });


  document
    .getElementById("closeGiftModal")
    .addEventListener("click", closeGiftModal);


  document
    .getElementById("modalDone")
    .addEventListener("click", closeGiftModal);


  giftModal.addEventListener("click", event => {

    if (event.target === giftModal) {

      closeGiftModal();

    }

  });


  giftContinue.addEventListener("click", () => {

    goTo("photo");

  });



  /* STEP 5: SPECIAL PHOTO */

  document
    .querySelector('#photo [data-next="letter"]')
    .addEventListener("click", () => {

      completePage("photo");

      goTo("letter");

    });



  /* STEP 6: LOVE LETTER */

  const letterRead =
    document.getElementById("letterRead");

  const letterContinue =
    document.getElementById("letterContinue");


  letterRead.addEventListener("change", () => {

    letterContinue.disabled =
      !letterRead.checked;

    if (letterRead.checked) {

      completePage("letter");

      flowerBurst(18);

    }

  });


  letterContinue.addEventListener("click", () => {

    goTo("voice");

  });



  /* STEP 7: VOICE NOTE */

  const audioPlayer =
    document.getElementById("audioPlayer");

  const voiceContinue =
    document.getElementById("voiceContinue");

  const voiceStatus =
    document.getElementById("voiceStatus");


  // Final surprise is locked initially

  voicePlayedToEnd = false;

  voiceContinue.disabled = true;


  // Check that the entire recording has been played
  // This also prevents unlocking by dragging the audio
  // directly to the end.

  function hasPlayedEntireAudio() {

    const duration = audioPlayer.duration;
    const played = audioPlayer.played;

    if (!Number.isFinite(duration) || duration <= 0) {
      return false;
    }

    if (played.length === 0) {
      return false;
    }

    let coveredUntil = 0;

    for (let i = 0; i < played.length; i++) {

      const start = played.start(i);
      const end = played.end(i);

      if (start > coveredUntil + 0.35) {
        return false;
      }

      coveredUntil = Math.max(coveredUntil, end);

    }

    return coveredUntil >= duration - 0.5;

  }


  // Update audio progress bar

  audioPlayer.addEventListener("timeupdate", () => {

    if (audioPlayer.duration) {

      document.getElementById(
        "audioProgress"
      ).style.width =
        `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;

    }

  });


  // Keep the final surprise locked if audio is restarted

  audioPlayer.addEventListener("play", () => {

    if (!voicePlayedToEnd) {
      voiceContinue.disabled = true;
    }

  });


  // Unlock only when the complete recording finishes

  audioPlayer.addEventListener("ended", () => {

    if (!hasPlayedEntireAudio()) {

      voicePlayedToEnd = false;

      voiceContinue.disabled = true;

      showToast(
        "Please listen to the entire voice note first. ❤️"
      );

      audioPlayer.currentTime = 0;

      return;

    }

    voicePlayedToEnd = true;

    voiceContinue.disabled = false;

    if (voiceStatus) {

      voiceStatus.textContent =
        "A little message, heard all the way through. ♡";

    }

    completePage("voice");

    flowerBurst(24);

    showToast(
      "Your final surprise is unlocked! ❤️"
    );

  });


  // Final surprise button

  voiceContinue.addEventListener("click", () => {

    if (!voicePlayedToEnd) {

      showToast(
        "Listen to my voice note completely first. ❤️"
      );

      return;

    }

    goTo("final");

  });



  /* RESTART THE WHOLE EXPERIENCE */

  document
    .getElementById("restartButton")
    .addEventListener("click", () => {

      completed.clear();

      currentPage = "final";

      photoIndex = 0;

      openedGifts.clear();


      giftCards.forEach(card => {

        card.classList.remove("opened");

        card.querySelector("b").textContent =
          "Open me";

      });


      document.getElementById(
        "giftProgress"
      ).textContent =
        "0 of 3 surprises opened";


      // Reset love letter

      letterRead.checked = false;

      letterContinue.disabled = true;


      // Reset voice note WITHOUT removing voice.mp3

      voicePlayedToEnd = false;

      voiceContinue.disabled = true;

      audioPlayer.pause();

      audioPlayer.currentTime = 0;

      audioPlayer.load();


      if (voiceStatus) {

        voiceStatus.textContent =
          "Listen whenever you miss me. ❤️";

      }


      document.getElementById(
        "audioProgress"
      ).style.width = "0%";


      // Reset archery

      arrowDone = false;

      shootArrow.disabled = false;

      shootArrow.classList.remove("shoot");

      targetHeart.classList.remove("hit");

      continueButton.disabled = true;


      // Reset all pages

      pages.forEach(page => {

        page.classList.remove("active", "leaving");

        page.setAttribute(
          "aria-hidden",
          "true"
        );

      });


      const home =
        document.getElementById("home");

      home.classList.add("active");

      home.setAttribute(
        "aria-hidden",
        "false"
      );


      currentPage = "home";

      updateCounter("home");

      renderPhoto();


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      flowerBurst(30);

    });



  /* BUTTON CLICK ANIMATION */

  document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

      if (
        !button.disabled &&
        !button.closest(".modal-backdrop")
      ) {

        button.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(.96)" },
            { transform: "scale(1)" }
          ],
          { duration: 220 }
        );

      }

    });

  });



  /* INITIAL SETUP */

  renderPhoto();

  updateCounter("home");


});
