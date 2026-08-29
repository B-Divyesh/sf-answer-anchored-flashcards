import './style.css';
import type { AppData, Card, CardType, Review } from './types';
import { addCardToStore, CardLimitError, FREE_CARD_LIMIT, loadData, resetDemo, saveData, updateData } from './store';
import { dueDate, nextInterval, scoreCard } from './scoring';
import { ankiCsv, BackupValidationError, decryptBackup, downloadFile, encryptBackup, reviewsCsv } from './backup';

const app = document.querySelector<HTMLDivElement>('#app')!;
const slug = 'answer-anchored-flashcards';
const licenseKey = `sb_license:${slug}`;
let data: AppData = { cards: [], reviews: [] };
let demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let activeCardId = '';
let revealed: { card: Card; answer: string; confidence: 'unsure' | 'close' | 'certain'; review: Review } | null = null;
let notice = '';
let updateWorker: ServiceWorker | null = null;
let answerSubmissionPending = false;
let cardSubmissionPending = false;

const OFFLINE_NOTICE = 'You are offline. Review and export still work.';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const uid = () => crypto.randomUUID();
const dateLabel = (iso: string) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
const dueCards = () => data.cards.filter(card => new Date(card.dueAt).getTime() <= Date.now());
const scrollToPosition = (top: number) => {
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  scrollTo({ top, behavior: 'auto' });
  document.documentElement.style.scrollBehavior = previous;
};
const isLicensed = () => {
  try { return JSON.parse(localStorage.getItem(`${licenseKey}:verdict`) || '{}').valid === true; } catch { return false; }
};

const routeMeta: Record<string, [string, string]> = {
  '/': ['Recall Anchor — Score typed flashcard answers', 'Score exact, numeric, and checklist flashcards from the answer you type.'],
  '/study': ['Study — Recall Anchor', 'Type an answer before the answer key appears.'],
  '/cards': ['Cards — Recall Anchor', 'Create, import, and export answer-anchored flashcards.'],
  '/demo': ['Demo — Recall Anchor', 'Try answer-anchored review with isolated sample data.'],
  '/privacy': ['Privacy — Recall Anchor', 'How Recall Anchor stores and handles your study data.'],
  '/terms': ['Terms — Recall Anchor', 'Terms for using Recall Anchor.'],
  '/404': ['Page not found — Recall Anchor', 'This page does not exist.']
};

