<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// The real password is NOT sent to the browser.
// Bcrypt hash for the current access password.
// To change it later, generate a new hash with:
// php -r "echo password_hash('NEW_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
const GREECE_PASSWORD_HASH = '$2y$12$D06E9BrwXX9tCOxFWeJwKujoUNz.kSzxuxqMfiTT4Xs0dbtYI1sMy';

$loginError = false;

function unlock_greece_page(): void {
    session_regenerate_id(true);
    $_SESSION['greek_sailing_auth'] = true;
}

function redirect_clean(): void {
    $path = strtok($_SERVER['REQUEST_URI'], '?') ?: '/';
    header('Location: ' . $path, true, 303);
    exit;
}

// Explicit logout clears the server-side session flag.
if (isset($_GET['logout'])) {
    unset($_SESSION['greek_sailing_auth']);
    redirect_clean();
}

// Shared-link entry is handled server-side with the same password value.
$token = $_GET['t'] ?? $_GET['token'] ?? null;
if (is_string($token) && password_verify($token, GREECE_PASSWORD_HASH)) {
    unlock_greece_page();
    redirect_clean();
}

// Normal password form entry.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedPassword = $_POST['greece_password'] ?? '';
    if (is_string($submittedPassword) && password_verify($submittedPassword, GREECE_PASSWORD_HASH)) {
        unlock_greece_page();
        redirect_clean();
    }
    $loginError = true;
}

