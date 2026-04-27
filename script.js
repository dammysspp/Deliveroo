// ───────────────────────────────────────────
// ① NAVIGATION & SCROLL
// ───────────────────────────────────────────

// Nav scroll state
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => observer.observe(el));

// Parallax Handler
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
    // We use translate3d for hardware acceleration
    el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
  });
});

// ───────────────────────────────────────────
// ② COMPONENTS
// ───────────────────────────────────────────

// Hero search interaction
const searchBtn = document.querySelector('.hero-search-btn');
const searchInput = document.querySelector('.hero-search-input');
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const val = searchInput.value.trim();
    if (!val) { searchInput.focus(); return; }
    searchBtn.textContent = 'Finding food…';
    setTimeout(() => { searchBtn.textContent = 'Find food →'; }, 2000);
  });
}

// FAQ Accordion
function updateFaq(element, answer) {
  // Remove active class from all items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  // Add active class to clicked item
  element.classList.add('active');
  // Update answer text
  const ansBox = document.querySelector('.faq-ans-text');
  if (ansBox) {
    ansBox.style.opacity = 0;
    setTimeout(() => {
      ansBox.innerText = answer;
      ansBox.style.opacity = 1;
    }, 200);
  }
}

// ───────────────────────────────────────────
// ③ ROO AI CHAT (SECTION)
// ───────────────────────────────────────────

const chatMessages = document.getElementById('chatMessages');
const conversation = [
  { sender: 'roo', text: "Ẹ káàárọ̀! Good morning — you're in <strong>Lekki</strong>, and the Third Mainland is clear right now. What are we eating?" },
  { sender: 'user', text: "Find me the best suya spot nearby" },
  { sender: 'roo', text: "Oh wow — <strong>Mallam Musa's</strong> just opened a spot 1.2km from you on Admiralty Way! ⭐ 4.9. Want me to add it?" },
  { sender: 'user', text: "Yes please, and add some zobo too" },
  { sender: 'roo', text: "Done! 🌶️ Coming in 18 mins. Anything else? Maybe some plantain?" },
  { sender: 'user', text: "Always yes to plantain." },
  { sender: 'roo', text: "Haha, a true Lagosian! Added. Your total is ₦4,200. I'll let you know when the rider is 5 mins away." },
  { sender: 'user', text: "Thanks Roo!" },
  { sender: 'roo', text: "Anytime! 🧡 While you wait, want to see what's trending in Accra today?" },
  { sender: 'user', text: "Sure, show me." },
  { sender: 'roo', text: "Accra is all about <strong>Auntie Muni's Waakye</strong> today. 142 orders in the last hour! It's legendary." }
];

let currentIdx = 0;

function appendMessage(msg) {
  if (!chatMessages) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg from-${msg.sender}`;
  
  const avatar = msg.sender === 'roo' 
    ? `<div class="msg-av roo"><img src="assets/Roo.png" alt="Roo" style="width:180%;height:180%;object-fit:cover;object-position:center -60%;"></div>`
    : `<div class="msg-av user" style="background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);font-family:var(--font-label);font-weight:700;font-size:10px;display:flex;align-items:center;justify-content:center;">U</div>`;

  msgDiv.innerHTML = `
    ${avatar}
    <div class="msg-bubble ${msg.sender}">${msg.text}</div>
  `;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

function showTyping() {
  if (!chatMessages) return;
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg from-roo typing-msg';
  typingDiv.innerHTML = `
    <div class="msg-av roo"><img src="assets/Roo.png" alt="Roo" style="width:180%;height:180%;object-fit:cover;object-position:center -60%;"></div>
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
  return typingDiv;
}

async function startConversation() {
  if (!chatMessages) return;
  // Initial clear
  chatMessages.innerHTML = '';
  
  while (true) {
    const msg = conversation[currentIdx];
    
    if (msg.sender === 'roo') {
      const typing = showTyping();
      await new Promise(r => setTimeout(r, 2000));
      if (typing) typing.remove();
    } else {
      await new Promise(r => setTimeout(r, 1500));
    }

    appendMessage(msg);
    
    currentIdx = (currentIdx + 1) % conversation.length;
    
    // Wait before next message
    await new Promise(r => setTimeout(r, 2500));

    // Clear chat if it gets too long to maintain "infinite" feel
    if (chatMessages.children.length > 10) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
  }
}

