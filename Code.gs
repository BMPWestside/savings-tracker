const SECTIONS = ['Gold', 'Savings', 'Emergency', 'Travel'];
const SHEET_NAME = 'Entries';
const HEADERS = ['ID', 'Date', 'Section', 'Type', 'Amount', 'Description', 'Created'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Family Funds')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Creates the spreadsheet on first run and remembers it.
function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('Family Funds Data');
    props.setProperty('SHEET_ID', ss.getId());
  }
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.getSheets()[0].setName(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange('B:B').setNumberFormat('@'); // keep dates as plain text
  }
  return sh;
}

function getData() {
  const sh = getSheet_();
  const rows = sh.getDataRange().getValues().slice(1);
  const balances = {};
  SECTIONS.forEach(s => balances[s] = 0);
  const entries = rows.map(r => ({
    id: String(r[0]), date: String(r[1]), section: r[2], type: r[3],
    amount: Number(r[4]), description: r[5]
  }));
  entries.forEach(e => {
    if (balances[e.section] === undefined) return;
    balances[e.section] += e.type === 'Income' ? e.amount : -e.amount;
  });
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return { sections: SECTIONS, balances, entries: entries.slice(0, 200) };
}

function addEntry(e) {
  const amount = Math.round(Number(e.amount) * 100) / 100;
  if (!SECTIONS.includes(e.section)) throw new Error('Choose a section');
  if (!(amount > 0)) throw new Error('Enter an amount above 0');
  if (!['Income', 'Expense'].includes(e.type)) throw new Error('Choose a type');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) throw new Error('Invalid date');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([
      Utilities.getUuid(), e.date, e.section, e.type, amount,
      String(e.description || '').slice(0, 200), new Date()
    ]);
  } finally {
    lock.releaseLock();
  }
  return getData();
}

function deleteEntry(id) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getSheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().flat();
    const i = ids.indexOf(id);
    if (i > 0) sh.deleteRow(i + 1);
  } finally {
    lock.releaseLock();
  }
  return getData();
}
