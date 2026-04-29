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
        
        // 3. Animate progress orb
        const orb = document.getElementById('preloader-orb');
        const circumference = 2 * Math.PI * 48; // r=48
        if (orb) {
          orb.style.strokeDasharray = circumference;
          orb.style.strokeDashoffset = circumference;
        }

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 8; // Slower, smoother loading
          if (progress > 100) progress = 100;
          
          if (orb) {
            const offset = circumference - (progress / 100) * circumference;
            orb.style.strokeDashoffset = offset;
          }
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              preloader.classList.add('fade-out');
              setTimeout(() => { preloader.style.display = 'none'; }, 1000);
            }, 800);
          }
        }, 150);
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

        const marketStats = {
            826: { name: "United Kingdom", type: "established", cities: "250+", restaurants: "50k+", riders: "50k+" },
            250: { name: "France", type: "established", cities: "150+", restaurants: "20k+", riders: "30k+" },
            380: { name: "Italy", type: "established", cities: "30+", restaurants: "15k+", riders: "20k+" },
            56: { name: "Belgium", type: "established", cities: "15+", restaurants: "3k+", riders: "5k+" },
            784: { name: "UAE", type: "established", cities: "5+", restaurants: "8k+", hubs: "Editions Kitchens" },
            414: { name: "Kuwait", type: "established", cities: "3+", restaurants: "2k+", status: "Top 3 Market" },
            634: { name: "Qatar", type: "established", cities: "2+", restaurants: "1.5k+", status: "Rapid Growth" },
            702: { name: "Singapore", type: "established", cities: "Island-wide", restaurants: "10k+", riders: "10k+" },
            344: { name: "Hong Kong", type: "established", status: "Strategic Hub", restaurants: "8k+" },
            566: { name: "Nigeria", type: "upcoming", target: "Lagos & Abuja", launch: "Q4 2026", partners: "500+ Waitlist" },
            288: { name: "Ghana", type: "upcoming", target: "Accra", launch: "Q1 2027", partners: "300+ Waitlist" },
            404: { name: "Kenya", type: "upcoming", target: "Nairobi", launch: "2027", status: "Planning Phase" },
            710: { name: "South Africa", type: "upcoming", target: "Cape Town", launch: "2027", status: "Market Research" },
            818: { name: "Egypt", type: "upcoming", target: "Cairo", launch: "2027", status: "Scouting" },
            504: { name: "Morocco", type: "upcoming", target: "Casablanca", launch: "2027", status: "Strategic Interest" },
            686: { name: "Senegal", type: "upcoming", target: "Dakar", launch: "2027", status: "Exploration" }
        };

        const tooltip = d3.select("body").append("div")
            .attr("class", "map-tooltip")
            .style("opacity", 0);

        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {
            const countries = topojson.feature(data, data.objects.countries);
            const establishedIds = [826, 250, 380, 56, 784, 414, 634, 702, 344];
            const upcomingIds = [566, 288, 404, 710, 818, 504, 686];

            svg.append("g")
                .selectAll("path")
                .data(countries.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => {
                    const id = parseInt(d.id);
                    if (establishedIds.includes(id)) return '#4CAF50';
                    if (upcomingIds.includes(id)) return '#FF4D4D';
                    return '#002b28';
                })
                .attr("stroke", "#004943")
                .attr("stroke-width", 0.5)
                .style("transition", "fill 0.3s, filter 0.3s")
                .on("mouseover", function(event, d) { 
                    const id = parseInt(d.id);
                    const stats = marketStats[id];
                    if (!stats) return;

                    d3.select(this)
                        .attr("fill", establishedIds.includes(id) ? '#66BB6A' : '#FF6666')
                        .style("filter", "brightness(1.2)");

                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`
                        <div class="tooltip-header">
                            <span class="status-dot ${stats.type}"></span>
                            <strong>${stats.name}</strong>
                        </div>
                        <div class="tooltip-body">
                            ${stats.cities ? `<div class="stat-row"><span>Cities</span><strong>${stats.cities}</strong></div>` : ''}
                            ${stats.restaurants ? `<div class="stat-row"><span>Restaurants</span><strong>${stats.restaurants}</strong></div>` : ''}
                            ${stats.riders ? `<div class="stat-row"><span>Riders</span><strong>${stats.riders}</strong></div>` : ''}
                            ${stats.target ? `<div class="stat-row"><span>Focus</span><strong>${stats.target}</strong></div>` : ''}
                            ${stats.launch ? `<div class="stat-row"><span>Launch</span><strong>${stats.launch}</strong></div>` : ''}
                            ${stats.partners ? `<div class="stat-row"><span>Partners</span><strong>${stats.partners}</strong></div>` : ''}
                            ${stats.status ? `<div class="stat-row"><span>Status</span><strong>${stats.status}</strong></div>` : ''}
                        </div>
                    `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 15) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(event, d) { 
                    const id = parseInt(d.id);
                    d3.select(this)
                        .attr("fill", establishedIds.includes(id) ? '#4CAF50' : (upcomingIds.includes(id) ? '#FF4D4D' : '#002b28'))
                        .style("filter", "none");
                    tooltip.transition().duration(500).style("opacity", 0);
                });
        });
    }, 500);
}

// Start Map
initWorldMap();

// Scatter cultural elements
function scatterCulturalElements() {
    const images = ['assets/element-drum.png', 'assets/element-fan.png', 'assets/element-mask.png'];
    const sections = document.querySelectorAll('.cultural-pattern');
    
    sections.forEach(section => {
        // Add 2 to 3 elements per section
        const count = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < count; i++) {
            const img = document.createElement('img');
            img.src = images[Math.floor(Math.random() * images.length)];
            img.className = 'floating-culture';
            
            // Randomize position avoiding the absolute center to prevent blocking main content
            const isLeft = Math.random() > 0.5;
            const top = Math.random() * 80 + 10; // 10% to 90%
            const leftPos = isLeft ? Math.random() * 30 : (Math.random() * 30 + 70); // 0-30% or 70-100%
            
            img.style.top = `${top}%`;
            img.style.left = `${leftPos}%`;
            
            // Randomize rotation and size
            const rot = Math.random() * 360;
            const scale = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
            img.style.transform = `rotate(${rot}deg) scale(${scale})`;
            
            // Randomize animation delay to make them float independently
            img.style.animationDelay = `${Math.random() * 5}s`;
            
            section.appendChild(img);
        }
    });
}
scatterCulturalElements();
