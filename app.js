const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

const bankRecords = [
  { reference: 'BNK-2401', counterparty: 'Northwind Supplies', amount: 18450, date: '2026-10-14' },
  { reference: 'BNK-2402', counterparty: 'Harborline Logistics', amount: 9275, date: '2026-10-14' },
  { reference: 'BNK-2403', counterparty: 'Pine & Co.', amount: 12600, date: '2026-10-15' },
  { reference: 'BNK-2404', counterparty: 'Blueforge Services', amount: 22150, date: '2026-10-15' },
  { reference: 'BNK-2405', counterparty: 'Orchid Office Hub', amount: 7990, date: '2026-10-16' },
  { reference: 'BNK-2406', counterparty: 'Summit Fieldworks', amount: 15320, date: '2026-10-16' },
];

const ledgerRecords = [
  { reference: 'BNK-2401', description: 'Supplier settlement', amount: 18450, date: '2026-10-14' },
  { reference: 'BNK-2402', description: 'Freight and delivery', amount: 9275, date: '2026-10-14' },
  { reference: 'BNK-2403', description: 'Materials purchase', amount: 12600, date: '2026-10-15' },
  { reference: 'BNK-2404', description: 'Technical services', amount: 22150, date: '2026-10-15' },
  { reference: 'BNK-2405', description: 'Office supplies', amount: 7690, date: '2026-10-16' },
  { reference: 'BK-2406-ALT', description: 'Field maintenance', amount: 15320, date: '2026-10-16' },
];

const bankTable = document.querySelector('#bankTable');
const ledgerTable = document.querySelector('#ledgerTable');
const runButton = document.querySelector('#runDemo');
const resetButton = document.querySelector('#resetDemo');

function renderInputTables() {
  bankTable.innerHTML = bankRecords.map(row => `
    <tr>
      <td>${row.reference}</td>
      <td>${row.counterparty}</td>
      <td class="numeric">${money.format(row.amount)}</td>
    </tr>`).join('');

  ledgerTable.innerHTML = ledgerRecords.map(row => `
    <tr>
      <td>${row.reference}</td>
      <td>${row.description}</td>
      <td class="numeric">${money.format(row.amount)}</td>
    </tr>`).join('');
}