function setMeta(path: string): void {
  const [title, description] = routeMeta[path] || routeMeta['/404'];
  const canonical = `https://answer-anchored-flashcards.sociobot.in${path}`;
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function shell(content: string): string {
  const visibleNotice = [!navigator.onLine ? OFFLINE_NOTICE : '', notice].filter(Boolean).join(' ');
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-bar" aria-label="Demo mode"><strong>Demo</strong> — sample data, nothing is saved to your cards.<span><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/cards" data-start-real>Start for real</a></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Recall Anchor home"><span aria-hidden="true">RA</span> Recall Anchor</a>
      <nav aria-label="Primary"><a href="/study" data-link>Study</a><a href="/cards" data-link>Cards</a><a href="/demo" data-link>Demo</a><a href="/privacy" data-link>Privacy</a></nav>
    </header>
    ${visibleNotice ? `<div class="notice" role="status">${escapeHtml(visibleNotice)}</div>` : ''}
    <main id="main" tabindex="-1">${content}</main>
    <footer><div><strong>Recall Anchor</strong><p>Score cards from typed answers, not guessed ratings.</p></div><nav aria-label="Footer"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" target="_blank" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens in a new tab)</span></a></nav><small>Version 1.0.8</small></footer>
    <div class="route-announcer sr-only" aria-live="polite"></div>
    <div class="update-toast" hidden><span>A new version is ready.</span><button data-action="apply-update" aria-label="Update now">Update now</button></div>`;
}

function homePage(): string {
  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Typed-answer flashcard review</p>
        <h1 tabindex="-1">Score flashcards from typed answers</h1>
        <p class="lede">For people studying alone who want the next review date based on an answer, not a guessed rating.</p>
        <div class="hero-actions"><a class="button primary" href="/?demo=1" data-link>Try it with sample data</a><span>Three due cards open next.</span></div>
        <ul class="facts" aria-label="Product facts"><li>Works offline after your first visit</li><li>Cards stay in this browser</li><li>Free for 30 cards</li></ul>
      </div>
      <figure class="hero-art"><div class="print-number">01</div><picture><source srcset="/assets/hero-768-v1.webp 768w, /assets/hero-1200-v1.webp 1200w" sizes="(max-width: 720px) 92vw, 46vw" type="image/webp"><img src="/assets/hero-1200-v1.webp" width="1200" height="800" alt="Printed answer slips move through a brass interval dial." fetchpriority="high" decoding="async"></picture><figcaption>Typed answer → answer key → next review date</figcaption></figure>
    </section>
    <section class="proof-strip" aria-label="Live scoring preview"><div><span>Typed answer</span><strong>claim, evidence</strong></div><div><span>Answer key</span><strong>2 of 3 matched</strong></div><div><span>Next review</span><strong>Tomorrow</strong></div></section>
    <section class="how"><div class="section-label">How Recall Anchor scores a review</div><h2>See what matched and when to review again</h2><ol><li><span>01</span><div><h3>Type your answer before seeing the key</h3><p>Write the answer you remember.</p></div></li><li><span>02</span><div><h3>Compare it with the answer key</h3><p>Use exact text, a number range, or a checklist.</p></div></li><li><span>03</span><div><h3>See why the card returns when it does</h3><p>Read what matched and the next review date.</p></div></li></ol></section>
    <section class="boundaries"><div><p class="eyebrow">Data storage and privacy</p><h2>Cards and reviews stay in this browser</h2><p>Cards and reviews are stored on this device.</p><a href="/privacy" data-link>Read the privacy details</a></div><div class="stamp" aria-hidden="true">LOCAL<br>ONLY</div></section>
    <section class="pricing"><p class="eyebrow">Plans</p><h2>Use 30 cards free or buy unlimited cards</h2><div class="price-row"><div><strong>$19</strong><span>one-time purchase</span></div><p>The Recall Anchor Desk license adds unlimited cards and review trends. The free plan includes 30 cards, every card type, and every export.</p></div><div class="price-actions"><a class="button primary" href="https://api.sociobot.in/api/v1/products/${slug}/checkout">Buy Recall Anchor Desk license <span class="sr-only">(opens hosted checkout)</span></a><a href="/terms" data-link>Read purchase terms</a></div><details class="license-restore"><summary>Have a license?</summary><form data-license-form><label for="home-license">Paste your license</label><div class="inline-form"><input id="home-license" name="license" autocomplete="off" required><button aria-label="Verify license">Verify license</button></div><p class="form-status" aria-live="polite"></p></form></details></section>
  `);
}