$isPhpUnlocked = isset($_SESSION['greek_sailing_auth']) && $_SESSION['greek_sailing_auth'] === true;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>⛵️ Greek Isles Sailing · Addy · Sasha · Alyona · Misha</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        :root {
            --ocean-deep: #055271;
            --ocean-mid: #079bc2;
            --ocean-light: #28e0ef;
            --sea-bright: #a7f8ff;
            --sea-foam: #f0feff;
            --sun-wash: #ffea9f;
            --sand-light: #fffdf4;
            --sand-warm: #ffebb0;
            --accent-teal: #18d3e7;
            --accent-coral: #ffa06a;
            --accent-sun: #ffd15d;
            --text-dark: #113949;
            --text-soft: #176f88;
            --glass-bg: rgba(255, 255, 255, 0.87);
            --glass-bg-strong: rgba(255, 255, 255, 0.95);
            --glass-border: rgba(239, 253, 255, 0.86);
            --shadow-elegant: 0 26px 56px -12px rgba(5, 54, 80, 0.22);
            --sea-photo: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80');
            --radius-xl: 48px;
            --radius-lg: 28px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
            position: relative;
            background:
                radial-gradient(circle at 14% 12%, rgba(255,255,255,0.52) 0, rgba(255,255,255,0.24) 14%, transparent 31%),
                radial-gradient(circle at 86% 9%, rgba(255,234,159,0.76) 0, rgba(255,209,93,0.30) 16%, transparent 31%),
                linear-gradient(155deg, rgba(24, 211, 231, 0.34) 0%, rgba(40, 224, 239, 0.22) 31%, rgba(7, 155, 194, 0.11) 59%, rgba(255,255,255,0.06) 100%),
                linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.16) 65%, rgba(255,209,93,0.10) 100%),
                var(--sea-photo) center center / cover fixed no-repeat;
            background-color: #28e0ef;
            font-family: 'Inter', sans-serif;
            padding: 30px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: var(--text-dark);
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            background:
                linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 34%, rgba(255,255,255,0.18) 100%),
                radial-gradient(circle at 50% 105%, rgba(255,255,255,0.22), transparent 42%),
                radial-gradient(circle at 92% 7%, rgba(255,218,122,0.22), transparent 18%);
            opacity: 1;
        }

        body::after {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: 0.04;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cpath d='M0 110 C20 98 40 98 60 110 S100 122 120 110 160 98 180 110V180H0Z' fill='%23ffffff'/%3E%3Cpath d='M0 78 C18 68 42 68 60 78 S100 88 120 78 162 68 180 78' stroke='%23ffffff' stroke-width='5' fill='none' stroke-linecap='round' opacity='0.9'/%3E%3C/svg%3E");
            background-size: 280px 280px;
            mix-blend-mode: soft-light;
        }

        .lock-container { max-width: 520px; width: 100%; }
        
        .lock-card {
            background: linear-gradient(180deg, var(--glass-bg-strong), rgba(255,255,255,0.86));
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-elegant), 0 10px 24px rgba(0, 20, 30, 0.12);
            padding: 44px 36px;
            border: 1px solid var(--glass-border);
            text-align: center;
        }

        .lock-icon { font-size: 4.5rem; color: var(--ocean-mid); margin-bottom: 20px; text-shadow: 0 8px 18px rgba(19,159,200,0.18); }
        
        .lock-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.4rem;
            font-weight: 600;
            color: var(--ocean-deep);
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }

        .lock-subtitle { color: var(--text-soft); margin-bottom: 28px; line-height: 1.6; font-size: 1rem; }
        .lock-form { display: grid; gap: 18px; }
        
        .lock-input {
            width: 100%;
            padding: 16px 20px;
            font-size: 1.1rem;
            border: 2px solid rgba(110, 220, 237, 0.58);
            border-radius: 60px;
            background: rgba(255,255,255,0.95);
            color: var(--text-dark);
            outline: none;
            transition: all 0.2s ease;
            text-align: center;
            letter-spacing: 2px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .lock-input:focus {
            border-color: var(--ocean-light);
            box-shadow: 0 0 0 4px rgba(63, 162, 176, 0.15);
        }

        .lock-btn {
            background: linear-gradient(135deg, #21ddea, #0ba2c7);
            color: white;
            border: none;
            padding: 16px 28px;
            font-size: 1.2rem;
            font-weight: 600;
            border-radius: 60px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 10px 24px rgba(12, 79, 104, 0.24);
            font-family: 'Cormorant Garamond', serif;
        }

        .lock-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px rgba(12, 79, 104, 0.28);
            background: linear-gradient(135deg, #35e9f4, #16b7d6);
        }

        .lock-error { color: #c25a3a; font-size: 0.95rem; min-height: 24px; }
        .lock-footer { margin-top: 24px; font-size: 0.85rem; color: #6a8a99; }

        .itinerary-card {
            max-width: 1300px;
            width: 100%;
            background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.86));
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-elegant), 0 12px 28px rgba(0, 20, 30, 0.12);
            padding: 32px 28px;
            border: 1px solid var(--glass-border);
        }

        h1 {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 600;
            font-size: 3.4rem;
            letter-spacing: -0.5px;
            color: var(--ocean-deep);
            display: flex;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
            border-bottom: 2px solid #9ec5d9;
            padding-bottom: 18px;
            margin-bottom: 28px;
        }

        h1 i {
            color: white;
            font-size: 2.8rem;
            background: linear-gradient(135deg, #36d3e5, #0c7ea1);
            padding: 12px;
            border-radius: 60px;
            box-shadow: 0 10px 18px rgba(19,159,200,0.22);
        }

        .grad-cap-group {
            display: flex;
            gap: 5px;
            margin-left: auto;
            background: linear-gradient(135deg, rgba(255,242,188,0.98), rgba(255,208,93,0.90));
            padding: 10px 18px;
            border-radius: 60px;
            font-size: 2rem;
            color: #1e6c80;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }

        .trip-meta {
            display: flex;
            gap: 28px;
            flex-wrap: wrap;
            margin-bottom: 32px;
            background: linear-gradient(135deg, rgba(240,254,255,0.98), rgba(255,251,232,0.86));
            padding: 14px 24px;
            border-radius: 80px;
            font-weight: 500;
            color: var(--text-soft);
            border: 1px solid rgba(145, 226, 238, 0.42);
        }

        .trip-meta i { margin-right: 8px; color: #14c6dc; }

        .day-block {
            margin-bottom: 40px;
            border-left: 5px solid #3bd0e2;
            padding-left: 24px;
        }

        .day-header {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            gap: 12px 25px;
            margin-bottom: 16px;
        }

        .day-title {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
            font-size: 2.1rem;
            color: var(--ocean-mid);
        }

        .day-date {
            font-size: 1.1rem;
            background: linear-gradient(135deg, rgba(112,238,248,0.94), rgba(255,235,176,0.88));
            padding: 4px 16px;
            border-radius: 40px;
            color: #0c4f68;
            border: 1px solid rgba(89, 207, 226, 0.44);
        }

        .leg-card {
            background: linear-gradient(180deg, rgba(255,255,255,0.99), rgba(251,255,255,0.94));
            border-radius: var(--radius-lg);
            padding: 20px 25px;
            margin-bottom: 18px;
            box-shadow: 0 12px 22px -10px rgba(12, 79, 104, 0.18);
            border: 1px solid rgba(145, 226, 238, 0.58);
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 20px;
        }

        .layover-note {
            width: min(560px, calc(100% - 28px));
            margin: -4px auto 14px;
            padding: 10px 18px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: linear-gradient(135deg, rgba(255, 243, 190, 0.96), rgba(255, 209, 93, 0.86));
            border: 1px solid rgba(255, 183, 77, 0.52);
            color: #80500c;
            font-weight: 700;
            box-shadow: 0 10px 20px -12px rgba(128, 80, 12, 0.35);
        }

        .layover-note i {
            color: #f08a24;
        }

        .leg-icon {
            font-size: 2.2rem;
            min-width: 60px;
            text-align: center;
            color: #11c4da;
            text-shadow: 0 8px 18px rgba(54,211,229,0.18);
        }

        .leg-details { flex: 3 1 260px; }

        .leg-route {
            font-size: 1.5rem;
            font-weight: 600;
            font-family: 'Cormorant Garamond', serif;
            color: #093e4b;
        }

        .leg-airline {
            font-weight: 500;
            color: #2a5f6b;
            margin: 6px 0 4px;
        }

        .leg-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px 30px;
            margin-top: 8px;
            font-size: 0.95rem;
            color: #2b5a66;
        }

        .leg-meta i { width: 20px; color: #11a3ba; }

        .booking-ref {
            font-family: monospace;
            background: linear-gradient(135deg, rgba(226,251,255,0.95), rgba(200,244,248,0.95));
            padding: 3px 10px;
            border-radius: 30px;
            font-size: 0.9rem;
            border: 1px solid rgba(145, 226, 238, 0.58);
        }

        .map-wrapper {
            position: relative;
            flex: 1 1 240px;
            min-width: 220px;
        }

        .map-container {
            width: 100%;
            height: 140px;
            border-radius: 20px;
            border: 2px solid rgba(111, 230, 242, 0.56);
            background: #dff8fd;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .map-expand-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            padding: 6px 14px;
            background: rgba(255,255,255,0.88);
            border-radius: 30px;
            font-size: 12px;
            color: #0c627b;
            border: 1px solid rgba(111, 230, 242, 0.56);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
        }

        .map-expand-btn:hover {
            background: linear-gradient(135deg, #14b5cb, #0c7ea1);
            border-color: #0c7ea1;
            color: white;
        }

        .sailing-highlight {
            background: linear-gradient(120deg, rgba(224,252,255,0.98) 0%, rgba(151,246,252,0.94) 38%, rgba(255,238,164,0.90) 100%);
            border: 2px dashed rgba(21, 199, 220, 0.86);
            border-radius: 36px;
            padding: 24px 28px;
            margin: 25px 0 18px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.65);
        }

        .sailing-highlight .leg-icon { color: #0b9eb5; font-size: 2.8rem; }
        .sailing-highlight .leg-route { font-size: 2rem; color: #05485c; }

        .host-note {
            display: inline-block;
            background: linear-gradient(135deg, rgba(255,243,190,0.98), rgba(255,207,93,0.90));
            border-radius: 30px;
            padding: 6px 18px;
            margin-top: 10px;
            font-size: 0.9rem;
            border: 1px solid rgba(255, 201, 125, 0.52);
        }

        .divider-wave {
            margin: 10px 0 5px;
            color: #20b8cf;
            font-size: 1.2rem;
        }

        .link-style {
            color: #0d7897;
            text-decoration: underline;
            text-underline-offset: 3px;
            font-weight: 600;
        }

        .link-style:hover { color: #0c4f68; }

        .date-nav {
            position: fixed;
            top: 50%;
            right: 18px;
            transform: translateY(-50%);
            z-index: 1200;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 12px 10px;
            border-radius: 999px;
            background: rgba(236, 252, 255, 0.58);
            border: 1px solid rgba(194, 242, 248, 0.78);
            box-shadow: 0 18px 38px rgba(5, 54, 80, 0.20);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
        }

        .date-nav a {
            width: 62px;
            min-height: 58px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            border-radius: 26px;
            color: #0c4f68;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.70);
            border: 1px solid rgba(177, 239, 247, 0.72);
            transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
        }

        .date-nav a:hover,
        .date-nav a.active {
            transform: translateX(-3px);
            background: linear-gradient(135deg, rgba(21, 199, 220, 0.97), rgba(12, 138, 174, 0.97));
            color: white;
            box-shadow: 0 12px 24px rgba(12, 79, 104, 0.22);
        }

        .date-nav i { font-size: 1.15rem; line-height: 1; }
        .date-nav .nav-date { font-size: 0.72rem; font-weight: 700; line-height: 1; }
        .date-nav .nav-label { font-size: 0.62rem; opacity: 0.86; line-height: 1; }

        .day-block {
            scroll-margin-top: 28px;
        }
        .logout-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255,255,255,0.76);
            border: 1px solid rgba(177, 239, 247, 0.72);
            padding: 8px 16px;
            border-radius: 40px;
            font-size: 0.85rem;
            color: var(--text-soft);
            cursor: pointer;
            backdrop-filter: blur(8px);
            z-index: 1000;
            box-shadow: 0 8px 18px rgba(5, 54, 80, 0.12);
        }

        .logout-btn:hover {
            background: rgba(255,255,255,0.96);
            border-color: var(--accent-coral);
        }

        .leaflet-marker-icon { border: none !important; background: transparent !important; }
        .leaflet-div-icon { background: transparent !important; border: none !important; }

        @media (max-width: 650px) {
            body { padding: 10px 8px 88px; background-attachment: scroll; }
            .itinerary-card { padding: 18px 12px; border-radius: 28px; }
            h1 { font-size: 2.25rem; gap: 10px; margin-bottom: 18px; padding-bottom: 14px; }
            h1 i { font-size: 2rem; padding: 9px; }
            .trip-meta { gap: 8px 16px; margin-bottom: 22px; padding: 12px 16px; border-radius: 24px; }
            .day-block { margin-bottom: 26px; padding-left: 14px; border-left-width: 4px; }
            .day-header { gap: 8px 12px; margin-bottom: 12px; }
            .day-title { font-size: 1.75rem; line-height: 1.05; }
            .day-date { font-size: 1rem; padding: 3px 14px; }
            .leg-card { flex-direction: column; gap: 10px; padding: 16px 18px; margin-bottom: 14px; border-radius: 24px; }
            .layover-note { width: 100%; margin: -2px 0 12px; padding: 10px 12px; border-radius: 22px; font-size: 0.92rem; }
            .leg-icon { min-width: 0; width: auto; font-size: 1.8rem; line-height: 1; text-align: left; }
            .leg-details { flex: 0 1 auto; width: 100%; }
            .leg-route { font-size: 1.35rem; line-height: 1.15; }
            .leg-meta { gap: 8px 18px; margin-top: 6px; }
            .map-wrapper { flex: none; width: 100%; min-width: 0; }
            .map-container { width: 100%; height: 132px; border-radius: 18px; }
            .map-expand-btn { margin-top: 7px; }
            .sailing-highlight { padding: 18px; margin: 18px 0 14px; border-radius: 26px; }
            .sailing-highlight .leg-route { font-size: 1.55rem; }
            .grad-cap-group { margin-left: 0; font-size: 1.45rem; padding: 8px 14px; }
            .lock-card { padding: 32px 22px; }
            .date-nav {
                top: auto;
                right: 10px;
                left: 10px;
                bottom: 10px;
                transform: none;
                flex-direction: row;
                justify-content: space-between;
                overflow-x: auto;
                border-radius: 30px;
                padding: 8px;
                gap: 7px;
            }
            .date-nav a {
                flex: 0 0 54px;
                width: 54px;
                min-height: 52px;
                border-radius: 22px;
            }
            .date-nav a:hover,
            .date-nav a.active { transform: translateY(-2px); }
            .date-nav .nav-label { display: none; }
            .logout-btn { bottom: 82px; left: 12px; }
            .day-block { scroll-margin-top: 12px; }
        }
        /* Rules of Conduct modal */
        #rulesModal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(5, 54, 80, 0.55);
            backdrop-filter: blur(4px);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        #rulesModal.open { display: flex; }
        #rulesModalBox {
            background: var(--glass-bg-strong);
            border-radius: 24px;
            box-shadow: var(--shadow-elegant);
            width: 100%;
            max-width: 780px;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        #rulesModalHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(7,155,194,0.15);
            flex-shrink: 0;
        }
        #rulesModalHeader span {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-dark);
        }
        #rulesModalActions { display: flex; gap: 10px; align-items: center; }
        #rulesModalActions a {
            font-size: 0.8rem;
            color: var(--text-soft);
            text-decoration: none;
            padding: 5px 12px;
            border: 1px solid rgba(7,155,194,0.3);
            border-radius: 20px;
            white-space: nowrap;
            transition: all 150ms ease;
        }
        #rulesModalActions a:hover { background: rgba(7,155,194,0.1); color: var(--ocean-deep); }
        #rulesModalClose {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-soft);
            font-size: 1.3rem;
            line-height: 1;
            padding: 4px 8px;
            border-radius: 8px;
            transition: background 150ms;
        }
        #rulesModalClose:hover { background: rgba(7,155,194,0.12); }
        #rulesModalFrame {
            flex: 1;
            border: none;
            min-height: 0;
        }
    </style>
