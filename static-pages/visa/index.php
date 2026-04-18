<?php
session_start();

// SHA-256 hash of the password. The password itself is not stored in plain text here.
$passwordHash = '40379ac9a12a62e754220f8d1fad359a8763379761f87e79e2ba88ef7f7cb290';
$isUnlocked = !empty($_SESSION['visa_application_unlocked']);
$authError = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $submittedPassword = $_POST['password'] ?? '';

  if (hash_equals($passwordHash, hash('sha256', $submittedPassword))) {
    $_SESSION['visa_application_unlocked'] = true;
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
  }

  $authError = true;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sasha Milshtein. Visa Application Supplemental Questions</title>
  <style>
    :root {
      --bg: #0b1020;
      --bg-soft: #121936;
      --panel: rgba(18, 25, 54, 0.78);
      --panel-2: rgba(15, 21, 46, 0.92);
      --line: rgba(255,255,255,0.1);
      --line-strong: rgba(255,255,255,0.18);
      --text: #eef2ff;
      --muted: #b8c0ea;
      --accent: #1a1f71;
      --accent-2: #1434cb;
      --accent-3: #f7b600;
      --accent-4: #ff8f1f;
      --shadow: 0 24px 70px rgba(0,0,0,0.35);
      --radius-xl: 28px;
      --radius-lg: 22px;
      --radius-md: 16px;
      --maxw: 1380px;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top left, rgba(20,52,203,0.22), transparent 30%),
        radial-gradient(circle at top right, rgba(247,182,0,0.12), transparent 26%),
        linear-gradient(180deg, #090d1b 0%, #0b1020 100%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(circle at center, black, transparent 82%);
    }

    button, input, textarea { font: inherit; }

    .page {
      width: min(calc(100% - 28px), var(--maxw));
      margin: 14px auto 28px;
      position: relative;
      z-index: 1;
    }

    .glass {
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .topbar {
      position: sticky;
      top: 10px;
      z-index: 40;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border-radius: 22px;
      padding: 12px 16px;
      margin-bottom: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(20,52,203,0.95), rgba(247,182,0,0.92));
      display: grid;
      place-items: center;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: white;
      flex: 0 0 auto;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.14);
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .brand-text { min-width: 0; }

    .eyebrow {
      color: var(--muted);
      font-size: 1.12rem;
      letter-spacing: 0.005em;
      text-transform: none;
      margin-bottom: 2px;
      line-height: 1.2;
      max-width: 42ch;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.12rem, 1.9vw, 1.72rem);
      letter-spacing: -0.04em;
      line-height: 1.02;
      font-weight: 800;
      max-width: 22ch;
    }

    .top-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      min-height: 40px;
      color: var(--muted);
      font-size: 0.9rem;
      text-align: right;
      line-height: 1.5;
    }

    .top-meta img {
      max-width: 92px;
      max-height: 28px;
      width: auto;
      height: auto;
      display: block;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(280px, max-content) 1fr;
      gap: 18px;
      align-items: stretch;
    }

    .layout.locked {
      grid-template-columns: 1fr;
      max-width: 760px;
      margin: 0 auto;
    }

    .sidebar {
      width: fit-content;
      min-width: 280px;
      max-width: 460px;
      position: sticky;
      top: 106px;
      padding: 0;
      display: block;
      height: fit-content;
      align-self: start;
      background: transparent;
      border: 0;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }

    .side-title,
    .stage-label {
      margin: 0;
      color: #aab4e8;
      font-size: 0.76rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .menu {
      width: 100%;
      display: grid;
      gap: 9px;
    }

    .mobile-question-select-wrap { display: none; }

    .mobile-question-select {
      width: 100%;
      border: 1px solid rgba(247,182,0,0.24);
      background: linear-gradient(180deg, rgba(20,52,203,0.16), rgba(20,52,203,0.08));
      color: #ffffff;
      padding: 13px 14px;
      border-radius: 16px;
      font-size: 0.98rem;
      outline: none;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .mobile-question-select option { color: #111827; }

    .question-btn {
      width: 100%;
      text-align: left;
      border: 1px solid rgba(247,182,0,0.24);
      background: linear-gradient(180deg, rgba(20,52,203,0.16), rgba(20,52,203,0.08));
      color: #e6ebff;
      padding: 14px 14px;
      border-radius: 16px;
      cursor: pointer;
      transition: transform 150ms ease, background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
      line-height: 1.35;
      font-size: 0.92rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .question-btn:hover {
      transform: translateX(3px);
      color: #ffffff;
      background: linear-gradient(135deg, rgba(20,52,203,0.3), rgba(247,182,0,0.22));
      border-color: rgba(255,143,31,0.62);
      box-shadow: 0 10px 28px rgba(0,0,0,0.2);
    }

    .question-btn.active {
      color: #ffffff;
      background: linear-gradient(135deg, rgba(20,52,203,0.42), rgba(247,182,0,0.28));
      border-color: rgba(247,182,0,0.72);
      box-shadow: 0 12px 30px rgba(0,0,0,0.22);
    }

    .stage {
      border-radius: 30px;
      padding: 20px;
      min-height: auto;
      display: grid;
      gap: 18px;
      align-content: start;
    }

    .stage-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .stage-head-left {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      flex-wrap: nowrap;
      min-height: 30px;
    }

    .counter {
      padding: 0;
      border-radius: 0;
      background: transparent;
      border: 0;
      color: var(--muted);
      font-size: 0.76rem;
      line-height: 1;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      margin-top: 1px;
    }

    .slide {
      display: block;
      min-height: auto;
    }

    .answer-panel {
      border-radius: 26px;
      background: var(--panel-2);
      border: 1px solid var(--line);
      overflow: hidden;
      height: fit-content;
      display: flex;
      flex-direction: column;
    }

    .answer-inner {
      padding: 22px 24px;
      overflow: visible;
      height: auto;
    }

    .question-title {
      margin: 0 0 14px;
      font-size: 1.34rem;
      line-height: 1.28;
      letter-spacing: -0.02em;
      max-width: none;
      font-weight: 700;
    }

    .answer-block {
      color: #edf1ff;
      font-size: 1.08rem;
      line-height: 1.72;
      display: grid;
      gap: 14px;
    }

    .answer-block p { margin: 0; }

    .signature-block {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      line-height: 1.7;
    }

    .signature-line {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .signature-icon {
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      color: var(--muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .signature-icon svg {
      width: 16px;
      height: 16px;
      display: block;
      fill: currentColor;
    }

    .label-strong {
      font-weight: 700;
      color: #ffffff;
    }

    .answer-link-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 11px 16px;
      border-radius: 999px;
      border: 1px solid rgba(247,182,0,0.34);
      background: linear-gradient(180deg, rgba(20,52,203,0.22), rgba(20,52,203,0.1));
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      width: fit-content;
      transition: transform 150ms ease, background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .answer-link-btn:hover {
      transform: translateY(-1px);
      background: linear-gradient(135deg, rgba(20,52,203,0.32), rgba(247,182,0,0.22));
      border-color: rgba(255,143,31,0.65);
      box-shadow: 0 10px 26px rgba(0,0,0,0.18);
    }

    .auth-panel {
      display: grid;
      gap: 16px;
      max-width: 520px;
    }

    .auth-copy {
      color: var(--muted);
      line-height: 1.65;
      font-size: 1rem;
    }

    .auth-field {
      display: grid;
      gap: 8px;
    }

    .auth-label {
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #aab4e8;
    }

    .auth-input {
      width: 100%;
      border: 1px solid rgba(247,182,0,0.24);
      background: linear-gradient(180deg, rgba(20,52,203,0.12), rgba(20,52,203,0.06));
      color: #ffffff;
      padding: 14px 16px;
      border-radius: 16px;
      outline: none;
    }

    .auth-input:focus {
      border-color: rgba(247,182,0,0.6);
      box-shadow: 0 0 0 3px rgba(247,182,0,0.12);
    }

    .auth-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .auth-error {
      color: #ffd88a;
      font-size: 0.95rem;
      display: none;
    }

    .auth-error.show { display: block; }

    .nav-controls {
      display: flex;
      gap: 10px;
    }

    .nav-btn {
      border: 1px solid rgba(247,182,0,0.24);
      background: linear-gradient(180deg, rgba(20,52,203,0.18), rgba(20,52,203,0.08));
      color: #ffffff;
      border-radius: 999px;
      padding: 10px 14px;
      cursor: pointer;
      transition: transform 150ms ease, background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }

    .nav-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: linear-gradient(135deg, rgba(20,52,203,0.28), rgba(247,182,0,0.2));
      border-color: rgba(255,143,31,0.6);
      box-shadow: 0 10px 26px rgba(0,0,0,0.18);
    }

    .nav-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    @media (max-width: 1120px) {
      .layout { grid-template-columns: 1fr; }
      .stage { min-height: auto; }
    }

    @media (max-width: 1280px) {
      .page {
        width: min(calc(100% - 16px), var(--maxw));
        margin-top: 8px;
      }

      .topbar,
      .sidebar,
      .stage,
      .answer-panel {
        border-radius: 20px;
      }

      .topbar {
        position: sticky;
        top: 8px;
        padding: 12px;
      }

      .layout { grid-template-columns: 1fr; }
      .sidebar { display: none; }

      .mobile-question-select-wrap {
        display: block;
        margin-bottom: 14px;
      }

      .brand { align-items: flex-start; }
      .top-meta { display: none; }
      .answer-inner { padding: 18px; }
      .question-title { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="topbar glass">
      <div class="brand">
        <div class="avatar" aria-label="Sasha photo">
          <img src="sashaphoto.jpeg" alt="Alexandra Sasha Milshtein" />
        </div>
        <div class="brand-text">
          <h1>Alexandra "Sasha" Milshtein</h1>
          <div class="eyebrow">I am everywhere Visa wants me to be</div>
        </div>
      </div>
      <div class="top-meta" aria-label="Visa logo">
        <img src="Visa-logo-white.webp" alt="Visa logo" />
      </div>
    </header>

    <?php if (!$isUnlocked): ?>
      <div class="layout locked">
        <main class="stage glass">
          <section class="slide">
            <article class="answer-panel">
              <div class="answer-inner">
                <h2 class="question-title">Protected Access</h2>
                <div class="answer-block">
                  <form class="auth-panel" method="post" action="">
                    <p class="auth-copy">Please enter the password to view Sasha’s application responses.</p>
                    <div class="auth-field">
                      <label class="auth-label" for="passwordInput">Password</label>
                      <input class="auth-input" id="passwordInput" name="password" type="password" autocomplete="current-password" autofocus />
                    </div>
                    <div class="auth-actions">
                      <button class="nav-btn" type="submit">Open</button>
                    </div>
                    <?php if ($authError): ?>
                      <div class="auth-error show">Incorrect password, try again.</div>
                    <?php endif; ?>
                  </form>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    <?php else: ?>
      <div class="layout">
        <aside class="sidebar glass">
          <div>
            <div class="menu" id="questionMenu"></div>
          </div>
        </aside>

        <main class="stage glass">
          <div class="mobile-question-select-wrap">
            <select class="mobile-question-select" id="mobileQuestionSelect" aria-label="Choose a question"></select>
          </div>
          <div class="stage-head">
            <div class="stage-head-left">
              <div class="stage-label">Answer</div>
              <div class="counter" id="counter"></div>
            </div>
            <div class="nav-controls">
              <button class="nav-btn" id="prevBtn" type="button">Previous</button>
              <button class="nav-btn" id="nextBtn" type="button">Next</button>
            </div>
          </div>

          <section class="slide">
            <article class="answer-panel">
              <div class="answer-inner">
                <h2 class="question-title" id="questionTitle"></h2>
                <div class="answer-block" id="answerBlock"></div>
              </div>
            </article>
          </section>
        </main>
      </div>

      <script>
        const qaItems = [
          {
            question: 'Introduction',
            answer: [
              'Hello. I am Sasha Milshtein, and I am excited to apply for Visa\'s Sales Development Program. I like roles where communication drives outcomes, structure matters, and follow-through is the difference between interest and action.'
            ],
            cta: {
              label: 'Sasha Milshtein Resume',
              href: 'https://www.sashamilshtein.com/'
            }
          },
          {
            question: 'Graduation & Start Date Confirmation',
            answer: [
              'My expected graduation date is May 2026. I’m available to start full-time in August/September 2026 and can fully commit to the program’s structured onboarding timeline.'
            ]
          },
          {
            question: 'Location & Hybrid Work Confirmation',
            answer: [
              'Yes, I am willing to work onsite in Atlanta for Year 1 and open to relocating to a U.S. field sales location for Year 2. I’m comfortable with Visa’s hybrid requirement and value in-person collaboration, coaching, and relationship building.'
            ]
          },
          {
            question: 'Work Authorization',
            answer: [
              'Yes, I am a U.S. citizen and will not require sponsorship now or in the future.'
            ]
          },
          {
            question: 'What specifically interests you about starting your career in sales, and what drew you to Visa’s Sales Development Program?',
            answer: [
              'I’m choosing sales because I like being accountable for an outcome: not just completing tasks, but moving a decision forward. The Visa Sales Development Program stands out because it is built to develop sellers through structured training, real pipeline responsibility, and exposure to both digital and enterprise selling.',
              'I’ve consistently done well in roles where I have to learn an audience quickly, turn information into clear outreach, and follow through with discipline. I also work best in environments where there are clear expectations, tight feedback loops, and room to improve through repetition. That kind of structure helps me get better quickly and stay consistent over time.',
              'I’m motivated by selling in a space where trust, risk management, and reliability matter — because payments are mission-critical.',
              'At Per Scholas, I worked with Salesforce and Airtable to improve outreach targeting and pipeline tracking. A big part of the work was making sure information was clean and usable so follow-ups and targeting could actually happen without things slipping through. It showed me how much structure and consistency matter when you’re trying to turn outreach into real engagement.',
              'As a marketing associate, I worked on targeted campaigns where I used performance data to adjust messaging and timing. Those campaigns led to a 50% increase in engagement and contributed to a 10% lift in sales. What I learned from that is how small changes in wording, targeting, or timing can show up quickly in results when you’re paying attention to the data.',
              'Sales feels like a natural fit for that kind of work because it’s structured, measurable, and depends on follow-through over time. It’s less about getting things right once and more about improving through repetition, feedback, and consistency.',
              'Visa is a strong fit for that because it sits at the intersection of technology, data, and client growth, and operates at a global scale where decisions depend on trust, timing, and clear communication. I’m interested in building the habits of a seller who is prepared, coachable, and consistent in that kind of environment.'
            ]
          },
          {
            question: 'Tell us about a professional, academic, or extracurricular experience where you influenced an outcome.',
            answer: [
              'As Vice President of Recruitment for Kappa Alpha Theta, I led a nine-month recruitment process with a team of over 100 members and a $5K budget. I had identified the role early on and spent time before stepping in observing multiple recruitment cycles to understand what consistently broke down.',
              'The same issues showed up each year: late planning, unclear ownership, and uneven training, which led to confusion and long hours during execution. I focused on fixing those problems before recruitment started instead of reacting to them in real time.',
              'I built the full recruitment timeline, created a budgeting system, and standardized training materials so the team was working from one set of expectations. I also taught myself Excel to build tracking tools for scheduling and budgeting, and used those systems to manage execution more cleanly. To ensure adoption, I ran training sessions so the team could actually use the tools without relying on a few people.',
              'I introduced weekly checkpoints with clear owners for each workstream so responsibilities stayed consistent throughout the year instead of piling up at the end.',
              'When recruitment ran, execution was more controlled and required fewer last-minute changes than previous years. We brought in a new member class of 50, the largest on campus, and the team moved through the process with fewer breakdowns in coordination.'
            ]
          },
          {
            question: 'Describe any experience you’ve had using GenAI tools, or explain how you would be interested in learning to use them in a sales or client-facing role.',
            answer: [
              'I use generative AI as a productivity and support tool to speed up research, organize information, and improve clarity in my work, while still verifying everything myself. I’ve also completed a GenAI for Marketing Professionals certificate, which helped me think more intentionally about how to use these tools in real work settings.',
              'Account research: I’ve used AI to support outreach work focused on sustainability partnerships. I generated an initial list of potential companies aligned with our goals, then verified them through LinkedIn and company websites before identifying relevant contacts for outreach. It helped speed up the research process, but I still handled the judgment around who made sense to pursue.',
              'Personalized outreach: I use AI to draft and refine messaging for outreach and networking, especially when I want to test different ways of framing the same idea. I focus on improving clarity and tone, then adjust based on the audience rather than using it as-is.',
              'Call preparation: I’ve used AI in school projects and case simulations to prepare for structured discussions. For example, in a Blue Ocean strategy simulation, I used it to break down large case materials and organize the key differences between product paths so I could focus more on decision-making instead of getting stuck in the reading.',
              'Post-call follow-up: In both group and work settings, I’ve used AI to help structure notes and summarize information into clearer next steps or action items, especially when working across multiple inputs. I still make sure everything is accurate and adjusted to context before sharing anything.'
            ],
            trailing: [
              'I’m careful about data privacy and don’t input sensitive or confidential information. I use AI as a support tool to work more efficiently and stay organized, not as a replacement for judgment or decision-making.'
            ]
          },
          {
            question: 'Conclusion',
            answer: [
              'I’m coachable, data-driven, and I like owning measurable outcomes. That is why this program is the right fit. I’m looking for a role where I can build strong fundamentals, take responsibility early, and improve quickly through feedback and repetition.',
              'Thank you for your consideration. I would welcome the opportunity to continue the conversation and share more about how I approach learning, execution, and client-facing work. Please let me know if I can provide any additional information.'
            ],
            cta: {
              label: 'Sasha Milshtein Resume',
              href: 'https://www.sashamilshtein.com/'
            },
            signature: [
              'Sasha Milshtein',
              '925.949.9398',
              'sasha.milshtein@gmail.com',
              'https://www.linkedin.com/in/alexandra-milshtein/'
            ]
          }
        ];

        const questionMenu = document.getElementById('questionMenu');
        const questionTitle = document.getElementById('questionTitle');
        const answerBlock = document.getElementById('answerBlock');
        const counter = document.getElementById('counter');
        const mobileQuestionSelect = document.getElementById('mobileQuestionSelect');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let activeIndex = 0;

        function buildMenu() {
          questionMenu.innerHTML = '';
          if (mobileQuestionSelect) mobileQuestionSelect.innerHTML = '';

          qaItems.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'question-btn';
            btn.textContent = item.question;
            btn.addEventListener('click', () => renderItem(index));
            questionMenu.appendChild(btn);

            if (mobileQuestionSelect) {
              const option = document.createElement('option');
              option.value = index;
              option.textContent = item.question;
              mobileQuestionSelect.appendChild(option);
            }
          });
        }

        function renderItem(index) {
          activeIndex = index;
          const item = qaItems[index];

          document.querySelectorAll('.question-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
          });

          if (mobileQuestionSelect) {
            mobileQuestionSelect.value = String(index);
          }

          questionTitle.textContent = item.question;
          answerBlock.innerHTML = '';

          item.answer.forEach(paragraph => {
            const p = document.createElement('p');

            if (
              paragraph.startsWith('Account research:') ||
              paragraph.startsWith('Personalized outreach:') ||
              paragraph.startsWith('Call preparation:') ||
              paragraph.startsWith('Post-call follow-up:')
            ) {
              const parts = paragraph.split(':');
              const strong = document.createElement('span');
              strong.className = 'label-strong';
              strong.textContent = parts.shift() + ':';
              p.appendChild(strong);
              p.appendChild(document.createTextNode(' ' + parts.join(':').trim()));
            } else {
              p.textContent = paragraph;
            }

            answerBlock.appendChild(p);
          });

          if (item.trailing && item.trailing.length) {
            item.trailing.forEach(paragraph => {
              const p = document.createElement('p');
              p.textContent = paragraph;
              answerBlock.appendChild(p);
            });
          }

          if (item.cta && !item.signature) {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = item.cta.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'answer-link-btn';
            a.textContent = item.cta.label;
            p.appendChild(a);
            answerBlock.appendChild(p);
          }

          if (item.signature && item.signature.length) {
            const sig = document.createElement('div');
            sig.className = 'signature-block';

            item.signature.forEach(line => {
              const p = document.createElement('p');
              let iconSvg = '';

              if (line.includes('@')) {
                p.className = 'signature-line';
                iconSvg = '<span class="signature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm17 2.24-7.42 6.09a1 1 0 0 1-1.16.06L4 7.26V17h16V7.24Zm-1.6-.24H5.58L12 12.29 18.4 7Z"/></svg></span>';
                p.innerHTML = iconSvg;
                const a = document.createElement('a');
                a.href = 'mailto:' + line;
                a.textContent = line;
                a.style.color = 'inherit';
                a.style.textDecoration = 'none';
                p.appendChild(a);
              } else if (line.startsWith('http')) {
                p.className = 'signature-line';
                iconSvg = '<span class="signature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.36 8.09h4.26V22H.36V8.09ZM7.3 8.09h4.08v1.9h.06c.57-1.08 1.96-2.23 4.04-2.23 4.32 0 5.12 2.84 5.12 6.53V22h-4.25v-6.8c0-1.62-.03-3.71-2.26-3.71-2.27 0-2.61 1.77-2.61 3.59V22H7.3V8.09Z"/></svg></span>';
                p.innerHTML = iconSvg;
                const a = document.createElement('a');
                a.href = line;
                a.textContent = line;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.color = 'inherit';
                a.style.textDecoration = 'none';
                p.appendChild(a);
              } else if (line.indexOf('@') === -1 && line.indexOf('http') !== 0 && line !== 'Sasha Milshtein') {
                p.className = 'signature-line';
                iconSvg = '<span class="signature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.3 22 2 13.7 2 3a1 1 0 0 1 1-1h4.49a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.24 1.01l-2.2 2.2Z"/></svg></span>';
                p.innerHTML = iconSvg + line;
              } else {
                p.textContent = line;
              }

              sig.appendChild(p);
            });

            answerBlock.appendChild(sig);
          }

          if (item.cta && item.signature) {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = item.cta.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'answer-link-btn';
            a.textContent = item.cta.label;
            p.appendChild(a);
            answerBlock.appendChild(p);
          }

          counter.textContent = `${index + 1} / ${qaItems.length}`;
          prevBtn.disabled = index === 0;
          nextBtn.disabled = index === qaItems.length - 1;
        }

        prevBtn.addEventListener('click', () => {
          if (activeIndex > 0) renderItem(activeIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
          if (activeIndex < qaItems.length - 1) renderItem(activeIndex + 1);
        });

        if (mobileQuestionSelect) {
          mobileQuestionSelect.addEventListener('change', (e) => {
            activeIndex = Number(e.target.value);
            renderItem(activeIndex);
          });
        }

        buildMenu();
        renderItem(0);
      </script>
    <?php endif; ?>
  </div>
</body>
</html>