function studyPage(): string {
  const queue = dueCards();
  if (!data.cards.length) return shell(`<section class="page-head"><p class="eyebrow">Review desk</p><h1 tabindex="-1">Add a card before you study</h1><p>Your due cards will appear here with an answer field.</p><a class="button primary" href="/cards" data-link>Add your first card</a></section>`);
  if (revealed) return shell(renderReveal(revealed));
  let card = data.cards.find(item => item.id === activeCardId && queue.some(due => due.id === item.id));
  card ||= queue[0];
  if (!card) return shell(`<section class="page-head complete-sheet"><p class="eyebrow">Review desk</p><h1 tabindex="-1">You cleared today’s cards</h1><p>No cards are due now. Your next scheduled card appears on ${escapeHtml(dateLabel(data.cards.sort((a,b) => a.dueAt.localeCompare(b.dueAt))[0].dueAt))}.</p><button class="button secondary" data-action="study-anyway">Study the next card anyway</button></section>`);
  activeCardId = card.id;
  const typeHelp = card.type === 'exact' ? 'Case, accents, and extra spaces do not change an exact match.' : card.type === 'numeric' ? `Enter one number. The accepted range stays hidden until scoring.` : 'Write every item you recall. Separate them however you like.';
  return shell(`<section class="review-shell">
    <div class="review-top"><div><p class="eyebrow">${escapeHtml(card.deck)} · ${queue.length} due</p><h1 tabindex="-1">Answer before you see the key</h1></div><span class="card-kind">${card.type}</span></div>
    <form class="answer-sheet" data-answer-form>
      <div class="question-number" aria-hidden="true">Q${String(card.reviewCount + 1).padStart(2,'0')}</div>
      <p class="prompt">${escapeHtml(card.prompt)}</p>
      <label for="answer">Your answer</label>
      <textarea id="answer" name="answer" rows="5" required aria-describedby="answer-help" autofocus></textarea>
      <p id="answer-help" class="field-help">${escapeHtml(typeHelp)}</p>
      <fieldset><legend>How sure were you before scoring?</legend><div class="confidence"><label><input type="radio" name="confidence" value="unsure" required><span>Unsure</span></label><label><input type="radio" name="confidence" value="close"><span>Close</span></label><label><input type="radio" name="confidence" value="certain"><span>Certain</span></label></div></fieldset>
      <div class="form-error" role="alert"></div>
      <div class="answer-actions"><button class="button primary">Score my answer</button><span>Ctrl + Enter</span></div>
    </form>
  </section>`);
}

function renderReveal(result: NonNullable<typeof revealed>): string {
  const { card, answer, confidence, review } = result;
  const percent = Math.round(review.score * 100);
  const answerKey = card.type === 'checklist' ? card.checklist : [card.type === 'numeric' ? `${card.answer} ± ${card.tolerance}` : [card.answer, ...card.aliases].join(' / ')];
  const when = review.nextInterval === 0 ? 'in 10 minutes' : review.nextInterval === 1 ? 'tomorrow' : `in ${review.nextInterval} days`;
  return `<section class="review-shell result-sheet">
    <div class="review-top"><div><p class="eyebrow">Scored answer</p><h1 tabindex="-1">${percent}% of the answer key matched</h1></div><span class="score-seal">${percent}%</span></div>
    <div class="evidence-grid"><section><h2>Your answer</h2><p class="answer-quote">${escapeHtml(answer)}</p><small>Confidence: ${escapeHtml(confidence)}</small></section><section><h2>Answer key</h2><ul>${answerKey.map(item => {
      const matched = card.type === 'checklist' ? review.matched.includes(item) : review.score === 1 && review.missing.length === 0;
      return `<li class="${matched ? 'matched' : 'missing'}"><span class="sr-only">${matched ? 'Matched' : 'Missing'}: </span><span aria-hidden="true">${matched ? '✓' : '○'}</span> <span>${escapeHtml(item)}</span></li>`;
    }).join('')}</ul></section></div>
    <div class="interval-explain"><span class="interval-arrow" aria-hidden="true">→</span><div><p class="eyebrow">Next review ${when}</p><h2>Why this interval changed</h2><p>${escapeHtml(review.explanation)} Previous interval: ${review.previousInterval || 0} days.</p></div></div>
    <div class="result-actions"><button class="button primary" data-action="next-card">Review next card</button><a href="/cards" data-link>View all cards</a></div>
  </section>`;
}