function reconcile() {
  const ledgerByReference = new Map(ledgerRecords.map(item => [item.reference, item]));
  const matched = [];
  const review = [];

  for (const bank of bankRecords) {
    const direct = ledgerByReference.get(bank.reference);

    if (direct && direct.amount === bank.amount) {
      matched.push({ bank, ledger: direct, reason: 'Reference and amount both match' });
      continue;
    }

    if (direct && direct.amount !== bank.amount) {
      review.push({
        bank,
        ledger: direct,
        reason: `Reference matches, but amount differs by ${money.format(Math.abs(bank.amount - direct.amount))}`,
      });
      continue;
    }

    const amountMatches = ledgerRecords.filter(item => item.amount === bank.amount);
    if (amountMatches.length === 1) {
      review.push({
        bank,
        ledger: amountMatches[0],
        reason: 'Amount matches one ledger entry, but the reference does not match',
      });
      continue;
    }

    review.push({ bank, ledger: null, reason: 'No safe ledger match found' });
  }

  return { matched, review };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateWorkflow() {
  runButton.disabled = true;
  runButton.textContent = 'Running workflow…';
  document.querySelector('#runStatus').className = 'status-pill running';
  document.querySelector('#runStatus').textContent = 'Running';
  document.querySelector('#inputStatus').className = 'status-pill success';
  document.querySelector('#inputStatus').textContent = 'Validated';

  const stages = [
    ['Preflight checks passed', 20],
    ['Compiled synthetic bank and ledger records', 40],
    ['Applied safe matching rules', 65],
    ['Routed ambiguous items to review', 85],
    ['Generated operational report', 100],
  ];

  const stepNodes = [...document.querySelectorAll('#stepRow span')];

  for (let i = 0; i < stages.length; i++) {
    const [label, percent] = stages[i];
    stepNodes.forEach((node, index) => {
      node.classList.toggle('done', index < i);
      node.classList.toggle('current', index === i);
    });
    document.querySelector('#progressText').textContent = label;
    document.querySelector('#progressPercent').textContent = `${percent}%`;
    document.querySelector('#progressBar').style.width = `${percent}%`;
    await sleep(420);
  }

  stepNodes.forEach(node => {
    node.classList.remove('current');
    node.classList.add('done');
  });
}

function renderResults({ matched, review }) {
  document.querySelector('#matchedCount').textContent = matched.length;
  document.querySelector('#reviewCount').textContent = review.length;
  document.querySelector('#matchedCaption').textContent = `${Math.round((matched.length / bankRecords.length) * 100)}% safely reconciled`;
  document.querySelector('#reviewCaption').textContent = review.length ? 'requires human decision' : 'no exceptions';
  document.querySelector('#matchedBadge').textContent = `${matched.length} records`;
  document.querySelector('#reviewBadge').textContent = `${review.length} records`;

  document.querySelector('#matchedList').classList.remove('empty-state');
  document.querySelector('#matchedList').innerHTML = matched.map(item => `
    <div class="result-row">
      <div class="result-main">
        <strong>${item.bank.reference}</strong>
        <span>${item.bank.counterparty} · ${item.reason}</span>
      </div>
      <span class="amount success">${money.format(item.bank.amount)}</span>
    </div>`).join('');

  document.querySelector('#reviewList').classList.remove('empty-state');
  document.querySelector('#reviewList').innerHTML = review.map(item => `
    <div class="result-row">
      <div class="result-main">
        <strong>${item.bank.reference}</strong>
        <span>${item.bank.counterparty}</span>
        <span class="reason">${item.reason}</span>
      </div>
      <span class="amount review">${money.format(item.bank.amount)}</span>
    </div>`).join('');

  const matchedTotal = matched.reduce((sum, item) => sum + item.bank.amount, 0);
  const reviewTotal = review.reduce((sum, item) => sum + item.bank.amount, 0);

  const lines = [
    'Book Recon · Demo batch complete',
    '',
    `✅ Safely matched: ${matched.length} records · ${money.format(matchedTotal)}`,
    `⚠️ Human review: ${review.length} records · ${money.format(reviewTotal)}`,
    `📊 Match rate: ${Math.round((matched.length / bankRecords.length) * 100)}%`,
    '',
    review.length
      ? 'Action: Review held items before any financial decision is applied.'
      : 'Action: No manual review required.',
    '',
    'Synthetic portfolio data only · no production records processed.',
  ];

  const discord = document.querySelector('#discordMessage');
  discord.classList.remove('muted');
  discord.textContent = lines.join('\n');

  document.querySelector('#runStatus').className = 'status-pill success';
  document.querySelector('#runStatus').textContent = 'Complete';
  document.querySelector('#reportStatus').className = 'status-pill success';
  document.querySelector('#reportStatus').textContent = 'Generated';
}

function resetDemo() {
  document.querySelector('#matchedCount').textContent = '—';
  document.querySelector('#reviewCount').textContent = '—';
  document.querySelector('#matchedCaption').textContent = 'run the workflow';
  document.querySelector('#reviewCaption').textContent = 'exceptions waiting';
  document.querySelector('#matchedBadge').textContent = '0 records';
  document.querySelector('#reviewBadge').textContent = '0 records';
  document.querySelector('#matchedList').className = 'result-list empty-state';
  document.querySelector('#matchedList').textContent = 'Run the demo to process records.';
  document.querySelector('#reviewList').className = 'result-list empty-state';
  document.querySelector('#reviewList').textContent = 'Ambiguous items will be held here instead of being force-matched.';
  document.querySelector('#discordMessage').className = 'discord-message muted';
  document.querySelector('#discordMessage').textContent = 'Run the reconciliation to generate a structured finance-operations summary.';
  document.querySelector('#progressText').textContent = 'Workflow ready';
  document.querySelector('#progressPercent').textContent = '0%';
  document.querySelector('#progressBar').style.width = '0%';
  document.querySelectorAll('#stepRow span').forEach(node => node.classList.remove('done', 'current'));
  document.querySelector('#runStatus').className = 'status-pill neutral';
  document.querySelector('#runStatus').textContent = 'Not run';
  document.querySelector('#reportStatus').className = 'status-pill neutral';
  document.querySelector('#reportStatus').textContent = 'Waiting';
  document.querySelector('#inputStatus').className = 'status-pill neutral';
  document.querySelector('#inputStatus').textContent = 'Ready';
  runButton.disabled = false;
  runButton.textContent = 'Run demo reconciliation';
}

runButton.addEventListener('click', async () => {
  resetDemo();
  runButton.disabled = true;
  await animateWorkflow();
  renderResults(reconcile());
  runButton.disabled = false;
  runButton.textContent = 'Run demo again';
  document.querySelector('#resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', resetDemo);
renderInputTables();
resetDemo();