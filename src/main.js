import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cursor = document.querySelector('.cursor');
  const cursorTrail = document.querySelector('.cursor-trail');
  const introGate = document.getElementById('introGate');
  const dartGameContainer = document.getElementById('dartGameContainer');
  const dart = document.getElementById('dart');
  const targetBoard = document.getElementById('targetBoard');
  const bullseye = document.querySelector('.bullseye');
  const app = document.getElementById('app');
  const bgMusic = document.getElementById('bgMusic');
  const vhsToggle = document.getElementById('vhsToggle');
  const musicToggle = document.getElementById('musicToggle');
  const vhsOverlay = document.querySelector('.vhs-overlay');
  const controls = document.querySelector('.controls');
  const scenes = document.querySelectorAll('.scene');
  
  // Custom Cursor
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setTimeout(() => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
      }, 50);
    });
  }

  // Dart Game Logic
  let isDartThrown = false;
  let isGameWon = false;

  dartGameContainer.addEventListener('click', () => {
    if (isDartThrown || isGameWon) return;
    isDartThrown = true;

    // Throw animation
    dart.classList.add('thrown');

    // Check hit after a short delay (simulating travel time)
    setTimeout(() => {
      const dartRect = dart.getBoundingClientRect();
      const bullseyeRect = bullseye.getBoundingClientRect();

      // Simple collision detection (checking horizontal center overlap)
      const dartCenter = dartRect.left + dartRect.width / 2;
      const bullseyeCenter = bullseyeRect.left + bullseyeRect.width / 2;

      // Tolerance of 35px
      if (Math.abs(dartCenter - bullseyeCenter) < 35) {
        // Hit!
        isGameWon = true;
        dart.style.color = '#c7a492'; // success glow
        dart.style.textShadow = '0 0 20px #c7a492';
        
        // Pause target animation on hit
        const computedStyle = window.getComputedStyle(targetBoard);
        const currentLeft = computedStyle.getPropertyValue('left');
        targetBoard.style.animation = 'none';
        targetBoard.style.left = currentLeft;

        setTimeout(startGame, 1000);
      } else {
        // Miss!
        dart.classList.replace('thrown', 'miss');
        setTimeout(() => {
          dart.classList.remove('miss');
          isDartThrown = false;
        }, 800);
      }
    }, 400); // 0.4s is the transition time
  });

  // Start Cinematic Experience
  let isPlaying = false;
  
  function startGame() {
    introGate.classList.add('hidden');
    app.classList.add('visible');
    
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      isPlaying = true;
    }).catch(err => console.error("Audio playback failed:", err));

    setTimeout(() => {
      controls.classList.add('visible');
    }, 2000);

    runCinematicTimeline();
  }

  // Typewriter
  const lines = [
    { el: document.getElementById('line1'), text: "“some people don’t just exist...”" },
    { el: document.getElementById('line2'), text: "“they become a feeling.”" },
    { el: document.getElementById('line3'), text: "“you were always one of those people.”" }
  ];
  const titleReveal = document.getElementById('titleReveal');

  async function typeLine(lineObj, speed = 60) {
    return new Promise(resolve => {
      let i = 0;
      const interval = setInterval(() => {
        lineObj.el.textContent += lineObj.text.charAt(i);
        i++;
        if (i >= lineObj.text.length) {
          clearInterval(interval);
          setTimeout(resolve, 800);
        }
      }, speed);
    });
  }

  // Auto-Run Timeline
  async function runCinematicTimeline() {
    // Show Scene 1
    scenes[0].classList.add('active');
    
    // Run typewriter
    for (const line of lines) {
      await typeLine(line);
    }
    titleReveal.classList.add('visible');

    // Wait before moving to next scene
    await new Promise(r => setTimeout(r, 4000));
    
    // Cycle through the rest of the scenes
    for (let i = 1; i < scenes.length; i++) {
      scenes[i-1].classList.remove('active');
      scenes[i].classList.add('active');

      // Add fade-up effect to contents of the active scene
      const contents = scenes[i].querySelectorAll('.fade-up');
      contents.forEach(el => {
        el.style.transitionDelay = '0.5s';
        el.classList.add('in-view');
      });

      // Calculate duration: default 6-7 seconds, gallery scene stays forever
      if (i === scenes.length - 1) {
        populateGallery();
        break; // Stay on last scene
      } else {
        // Calculate duration based on text length or a fixed duration
        await new Promise(r => setTimeout(r, 6500));
        contents.forEach(el => {
          el.style.transitionDelay = '0s';
          el.classList.remove('in-view');
        });
        // small gap between scenes
        await new Promise(r => setTimeout(r, 800)); 
      }
    }
  }

  // Controls
  vhsToggle.addEventListener('click', () => {
    vhsOverlay.classList.toggle('hidden');
    vhsToggle.textContent = vhsOverlay.classList.contains('hidden') ? 'VHS: OFF' : 'VHS: ON';
  });

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.textContent = 'AUDIO: OFF';
    } else {
      bgMusic.play();
      musicToggle.textContent = 'AUDIO: ON';
    }
    isPlaying = !isPlaying;
  });

  // Populate Gallery
  function populateGallery() {
    const photos = [
      'WhatsApp Image 2026-05-24 at 2.39.31 PM.jpeg',
      'WhatsApp Image 2026-05-24 at 2.39.31 PM (1).jpeg',
      'WhatsApp Image 2026-05-24 at 2.39.31 PM (2).jpeg',
      'WhatsApp Image 2026-05-24 at 2.39.31 PM (3).jpeg'
    ];
    const captions = [
      "memories that stayed.",
      "our little archive.",
      "for the moments that mattered.",
      "always."
    ];
    const scrapbook = document.querySelector('.scrapbook');
    const finalTextOverlay = document.getElementById('finalTextOverlay');
    
    if(scrapbook.children.length > 0) return; // already populated
    
    // Hide text initially
    finalTextOverlay.style.opacity = '0';
    finalTextOverlay.style.transform = 'translateY(40px)';
    finalTextOverlay.style.transition = 'opacity 3s ease-out, transform 3s ease-out';
    
    const isMobile = window.innerWidth <= 768;
    let maxTop = 0;

    photos.forEach((photo, index) => {
      const div = document.createElement('div');
      div.className = 'polaroid';
      
      // Random positioning vertically over the scrapbook height
      const topPos = index * 45 + Math.random() * 10 + 10; // spread along vh
      maxTop = Math.max(maxTop, topPos);
      
      // Random horizontal placement
      let leftPos = Math.random() * 30 + 10; // 10% to 40%
      if (index % 2 === 1) leftPos = Math.random() * 30 + 40; // 40% to 70%
      if (isMobile) leftPos = Math.random() * 20 + 10; // more centered on mobile

      const rotation = Math.random() * 24 - 12; // -12deg to 12deg
      
      div.style.top = `${topPos}vh`;
      div.style.left = `${leftPos}%`;
      div.style.transform = `rotate(${rotation}deg)`;
      
      // Store final transform to apply when fading in
      div.dataset.rotation = rotation;
      
      const tape = document.createElement('div');
      tape.className = 'tape';
      
      const img = document.createElement('img');
      img.src = `./photos/${photo}`;
      img.alt = `Memory ${index + 1}`;
      
      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.textContent = captions[index];

      div.appendChild(tape);
      div.appendChild(img);
      div.appendChild(caption);
      scrapbook.appendChild(div);
      
      // Animate entry with delay
      setTimeout(() => {
        div.classList.add('in-view');
        div.style.transform = `rotate(${rotation}deg) scale(1)`; // restore scale if needed
      }, index * 1000 + 1500); // 1.5s delay to start, 1s between photos
    });
    
    // Dynamically set scrapbook height so text doesn't overlap
    scrapbook.style.minHeight = `${maxTop + 50}vh`;
    
    // Reveal final text after all photos are shown
    setTimeout(() => {
      finalTextOverlay.style.opacity = '1';
      finalTextOverlay.style.transform = 'translateY(0)';
    }, photos.length * 1000 + 2000);
  }
});