function cardsPage(): string {
  const atLimit = !isLicensed() && data.cards.length >= FREE_CARD_LIMIT;
  return shell(`<section class="page-head cards-head"><p class="eyebrow">Card workshop</p><h1 tabindex="-1">Build answer keys you can score</h1><p>Choose exact text, a number range, or a checklist for each card.</p></section>
    <section class="card-maker"><div><h2>Add a card</h2><p>Free plans hold 30 cards. You have ${data.cards.length}.</p></div>
        ${atLimit ? `<div class="limit-note"><strong>Your 30-card free plan is full.</strong><p>Export or remove cards, or buy Desk for unlimited cards.</p><a class="button primary" href="https://api.sociobot.in/api/v1/products/${slug}/checkout">Buy Desk for $19 <span class="sr-only">(opens hosted checkout)</span></a></div>` : `<form data-card-form>
        <label for="deck">Deck</label><input id="deck" name="deck" value="My deck" required maxlength="60">
        <label for="prompt">Prompt</label><textarea id="prompt" name="prompt" required maxlength="500" rows="3"></textarea>
        <label for="type">Answer type</label><select id="type" name="type"><option value="exact">Exact text</option><option value="numeric">Numeric tolerance</option><option value="checklist">Checklist recall</option></select>
        <div data-fields="exact"><label for="exact-answer">Expected answer</label><input id="exact-answer" name="exactAnswer"><label for="aliases">Accepted alternatives <span>(optional, one per line)</span></label><textarea id="aliases" name="aliases" rows="2"></textarea></div>
        <div data-fields="numeric" hidden><label for="number-answer">Expected number</label><input id="number-answer" name="numberAnswer" inputmode="decimal" type="number" step="any"><label for="tolerance">Tolerance, plus or minus</label><input id="tolerance" name="tolerance" inputmode="decimal" type="number" step="any" min="0" value="0"></div>
        <div data-fields="checklist" hidden><label for="checklist">Checklist items <span>(one per line)</span></label><textarea id="checklist" name="checklist" rows="4"></textarea></div>
        <div class="form-error" role="alert"></div><button class="button primary">Save card</button>
      </form>`}
    </section>
    <section class="library"><div class="library-title"><div><p class="eyebrow">${data.cards.length} cards · ${dueCards().length} due</p><h2>Your cards</h2></div><a class="button secondary" href="/study" data-link>Study due cards</a></div>
      ${data.cards.length ? `<ul class="card-list">${data.cards.map(card => `<li><div><span class="card-kind">${card.type}</span><strong>${escapeHtml(card.prompt)}</strong><small>${escapeHtml(card.deck)} · next ${dateLabel(card.dueAt)}</small></div><button class="text-button danger" data-delete-card="${card.id}" aria-label="Remove card: ${escapeHtml(card.prompt)}">Remove</button></li>`).join('')}</ul>` : `<div class="empty-state"><span aria-hidden="true">＋</span><h3>No cards yet</h3><p>Save the form above. Your first due card will appear here.</p></div>`}
    </section>
    <section class="data-tools"><div><p class="eyebrow">Portable study record</p><h2>Export or restore your data</h2><p>Download review CSV or an Anki-formatted card CSV. Encrypted backups restore this app.</p></div><div class="tool-grid"><button data-action="export-reviews">Export review CSV</button><button data-action="export-anki">Export Anki card CSV</button></div>
      <form data-backup-form><label for="backup-passphrase">Backup passphrase</label><div class="inline-form"><input id="backup-passphrase" name="passphrase" type="password" minlength="8" required aria-describedby="backup-help"><button name="intent" value="export">Export encrypted backup</button></div><p id="backup-help" class="field-help">Use at least eight characters. The passphrase never leaves this page.</p><label class="file-label" for="backup-file">Choose an encrypted backup</label><input id="backup-file" name="file" type="file" accept="application/json,.json"><button name="intent" value="import">Import encrypted backup</button><p class="form-status" aria-live="polite"></p></form>
    </section>
    ${trendsPanel()}`);
}