// Typewriter Loop for Roo Section
const cityEl = document.getElementById('roo-city');
if (cityEl) {
  const cities = ['Lagos', 'Accra'];
  let cityIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentCity = cities[cityIdx];
    
    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    cityEl.innerText = currentCity.substring(0, charIdx);

    let typeSpeed = isDeleting ? 70 : 150;

    if (!isDeleting && charIdx === currentCity.length) {
      isDeleting = true;
      typeSpeed = 2500; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      cityIdx = (cityIdx + 1) % cities.length;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  }
  
  // Start typing
  setTimeout(type, 1000);
}

// ───────────────────────────────────────────
// ④ ROO CHAT WIDGET
// ───────────────────────────────────────────

let isChatOpen = false;
function toggleChat() {
  isChatOpen = !isChatOpen;
  const windowEl = document.getElementById('roo-chat-window');
  if (windowEl) {
    windowEl.style.display = isChatOpen ? 'flex' : 'none';
  }
  if(isChatOpen) {
    const badge = document.getElementById('roo-chat-badge');
    if (badge) badge.style.display = 'none';
  }
}

const sysPrompt = "You are Roo, an enthusiastic, friendly, and very helpful delivery assistant for Deliveroo's upcoming launch in West Africa (Lagos and Accra). You use emojis. You love food. Keep responses very short, punchy, and energetic. You talk like a local sometimes. Only output the chat response.";
let chatHistory = [{role: "system", content: sysPrompt}];

async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const msg = input.value.trim();
  if(!msg) return;
  
  // Add user message
  addMessage(msg, 'user');
  input.value = '';
  
  chatHistory.push({role: "user", content: msg});
  
  // Add loading
  const messagesDiv = document.getElementById('chat-messages');
  if (!messagesDiv) return;
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message bot loading';
  loadingDiv.innerText = 'Roo is typing...';
  messagesDiv.appendChild(loadingDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        messages: chatHistory,
        model: "openai",
        temperature: 0.7
      })
    });
    const data = await res.json();
    const reply = data.choices[0].message.content;
    
    // Remove loading
    if (messagesDiv.contains(loadingDiv)) {
      messagesDiv.removeChild(loadingDiv);
    }
    addMessage(reply, 'bot');
    chatHistory.push({role: "assistant", content: reply});
  } catch(e) {
    if (messagesDiv.contains(loadingDiv)) {
      messagesDiv.removeChild(loadingDiv);
    }
    addMessage("Oops! My connection dropped. 🛵💨 Try again?", 'bot');
  }
}

function addMessage(text, sender) {
  const messagesDiv = document.getElementById('chat-messages');
  if (!messagesDiv) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = text;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  if(sender === 'bot' && !isChatOpen) {
    const badge = document.getElementById('roo-chat-badge');
    if (badge) badge.style.display = 'block';
  }
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

// ───────────────────────────────────────────
// ⑤ COOKIE CONSENT
// ───────────────────────────────────────────

function dismissCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('show');
}

// ───────────────────────────────────────────
// ⑥ INITIALIZATION
// ───────────────────────────────────────────

window.addEventListener('load', () => {
  // Cookie banner reveal
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.add('show');
    }, 2000);
  }

  // Start the chat animation
  if (chatMessages) {
    setTimeout(startConversation, 1000);
  }
});

window.updateFaq = updateFaq;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.dismissCookies = dismissCookies;

// ───────────────────────────────────────────
// ⑦ GATEKEEPER LOGIC
// ───────────────────────────────────────────
const SITE_PASSWORD = 'RETE123#';

