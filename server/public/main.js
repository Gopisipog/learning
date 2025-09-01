async function loadContent() {
  const res = await fetch('/api/azure-ch03');
  const text = await res.text();
  return text;
}

function parseSections(md) {
  const sections = [];
  const lines = md.split('\n');
  let current = { title: '', lines: [] };
  function pushCurrent() {
    if (current.lines.length || current.title) {
      sections.push({ title: current.title || 'Note', lines: current.lines });
    }
  }
  for (const line of lines) {
    if (line.startsWith('# ')) {
      pushCurrent();
      current = { title: line.replace(/^#\s+/, '').trim(), lines: [] };
    } else if (line.startsWith('## ')) {
      pushCurrent();
      current = { title: line.replace(/^##\s+/, '').trim(), lines: [] };
    } else if (line.startsWith('---')) {
      pushCurrent();
      current = { title: '', lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  pushCurrent();
  return sections;
}

function extractIndented(lines, startIdx) {
  const out = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s{2,}|\t/.test(l)) out.push(l.trim());
    else if (l.trim() === '') out.push(l.trim());
    else break;
  }
  return out.join('\n').trim();
}

function parsePatternCards(section) {
  const cards = [];
  const lines = section.lines;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*Pattern:\s*/i.test(line)) {
      const title = line.replace(/^\s*Pattern:\s*/i, '').trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*Pattern:\s*/i.test(lines[i]) && !/^##\s+/.test(lines[i]) && !/^#\s+/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      const block = buf.join('\n');
      // Extract well-known bullets
      const problem = /-\s*Problem:\s*([\s\S]*?)(?=\n-\s*|$)/i.exec(block)?.[1]?.trim() || '';
      const solution = /-\s*Solution:\s*([\s\S]*?)(?=\n-\s*|$)/i.exec(block)?.[1]?.trim() || '';
      const mapping = /-\s*Azure mapping:\s*([\s\S]*?)(?=\n-\s*|$)/i.exec(block)?.[1]?.trim() || '';
      const monitor = /-\s*Monitor:\s*([\s\S]*?)(?=\n-\s*|$)/i.exec(block)?.[1]?.trim() || '';
      const pitfalls = /-\s*Pitfalls?:\s*([\s\S]*?)(?=\n-\s*|$)/i.exec(block)?.[1]?.trim() || '';
      const meaning = [problem ? `Problem: ${problem}` : '', solution ? `Solution: ${solution}` : ''].filter(Boolean).join('\n');
      const further = [mapping ? `Azure mapping: ${mapping}` : '', monitor ? `Monitor: ${monitor}` : '', pitfalls ? `Pitfalls: ${pitfalls}` : ''].filter(Boolean).join('\n');
      cards.push({ title, meaning, further, section: section.title });
      continue; // skip i++ due to manual increment
    }
    i++;
  }
  return cards;
}

function parseBulletCards(section) {
  const cards = [];
  const lines = section.lines;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const m = /^\s*-\s*(\[\s*\]|\[x\])?\s*(.*)$/.exec(l);
    if (m) {
      const title = m[2].trim();
      const extra = extractIndented(lines, i);
      const meaning = title;
      const further = extra || `From: ${section.title}`;
      if (title) cards.push({ title, meaning, further, section: section.title });
    }
  }
  return cards;
}

function parseChecklistCards(section) {
  const cards = [];
  const lines = section.lines;
  let inChecklist = /checklist/i.test(section.title) || lines.some(l => /\[\s*\]/.test(l));
  if (!inChecklist) return cards;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const m = /^\s*-\s*\[\s*\]\s*(.*)$/.exec(l);
    if (m) {
      const title = m[1].trim();
      const extra = extractIndented(lines, i);
      const meaning = `Ensure: ${title}`;
      const further = extra || `Why: Improves ${section.title.toLowerCase()}`;
      cards.push({ title, meaning, further, section: section.title });
    }
  }
  return cards;
}

function parseCodeAndDiagramCards(section) {
  const cards = [];
  const text = section.lines.join('\n');
  const codeBlocks = [...text.matchAll(/```([\s\S]*?)```/g)].map(m => m[1]);
  codeBlocks.forEach((code, idx) => {
    cards.push({
      title: `${section.title} — Diagram/Code ${idx + 1}`,
      meaning: 'Reference snippet',
      further: code.trim(),
      section: section.title
    });
  });
  return cards;
}

function buildDefinitionCards(sections) {
  const out = [];
  for (const sec of sections) {
    // Prioritize pattern cards in pattern sections
    if (/pattern/i.test(sec.title)) {
      const pcs = parsePatternCards(sec);
      if (pcs.length) { out.push(...pcs); continue; }
    }
    // Checklists
    const checklistCards = parseChecklistCards(sec);
    if (checklistCards.length) out.push(...checklistCards);
    // Bullets
    const bulletCards = parseBulletCards(sec);
    if (bulletCards.length) out.push(...bulletCards);
    // Code/diagrams
    const codeCards = parseCodeAndDiagramCards(sec);
    if (codeCards.length) out.push(...codeCards);
    // Fallback: if nothing parsed and section has content, keep as a long-form card
    if (!checklistCards.length && !bulletCards.length && !codeCards.length) {
      const body = sec.lines.join('\n').trim();
      if (body) {
        out.push({
          title: sec.title,
          meaning: body,
          further: `Context: ${sec.title}`,
          section: sec.title
        });
      }
    }
  }
  return out;
}

function renderCards(cards) {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  for (const card of cards) {
    const article = document.createElement('article');
    article.className = 'card';

    const h2 = document.createElement('h2');
    h2.className = 'card-title';
    h2.textContent = card.title;

    const body = document.createElement('div');
    body.className = 'card-body';

    const meaningTitle = document.createElement('div');
    meaningTitle.innerHTML = '<span class="badge">Meaning</span>';
    const meaning = document.createElement('div');
    meaning.textContent = card.meaning || '';

    const furtherTitle = document.createElement('div');
    furtherTitle.style.marginTop = '8px';
    furtherTitle.innerHTML = '<span class="badge">Further Understanding</span>';
    const further = document.createElement('div');
    further.textContent = card.further || '';

    body.appendChild(meaningTitle);
    body.appendChild(meaning);
    body.appendChild(furtherTitle);
    body.appendChild(further);

    article.appendChild(h2);
    article.appendChild(body);
    feed.appendChild(article);
  }
}

(async function init() {
  try {
    const md = await loadContent();
    const sections = parseSections(md);
    const cards = buildDefinitionCards(sections);
    renderCards(cards);
  } catch (e) {
    const feed = document.getElementById('feed');
    feed.innerHTML = `<article class="card"><h2 class="card-title">Error</h2><div class="card-body">${e?.message || e}</div></article>`;
  }
})();