function trendsPanel(): string {
  if (!isLicensed()) return `<section class="trends locked"><p class="eyebrow">Recall Anchor Desk license</p><h2>See your review trend</h2><p>The Recall Anchor Desk license adds answer-match trends and unlimited cards for $19 once.</p><a class="button primary" href="https://api.sociobot.in/api/v1/products/${slug}/checkout">Buy Recall Anchor Desk license for $19 <span class="sr-only">(opens hosted checkout)</span></a><details class="license-restore"><summary>Restore a purchase</summary><form data-license-form><label for="card-license">Paste your license</label><div class="inline-form"><input id="card-license" name="license" required><button aria-label="Verify license">Verify license</button></div><p class="form-status" aria-live="polite"></p></form></details></section>`;
  const last = data.reviews.slice(-20);
  const average = last.length ? Math.round(last.reduce((sum, item) => sum + item.score, 0) / last.length * 100) : 0;
  const confident = last.filter(item => item.confidence === 'certain' && item.score < .8).length;
  return `<section class="trends"><p class="eyebrow">Recall Anchor Desk license · active</p><h2>Your last 20 reviews</h2><div class="trend-metrics"><div><strong>${average}%</strong><span>average answer-key match</span></div><div><strong>${last.length}</strong><span>answers recorded</span></div><div><strong>${confident}</strong><span>certain answers below 80%</span></div></div></section>`;
}

function privacyPage(): string { return shell(`<article class="legal"><p class="eyebrow">Policy / August 29, 2026</p><h1 tabindex="-1">Your cards stay in your browser</h1><p>Recall Anchor stores cards and review answers on this device. It has no analytics or third-party runtime scripts.</p><h2>What leaves the device</h2><p>Card creation, review, and export stay on this device. Sociobot is contacted when you verify a license, receive one after checkout, or refresh a saved license after a day.</p><h2>Demo separation</h2><p>Demo cards use separate browser storage. Leaving the demo does not copy those cards into your real collection.</p><h2>Delete and export</h2><p>Remove cards from the Cards page. Past review rows stay in Review CSV exports.</p><p>Use your browser’s site-data controls to remove cards, reviews, demo changes, licenses, and cached app files.</p><p>Download an encrypted backup and restore it with your passphrase.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`); }

function termsPage(): string { return shell(`<article class="legal"><p class="eyebrow">Terms / August 29, 2026</p><h1 tabindex="-1">Use Recall Anchor for personal study</h1><h2>Free and paid use</h2><p>The free plan holds 30 cards. The Recall Anchor Desk license costs $19 once and adds unlimited cards plus review trends.</p><h2>Purchases</h2><p>The Desk purchase opens Sociobot’s hosted checkout. A license must be active for paid features to remain available.</p><h2>Your responsibility</h2><p>Keep an encrypted backup and its passphrase. Browser storage can be cleared by your device or browser.</p><h2>Warranty</h2><p>The software is provided as is under the MIT License. Use it only where local law allows.</p></article>`); }

function notFoundPage(): string { return shell(`<section class="not-found"><span aria-hidden="true">404</span><p class="eyebrow">Error 404</p><h1 tabindex="-1">Page not found</h1><p>The address may be wrong or the page may have moved.</p><a class="button primary" href="/" data-link>Return home</a></section>`); }

async function render(focusHeading = false, restoreScroll: number | null = null): Promise<void> {
  demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  data = await loadData(demo);
  const path = location.pathname;
  const viewPath = demo && path === '/' ? '/demo' : path;
  setMeta(routeMeta[viewPath] ? viewPath : '/404');
  app.innerHTML = viewPath === '/' ? homePage() : viewPath === '/study' || viewPath === '/demo' ? studyPage() : viewPath === '/cards' ? cardsPage() : viewPath === '/privacy' ? privacyPage() : viewPath === '/terms' ? termsPage() : notFoundPage();
  bindEvents();
  if (focusHeading) {
    const heading = app.querySelector<HTMLElement>('h1');
    heading?.focus({ preventScroll: true });
    const live = app.querySelector<HTMLElement>('.route-announcer');
    if (live && heading) live.textContent = heading.textContent;
  }
  if (restoreScroll !== null) {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    scrollToPosition(restoreScroll);
  }
}