</head>
<body>
<div id="app"></div>

<!-- Rules of Conduct modal (desktop only — mobile opens new tab) -->
<div id="rulesModal" role="dialog" aria-modal="true" aria-label="Rules of Conduct on the Yacht" onclick="if(event.target===this)closeRulesModal()">
    <div id="rulesModalBox">
        <div id="rulesModalHeader">
            <span><i class="fas fa-scroll"></i> Rules of Conduct on the Yacht</span>
            <div id="rulesModalActions">
                <a href="https://docs.google.com/document/d/1dD4jpXbIiCNq_qGWm0krpAozjTMcnwZQNeriYo-d47o/edit?usp=sharing" target="_blank"><i class="fas fa-external-link-alt"></i> Open in new tab</a>
                <button id="rulesModalClose" onclick="closeRulesModal()" aria-label="Close">&times;</button>
            </div>
        </div>
        <iframe id="rulesModalFrame"
            src=""
            data-src="https://docs.google.com/document/d/1dD4jpXbIiCNq_qGWm0krpAozjTMcnwZQNeriYo-d47o/preview"
            allow="autoplay"
            title="Rules of Conduct on the Yacht">
        </iframe>
    </div>
</div>

<script>
    const RULES_DOC_URL = 'https://docs.google.com/document/d/1dD4jpXbIiCNq_qGWm0krpAozjTMcnwZQNeriYo-d47o/edit?usp=sharing';
    const RULES_EMBED_URL = 'https://docs.google.com/document/d/1dD4jpXbIiCNq_qGWm0krpAozjTMcnwZQNeriYo-d47o/preview';

    function openRulesModal(e) {
        const isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
        if (isMobile) return; // let default href/_blank take over on mobile
        e.preventDefault();
        const modal = document.getElementById('rulesModal');
        const frame = document.getElementById('rulesModalFrame');
        if (!frame.src || frame.src === window.location.href) {
            frame.src = frame.dataset.src; // lazy-load iframe only when opened
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeRulesModal() {
        document.getElementById('rulesModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeRulesModal();
    });

    (function() {
        const app = document.getElementById('app');
        const isUnlocked = <?php echo $isPhpUnlocked ? 'true' : 'false'; ?>;
        const loginError = <?php echo $loginError ? 'true' : 'false'; ?>;
        
        function logout() {
            window.location.href = window.location.pathname + '?logout=1';
        }
        
        function renderLockScreen(error = false) {
            app.innerHTML = `
                <div class="lock-container">
                    <div class="lock-card">
                        <div class="lock-icon"><i class="fas fa-sailboat"></i></div>
                        <h2 class="lock-title">Greek Isles Sailing</h2>
                        <p class="lock-subtitle">
                            <i class="fas fa-water"></i> Addy · Sasha · Alyona · Misha<br>
                            <span style="font-size: 0.9rem; display: block; margin-top: 10px;">Enter password to view itinerary</span>
                        </p>
                        <form class="lock-form" method="post" action="">
                            <input class="lock-input" id="passwordInput" name="greece_password" type="password" placeholder="••••••••••" autocomplete="current-password" autofocus required />
                            <button class="lock-btn" id="unlockBtn" type="submit"><i class="fas fa-unlock-alt" style="margin-right: 8px;"></i>Unlock</button>
                            <div class="lock-error" id="loginError">${error ? '<i class="fas fa-exclamation-circle"></i> Incorrect password' : ''}</div>
                        </form>
                        <div class="lock-footer">
                            <i class="fas fa-anchor"></i> May 27 – June 7, 2026 <i class="fas fa-anchor"></i>
                        </div>
                    </div>
                </div>
            `;
        }
                <?php if ($isPhpUnlocked): ?>
        function renderItinerary() {
            app.innerHTML = `
                <nav class="date-nav" aria-label="Trip date navigation">
                    <a href="#departure" title="May 27 · Fly out"><i class="fas fa-plane-departure"></i><span class="nav-date">May 27</span><span class="nav-label">Fly</span></a>
                    <a href="#lefka-arrival" title="May 28 · Athens to Lefkada"><i class="fas fa-hotel"></i><span class="nav-date">May 28</span><span class="nav-label">Hotel</span></a>
                    <a href="#sailing" title="May 29–June 5 · Sailing"><i class="fas fa-sailboat"></i><span class="nav-date">May 29</span><span class="nav-label">Sail</span></a>
                    <a href="#lefka-return" title="June 5 · Lefkada night"><i class="fas fa-moon"></i><span class="nav-date">Jun 5</span><span class="nav-label">Rest</span></a>
                    <a href="#spata" title="June 6 · Spata"><i class="fas fa-car-side"></i><span class="nav-date">Jun 6</span><span class="nav-label">Drive</span></a>
                    <a href="#return" title="June 7 · Fly home"><i class="fas fa-plane-arrival"></i><span class="nav-date">Jun 7</span><span class="nav-label">Home</span></a>
                </nav>
                <div class="itinerary-card">
                    <h1><i class="fas fa-sailboat"></i> Greek Isles Sailing Odyssey
                        <span class="grad-cap-group"><i class="fas fa-graduation-cap"></i><i class="fas fa-graduation-cap"></i></span>
                    </h1>
                    <div class="trip-meta">
                        <span><i class="fas fa-calendar-alt"></i> May 27 – June 7, 2026</span>
                        <span><i class="fas fa-water"></i> Addy · Sasha · Alyona · Misha</span>
                        <span><i class="fas fa-umbrella-beach"></i> Ionian · Aegean spirit</span>
                    </div>
                    
                    <div class="day-block" id="departure">
                        <div class="day-header"><span class="day-title"><i class="fas fa-plane-departure"></i> Departure · San Francisco → Athens</span><span class="day-date">May 27, 2026 · overnight</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-plane"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">San Francisco ✈︎ Copenhagen</div>
                                <div class="leg-airline"><i class="fas fa-tag"></i> SAS · flight 16:45 · 10h</div>
                                <div class="leg-meta"><span><i class="fas fa-clock"></i> Arrive Copenhagen May 28, 12:00</span></div>
                                <div style="margin-top:8px;"><i class="fas fa-link"></i> <a href="https://www.flysas.com/" target="_blank" class="link-style">flysas.com</a> / SAS app</div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapSanFranciscoCopenhagen" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/?api=1&origin=37.6213,-122.3790&destination=55.6180,12.6508" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                        <div class="layover-note"><i class="fas fa-mug-hot"></i> Copenhagen layover · 2h20m</div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-plane-arrival"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Copenhagen ✈︎ Athens</div>
                                <div class="leg-airline"><i class="fas fa-tag"></i> SAS · 14:20 · 3h20m</div>
                                <div class="leg-meta"><span><i class="fas fa-clock"></i> May 28 · Arrive Athens 18:40</span></div>
                                <div><i class="fas fa-link"></i> <a href="https://www.flysas.com/" target="_blank" class="link-style">flysas.com</a></div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapCopenhagenAthens" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/?api=1&origin=55.6180,12.6508&destination=37.9364,23.9445" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                        <div class="divider-wave"><i class="fas fa-chevron-down"></i> evening arrival · Athens Airport</div>
                    </div>
                    
                    <div class="day-block" id="lefka-arrival">
                        <div class="day-header"><span class="day-title"><i class="fas fa-car-side"></i> Athens → Lefkada & Overnight</span><span class="day-date">May 28, 2026</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-shuttle-van"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Athens Airport · transfer to Lefkada</div>
                                <div class="leg-airline"><i class="fas fa-clock"></i> Pickup 19:30 · ~4+ hr drive</div>
                                <div class="leg-meta"><span><i class="fas fa-hotel"></i> Allure Retreat · Lefkada</span><span><i class="fas fa-map-marked-alt"></i> <a href="https://allureretreat.com/" target="_blank" class="link-style">allureretreat.com</a></span></div>
                                <div style="margin-top:8px;"><i class="fas fa-bed"></i> Night in Lefkada — relax before sailing</div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapAthensLefkada" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/?api=1&origin=37.9364,23.9445&destination=Lefkada,Greece" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-block" id="boarding">
                        <div class="day-header"><span class="day-title"><i class="fas fa-anchor"></i> Boarding the Yacht</span><span class="day-date">May 29, 2026</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-ship"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Nidri · Lefkada — board the yacht</div>
                                <div class="leg-airline"><i class="fas fa-clock"></i> around noon</div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapBoarding" class="map-container"></div>
                                <a href="https://www.google.com/maps?q=38.8367500,20.7120833&entry=gps&lucs=,94259551,94284463,47071704,94218641,94286869&g_ep=CAISDTYuMTM4LjIuOTAyNDAYACCenQoqLSw5NDI1OTU1MSw5NDI4NDQ2Myw0NzA3MTcwNCw5NDIxODY0MSw5NDI4Njg2OUICVVM%3D&skid=c26e4a28-a20a-42ca-98a3-fc70932a9686&g_st=i" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-block" id="sailing">
                        <div class="day-header"><span class="day-title"><i class="fas fa-ship"></i> Main event · Sailing the Greek Islands</span><span class="day-date">May 29 – June 5, 2026</span></div>
                        <div class="sailing-highlight">
                            <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
                                <div class="leg-icon"><i class="fas fa-sailboat"></i><i class="fas fa-fish"></i></div>
                                <div>
                                    <div class="leg-route">⛵️🐬🐳🧜‍♀️ Ionian & Aegean sailing</div>
                                    <div class="host-note"><i class="fab fa-facebook"></i> <a href="https://www.facebook.com/elena.len.376043" target="_blank" class="link-style">Elena Len</a></div>
                                    <div style="margin-top:14px;background:#ffffffb0;border-radius:20px;padding:10px 16px;"><i class="fas fa-water"></i> <strong>Sailing adventure:</strong> 7 nights exploring hidden coves, turquoise waters.</div>
                                    <div style="margin-top:10px;background:#ffffffb0;border-radius:20px;padding:10px 16px;"><i class="fas fa-scroll"></i> <a href="https://docs.google.com/document/d/1dD4jpXbIiCNq_qGWm0krpAozjTMcnwZQNeriYo-d47o/edit?usp=sharing" target="_blank" class="link-style" onclick="openRulesModal(event)">Rules of Conduct on the Yacht</a></div>
                                </div>
                            </div>
                            <div class="map-wrapper" style="margin-top:20px;">
                                <div id="mapSailingRegion" style="height:160px;width:100%;border-radius:24px;border:1px solid #6da5b5;"></div>
                                <a href="https://www.google.com/maps/place/Lefkada/" target="_blank" class="map-expand-btn" style="margin-top:8px;"><i class="fas fa-external-link-alt"></i> View Lefkada on Google Maps</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-block" id="lefka-return">
                        <div class="day-header"><span class="day-title"><i class="fas fa-anchor"></i> Return to Lefkada · Overnight</span><span class="day-date">June 5, 2026</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-moon"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Allure Retreat · Lefkada</div>
                                <div class="leg-meta"><span><i class="fas fa-calendar-check"></i> post‑sailing night</span><span><i class="fas fa-map-pin"></i> <a href="https://allureretreat.com/" target="_blank" class="link-style">allureretreat.com</a></span></div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapLefkadaNight" class="map-container"></div>
                                <a href="https://www.google.com/maps/place/Lefkada/" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-block" id="spata">
                        <div class="day-header"><span class="day-title"><i class="fas fa-road"></i> Lefkada → Athens (Spata)</span><span class="day-date">June 6, 2026</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-car"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Transfer: Lefkada → Athens / Spata</div>
                                <div class="leg-airline"><i class="fas fa-clock"></i> Pickup 11:00 · ~4+ hr drive</div>
                                <div class="leg-meta"><span><i class="fas fa-building"></i> <a href="https://www.airstay.gr/elise-apartment/" target="_blank" class="link-style">Elise Apartment Airport by Airstay</a></span><span><i class="fas fa-location-dot"></i> 55 Agias Varvaras, Spata 19004</span></div>
                                <div><i class="fas fa-shuttle-van"></i> Need early morning shuttle to Athens Airport</div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapLefkadaSpata" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/Lefkada/Spata/" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-block" id="return">
                        <div class="day-header"><span class="day-title"><i class="fas fa-plane-arrival"></i> Return · Athens → San Francisco</span><span class="day-date">June 7, 2026</span></div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-plane"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Athens ✈︎ Copenhagen</div>
                                <div class="leg-airline"><i class="fas fa-tag"></i> Aegean · 07:55 · 3h20m</div>
                                <div class="leg-meta"><span><i class="fas fa-clock"></i> arrive Copenhagen 10:05</span></div>
                                <div><i class="fas fa-link"></i> <a href="https://en.aegeanair.com/" target="_blank" class="link-style">en.aegeanair.com</a></div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapAthensCopenhagen" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/?api=1&origin=37.9364,23.9445&destination=55.6180,12.6508" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                        <div class="layover-note"><i class="fas fa-mug-hot"></i> Copenhagen layover · 2h30m</div>
                        <div class="leg-card">
                            <div class="leg-icon"><i class="fas fa-plane"></i></div>
                            <div class="leg-details">
                                <div class="leg-route">Copenhagen ✈︎ San Francisco</div>
                                <div class="leg-airline"><i class="fas fa-tag"></i> SAS · 12:45 · 11h</div>
                                <div class="leg-meta"><span><i class="fas fa-clock"></i> arrive San Francisco 14:40</span></div>
                                <div><i class="fas fa-link"></i> <a href="https://www.flysas.com/" target="_blank" class="link-style">flysas.com</a></div>
                            </div>
                            <div class="map-wrapper">
                                <div id="mapCopenhagenSanFrancisco" class="map-container"></div>
                                <a href="https://www.google.com/maps/dir/?api=1&origin=55.6180,12.6508&destination=37.6213,-122.3790" target="_blank" class="map-expand-btn"><i class="fas fa-external-link-alt"></i> View on Google Maps</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Lock</div>
            `;
            document.getElementById('logoutBtn').addEventListener('click', logout);
            initDateNav();
            initMaps();
        }
        
        function initDateNav() {
            const links = Array.from(document.querySelectorAll('.date-nav a'));
            const sections = links
                .map(link => document.querySelector(link.getAttribute('href')))
                .filter(Boolean);

            links.forEach(link => {
                link.addEventListener('click', () => {
                    links.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                });
            });

            if (!('IntersectionObserver' in window) || sections.length === 0) {
                if (links[0]) links[0].classList.add('active');
                return;
            }

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const activeLink = document.querySelector(`.date-nav a[href="#${entry.target.id}"]`);
                    if (!activeLink) return;
                    links.forEach(item => item.classList.remove('active'));
                    activeLink.classList.add('active');
                });
            }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

            sections.forEach(section => observer.observe(section));
            if (links[0]) links[0].classList.add('active');
        }
        function initMaps() {
            const mapConfigs = [
                {id:'mapSanFranciscoCopenhagen', coords:[45,-40], zoom:2, markers:[{lat:37.62,lng:-122.38,title:'San Francisco',color:'#1e6f5c',icon:'fa-plane'},{lat:55.62,lng:12.66,title:'Copenhagen',color:'#1e6f5c',icon:'fa-plane'}]},
                {id:'mapCopenhagenAthens', coords:[48,18], zoom:4, markers:[{lat:55.62,lng:12.66,title:'Copenhagen',color:'#1e6f5c',icon:'fa-plane'},{lat:37.94,lng:23.94,title:'Athens',color:'#1e6f5c',icon:'fa-plane'}]},
                {id:'mapAthensLefkada', coords:[38.2,22.9], zoom:7, markers:[{lat:37.94,lng:23.94,title:'Athens',color:'#b0895c',icon:'fa-car'},{lat:38.83,lng:20.71,title:'Lefkada',color:'#2a7f6e',icon:'fa-bed'}]},
                {id:'mapBoarding', coords:[38.8368,20.7121], zoom:14, markers:[{lat:38.8368,lng:20.7121,title:'Boarding — Nidri',color:'#0b5e5e',icon:'fa-ship'}]},
                {id:'mapSailingRegion', coords:[38.6,20.7], zoom:8, markers:[{lat:38.83,lng:20.71,title:'⛵ Lefkada base',color:'#0b5e5e',icon:'fa-sailboat'}]},
                {id:'mapLefkadaNight', coords:[38.83,20.71], zoom:10, markers:[{lat:38.83,lng:20.71,title:'Allure Retreat',color:'#1e6f5c',icon:'fa-bed'}]},
                {id:'mapLefkadaSpata', coords:[38.4,22.5], zoom:7, markers:[{lat:38.83,lng:20.71,title:'Lefkada',color:'#b0895c',icon:'fa-car'},{lat:37.97,lng:23.93,title:'Spata',color:'#1e6f5c',icon:'fa-bed'}]},
                {id:'mapAthensCopenhagen', coords:[48,18], zoom:4, markers:[{lat:37.94,lng:23.94,title:'Athens',color:'#1e6f5c',icon:'fa-plane'},{lat:55.62,lng:12.66,title:'Copenhagen',color:'#1e6f5c',icon:'fa-plane'}]},
                {id:'mapCopenhagenSanFrancisco', coords:[45,-40], zoom:2, markers:[{lat:55.62,lng:12.66,title:'Copenhagen',color:'#1e6f5c',icon:'fa-plane'},{lat:37.62,lng:-122.38,title:'San Francisco',color:'#1e6f5c',icon:'fa-plane'}]}
            ];
            
            mapConfigs.forEach(cfg => {
                const el = document.getElementById(cfg.id);
                if (!el) return;
                
                const map = L.map(cfg.id, {attributionControl:false, zoomControl:true, scrollWheelZoom:false}).setView(cfg.coords, cfg.zoom);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {subdomains:'abcd', maxZoom:19}).addTo(map);
                
                cfg.markers.forEach((m, i) => {
                    const icon = L.divIcon({
                        html: `<div style="background:${m.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 10px rgba(0,20,30,0.4);"><i class="fas ${m.icon}" style="color:white;font-size:16px;"></i></div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });
                    L.marker([m.lat, m.lng], {icon}).addTo(map).bindPopup(`<b>${m.title}</b>`);
                    if (i === 0 && cfg.markers.length === 2) {
                        L.polyline(cfg.markers.map(mk => [mk.lat, mk.lng]), {color:'#2a7f6e',weight:3,opacity:0.7,dashArray:'6,8'}).addTo(map);
                    }
                });
                
                if (cfg.markers.length > 1) {
                    map.fitBounds(L.latLngBounds(cfg.markers.map(m => [m.lat, m.lng])), {padding:[30,30]});
                }
            });
        }
        
        renderItinerary();
        <?php else: ?>
        renderLockScreen(loginError);
        <?php endif; ?>
    })();
</script>
</body>
</html>