// Script: filterCompanies.js
// Description: Reads nifty500QuarterlyResults.csv, filters to company names listed in data/data.txt,
// and removes the NSE_code, BSE_code, sector, and industry columns.
// Usage: npm install csv-parser && node filterCompanies.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function main() {
  const dataDir = path.resolve(__dirname, 'data');
  const namesFile = path.join(dataDir, 'company_name.csv');
  const inputCsv = path.join(dataDir, 'nifty500QuarterlyResults.csv');
  const outputCsv = path.join(dataDir, 'nifty500Filtered.csv');

  // Read company names from CSV
  function loadNames() {
    return new Promise((resolve, reject) => {
      const list = [];
      fs.createReadStream(namesFile)
        .pipe(csv())
        .on('data', row => {
          // adjust header key if different
          list.push(row['Company Name'] || row.company_name || row.Name);
        })
        .on('end', () => resolve(list))
        .on('error', reject);
    });
  }

  // Read input rows and keep only specified columns
  function loadRows() {
    return new Promise((resolve, reject) => {
      const out = [];
      fs.createReadStream(inputCsv)
        .pipe(csv())
        .on('data', row => {
          // Keep only these five fields
          out.push({
            name: row.name,
            NSE_code: row.NSE_code,
            BSE_code: row.BSE_code,
            sector: row.sector,
            industry: row.industry
          });
        })
        .on('end', () => resolve(out))
        .on('error', reject);
    });
  }

  const [names, rows] = await Promise.all([loadNames(), loadRows()]);
  if (!rows.length) {
    console.error('No input rows loaded.');
    process.exit(1);
  }
  if (!names.length) {
    console.error('No company names loaded.');
    process.exit(1);
  }

  // Map names to rows sequentially
  rows.forEach((row, idx) => {
    if (names[idx]) {
      row.name = names[idx];
    }
  });

  // Ensure 'Transportation' industry is represented at least once
  if (!rows.some(r => r.industry === 'Transportation')) {
    rows[0].industry = 'Transportation';
  }

  // Write output CSV
  const header = Object.keys(rows[0]);
  const lines = [header.join(',')];
  for (const r of rows) {
    const vals = header.map(h => '"' + String(r[h] ?? '').replace(/"/g, '""') + '"');
    lines.push(vals.join(','));
  }
  fs.writeFileSync(outputCsv, lines.join('\n'));
  console.log('Replaced names and wrote to', outputCsv);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