async function navigate(url: string, preserveDemo = true): Promise<void> {
  const destination = demo && preserveDemo && url !== '/demo' ? `${url}${url.includes('?') ? '&' : '?'}demo=1` : url;
  history.replaceState({ ...history.state, scrollY }, '', location.href);
  history.pushState({ scrollY: 0 }, '', destination);
  revealed = null; activeCardId = ''; notice = '';
  await render(true, 0);
}

function bindEvents(): void {
  app.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(link => link.addEventListener('click', event => { if (!event.metaKey && !event.ctrlKey) { event.preventDefault(); void navigate(link.pathname + link.search); } }));
  app.querySelector<HTMLAnchorElement>('[data-start-real]')?.addEventListener('click', event => { event.preventDefault(); void navigate('/cards', false); });
  app.querySelector('[data-action="reset-demo"]')?.addEventListener('click', async () => { data = await resetDemo(); revealed = null; activeCardId = ''; notice = 'Sample cards were reset.'; await render(); });
  app.querySelector('[data-action="apply-update"]')?.addEventListener('click', () => updateWorker?.postMessage({ type: 'SKIP_WAITING' }));
  const answerForm = app.querySelector<HTMLFormElement>('[data-answer-form]');
  answerForm?.addEventListener('keydown', event => { if (event.ctrlKey && event.key === 'Enter') answerForm.requestSubmit(); });
  answerForm?.addEventListener('submit', event => { event.preventDefault(); void submitAnswer(answerForm); });
  app.querySelector('[data-action="next-card"]')?.addEventListener('click', () => { revealed = null; activeCardId = ''; void render(); });
  app.querySelector('[data-action="study-anyway"]')?.addEventListener('click', () => void updateData(demo, current => {
    const next = [...current.cards].sort((a,b) => a.dueAt.localeCompare(b.dueAt))[0];
    if (next) next.dueAt = new Date(0).toISOString();
    return current;
  }).then(latest => { data = latest; return render(); }));
  const cardForm = app.querySelector<HTMLFormElement>('[data-card-form]');
  if (cardForm) cardForm.dataset.submissionId = uid();
  const typeSelect = cardForm?.elements.namedItem('type') as HTMLSelectElement | null;
  typeSelect?.addEventListener('change', () => app.querySelectorAll<HTMLElement>('[data-fields]').forEach(group => group.hidden = group.dataset.fields !== typeSelect.value));
  cardForm?.addEventListener('submit', event => { event.preventDefault(); void addCard(cardForm); });
  app.querySelectorAll<HTMLButtonElement>('[data-delete-card]').forEach(button => button.addEventListener('click', () => void removeCard(button.dataset.deleteCard!)));
  app.querySelector('[data-action="export-reviews"]')?.addEventListener('click', () => downloadFile('recall-anchor-reviews.csv', reviewsCsv(data.reviews), 'text/csv'));
  app.querySelector('[data-action="export-anki"]')?.addEventListener('click', () => downloadFile('recall-anchor-anki.csv', ankiCsv(data.cards), 'text/csv'));
  app.querySelector<HTMLFormElement>('[data-backup-form]')?.addEventListener('submit', event => { event.preventDefault(); void backupAction(event.submitter as HTMLButtonElement, event.currentTarget as HTMLFormElement); });
  app.querySelectorAll<HTMLFormElement>('[data-license-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); void restoreLicense(form); }));
}

async function submitAnswer(form: HTMLFormElement): Promise<void> {
  if (answerSubmissionPending) return;
  const formData = new FormData(form);
  const answer = String(formData.get('answer') || '').trim();
  const confidence = formData.get('confidence') as 'unsure' | 'close' | 'certain' | null;
  const error = form.querySelector<HTMLElement>('.form-error')!;
  if (!answer || !confidence) { error.textContent = 'Write an answer and choose your confidence before scoring.'; return; }
  answerSubmissionPending = true;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])');
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Scoring answer…'; }
  try {
    let savedCard: Card | undefined;
    let savedReview: Review | undefined;
    data = await updateData(demo, current => {
      const card = current.cards.find(item => item.id === activeCardId);
      if (!card) throw new Error('This card is no longer available. Reload and try again.');
      const scored = scoreCard(card, answer);
      const interval = nextInterval(card, scored.score, confidence);
      const dueAt = dueDate(interval.days);
      const review: Review = { id: uid(), cardId: card.id, prompt: card.prompt, typedAnswer: answer, confidence, score: scored.score, matched: scored.matched, missing: scored.missing, reviewedAt: new Date().toISOString(), previousInterval: card.intervalDays, nextInterval: interval.days, dueAt, explanation: interval.explanation };
      current.reviews.push(review);
      card.intervalDays = interval.days; card.dueAt = dueAt; card.reviewCount += 1;
      savedCard = structuredClone(card);
      savedReview = review;
      return current;
    });
    revealed = { card: savedCard!, answer, confidence, review: savedReview! };
    await render(true);
  } catch (cause) {
    error.textContent = cause instanceof Error ? cause.message : 'The answer could not be saved. Try again.';
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = 'Score my answer'; }
  } finally {
    answerSubmissionPending = false;
  }
}