function unlockSite() {
  const input = document.getElementById('gatekeeper-input');
  const error = document.getElementById('gatekeeper-error');
  const gatekeeper = document.getElementById('gatekeeper');
  const preloader = document.getElementById('preloader');

  if (input.value === SITE_PASSWORD) {
    // 1. Hide gatekeeper
    gatekeeper.classList.add('unlocked');
    setTimeout(() => { 
      gatekeeper.style.display = 'none'; 
      
      // 2. Show preloader
      if (preloader) {
        preloader.style.display = 'flex';
        
        // 3. Animate progress bar
        const bar = document.getElementById('preloader-bar');
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress > 100) progress = 100;
          if (bar) bar.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              preloader.classList.add('fade-out');
              setTimeout(() => { preloader.style.display = 'none'; }, 1000);
            }, 500);
          }
        }, 200);
      }
    }, 600);
  } else {
    error.style.display = 'block';
    input.value = '';
    input.focus();
    setTimeout(() => { error.style.display = 'none'; }, 3000);
  }
}

// Ensure preloader is hidden on start until password is entered
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
});

window.unlockSite = unlockSite;

// ───────────────────────────────────────────
// ⑨ INTERACTIVE D3 WORLD MAP
// ───────────────────────────────────────────
function initWorldMap() {
    const container = d3.select("#d3-map-container");
    if (container.empty()) return;

    // Wait a moment for layout to settle
    setTimeout(() => {
        const rect = container.node().getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const projection = d3.geoMercator()
            .scale(width / 6.2)
            .translate([width / 2.1, height / 1.5]);

        const path = d3.geoPath().projection(projection);

        const markets = [
            // Established (Green)
            { name: "United Kingdom", coords: [-0.12, 51.5], type: "established" },
            { name: "France", coords: [2.35, 48.85], type: "established" },
            { name: "Italy", coords: [12.49, 41.9], type: "established" },
            { name: "Belgium", coords: [4.35, 50.85], type: "established" },
            { name: "UAE", coords: [55.3, 25.2], type: "established" },
            { name: "Kuwait", coords: [47.9, 29.3], type: "established" },
            { name: "Qatar", coords: [51.5, 25.2], type: "established" },
            { name: "Hong Kong", coords: [114.1, 22.3], type: "established" },
            { name: "Singapore", coords: [103.8, 1.35], type: "established" },

            // Upcoming (Red)
            { name: "Nigeria", coords: [3.37, 6.52], type: "upcoming" },
            { name: "Ghana", coords: [-0.18, 5.6], type: "upcoming" },
            { name: "Kenya", coords: [36.8, -1.28], type: "upcoming" },
            { name: "South Africa", coords: [18.4, -33.9], type: "upcoming" },
            { name: "Egypt", coords: [31.2, 30.0], type: "upcoming" },
            { name: "Morocco", coords: [-7.5, 33.5], type: "upcoming" },
            { name: "Senegal", coords: [-17.4, 14.7], type: "upcoming" }
        ];

        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {
            const countries = topojson.feature(data, data.objects.countries);

            // Draw map
            svg.append("g")
                .selectAll("path")
                .data(countries.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "#002b28")
                .attr("stroke", "#004943")
                .attr("stroke-width", 0.5)
                .style("transition", "fill 0.3s")
                .on("mouseover", function() { d3.select(this).attr("fill", "#004943"); })
                .on("mouseout", function() { d3.select(this).attr("fill", "#002b28"); });

            // Add markers
            const markerGroup = svg.append("g");

            const markers = markerGroup.selectAll(".market-marker")
                .data(markets)
                .enter().append("g")
                .attr("class", d => `market-marker ${d.type}`)
                .style("cursor", "pointer")
                .attr("transform", d => {
                    const p = projection(d.coords);
                    return `translate(${p[0]}, ${p[1]})`;
                });

            // Pulsing circles for upcoming
            markers.filter(d => d.type === 'upcoming')
                .append("circle")
                .attr("r", 5)
                .attr("fill", "#FF4D4D")
                .style("opacity", 0.4)
                .append("animate")
                .attr("attributeName", "r")
                .attr("values", "5;15;5")
                .attr("dur", "2s")
                .attr("repeatCount", "indefinite");

            markers.append("circle")
                .attr("r", d => d.type === 'upcoming' ? 5 : 4)
                .attr("fill", d => d.type === 'upcoming' ? '#FF4D4D' : '#4CAF50')
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("r", d.type === 'upcoming' ? 8 : 7);
                    // Could add tooltip logic here
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("r", d.type === 'upcoming' ? 5 : 4);
                });
        });
    }, 500);
}

// Start Map
initWorldMap();