async function addCard(form: HTMLFormElement): Promise<void> {
  if (cardSubmissionPending) return;
  const values = new FormData(form);
  const type = String(values.get('type')) as CardType;
  const exact = String(values.get('exactAnswer') || '').trim();
  const numeric = String(values.get('numberAnswer') || '').trim();
  const checklist = String(values.get('checklist') || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  const error = form.querySelector<HTMLElement>('.form-error')!;
  if ((type === 'exact' && !exact) || (type === 'numeric' && numeric === '') || (type === 'checklist' && checklist.length < 2)) { error.textContent = type === 'checklist' ? 'Add at least two checklist items, one per line.' : 'Add the expected answer before saving.'; return; }
  const card: Card = { id: form.dataset.submissionId || uid(), deck: String(values.get('deck')).trim(), prompt: String(values.get('prompt')).trim(), type, answer: type === 'exact' ? exact : type === 'numeric' ? numeric : '', aliases: String(values.get('aliases') || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean), tolerance: Number(values.get('tolerance') || 0), checklist, intervalDays: 0, dueAt: new Date(0).toISOString(), reviewCount: 0, createdAt: new Date().toISOString() };
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])');
  cardSubmissionPending = true;
  form.setAttribute('aria-busy', 'true');
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Saving card…'; }
  try {
    data = await addCardToStore(demo, card, isLicensed());
    notice = 'Card saved and ready to study.';
    await render();
  } catch (cause) {
    if (cause instanceof CardLimitError) {
      notice = cause.message;
      await render();
    } else {
      error.textContent = 'The card could not be saved. Try again.';
    }
  } finally {
    cardSubmissionPending = false;
    if (form.isConnected) {
      form.removeAttribute('aria-busy');
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = 'Save card'; }
    }
  }
}

async function removeCard(id: string): Promise<void> {
  const card = data.cards.find(item => item.id === id);
  if (!card || !confirm(`Remove “${card.prompt}”? Its past review rows stay in exports.`)) return;
  data = await updateData(demo, current => { current.cards = current.cards.filter(item => item.id !== id); return current; }); notice = 'Card removed. Past review rows were kept.'; await render();
}

async function backupAction(button: HTMLButtonElement, form: HTMLFormElement): Promise<void> {
  const passphrase = String(new FormData(form).get('passphrase') || '');
  const status = form.querySelector<HTMLElement>('.form-status')!;
  if (passphrase.length < 8) { status.textContent = 'Use at least eight characters for the backup passphrase.'; return; }
  try {
    if (button.value === 'export') {
      downloadFile('recall-anchor-backup.json', await encryptBackup(data, passphrase), 'application/json');
      status.textContent = 'Encrypted backup downloaded.';
    } else {
      const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0];
      if (!file) { status.textContent = 'Choose a Recall Anchor backup before importing.'; return; }
      const restored = await decryptBackup(await file.text(), passphrase);
      if (!confirm(`Replace this collection with ${restored.cards.length} cards and ${restored.reviews.length} reviews?`)) return;
      await saveData(demo, restored); data = restored; notice = 'Encrypted backup restored.'; await render();
    }
  } catch (cause) {
    status.textContent = cause instanceof BackupValidationError
      ? 'This backup has invalid card or review data. Your current collection was not changed.'
      : 'The backup could not be opened. Check the file and passphrase.';
  }
}

async function restoreLicense(form: HTMLFormElement): Promise<void> {
  const token = String(new FormData(form).get('license') || '').trim();
  const status = form.querySelector<HTMLElement>('.form-status')!;
  if (!token) return;
  status.textContent = 'Checking the license…';
  localStorage.setItem(licenseKey, token);
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean; reason: string; expires_at?: string };
    localStorage.setItem(`${licenseKey}:verdict`, JSON.stringify({ ...result, checkedAt: Date.now() }));
    if (result.valid) { notice = 'Recall Anchor Desk is active on this device.'; await render(); }
    else status.textContent = 'This license is not active. Check the token or buy a new license.';
  } catch { status.textContent = 'The license check could not connect. Try again when you are online.'; }
}

async function consumeReturnedLicense(): Promise<void> {
  const url = new URL(location.href); const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(licenseKey, token); url.searchParams.delete('license'); history.replaceState({}, '', url.pathname + url.search + url.hash);
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json(); localStorage.setItem(`${licenseKey}:verdict`, JSON.stringify({ ...result, checkedAt: Date.now() }));
    notice = result.valid ? 'Purchase restored. Recall Anchor Desk is active.' : 'The returned license is not active.';
  } catch { notice = 'Your license was saved. It will be checked when you are online.'; }
}

async function refreshCachedLicense(): Promise<void> {
  const token = localStorage.getItem(licenseKey); if (!token) return;
  let cached: { checkedAt?: number } = {}; try { cached = JSON.parse(localStorage.getItem(`${licenseKey}:verdict`) || '{}'); } catch { /* no cache */ }
  if (cached.checkedAt && Date.now() - cached.checkedAt < 86400000) return;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json(); localStorage.setItem(`${licenseKey}:verdict`, JSON.stringify({ ...result, checkedAt: Date.now() }));
    if (!result.valid) { notice = 'Your license is no longer active. Free features still work.'; await render(); }
  } catch { /* keep cached verdict while offline */ }
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const register = () => navigator.serviceWorker.register('/sw.js').then(registration => {
    if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration.waiting);
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => { if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration.waiting); }));
  }).catch(() => { /* app remains usable without install support */ });
  if (document.readyState === 'complete') void register(); else window.addEventListener('load', register, { once: true });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (updateWorker) location.reload(); });
}

function showUpdate(worker: ServiceWorker): void { updateWorker = worker; const toast = app.querySelector<HTMLElement>('.update-toast'); if (toast) toast.hidden = false; }

history.scrollRestoration = 'manual';
history.replaceState({ ...history.state, scrollY: history.state?.scrollY ?? scrollY }, '', location.href);
window.addEventListener('scroll', () => {
  history.replaceState({ ...history.state, scrollY }, '', location.href);
}, { passive: true });
window.addEventListener('popstate', event => {
  revealed = null; activeCardId = ''; notice = '';
  const targetScroll = typeof event.state?.scrollY === 'number' ? event.state.scrollY : 0;
  void render(true, targetScroll);
});
window.addEventListener('online', () => { notice = 'Back online. Your local cards stayed available.'; void render(); });
window.addEventListener('offline', () => { notice = ''; void render(); });

await consumeReturnedLicense();
await render();
void refreshCachedLicense();
registerServiceWorker();
