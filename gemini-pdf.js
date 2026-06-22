#!/usr/bin/env node
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3] || 'gemini_task.pdf';

function createPDF(text, outputPath) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 30, bottom: 30, left: 25, right: 25 }
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const fontPath = path.join(
    process.env.SYSTEMROOT || 'C:\\Windows',
    'Fonts', 'arial.ttf'
  );
  if (fs.existsSync(fontPath)) {
    doc.registerFont('Arial', fontPath);
    doc.font('Arial');
  }
  doc.fontSize(11);

  const lines = text.split('\n');
  for (const line of lines) {
    doc.text(line, { align: 'left' });
  }

  doc.end();
  stream.on('finish', () => {
    const size = fs.statSync(outputPath).size;
    console.log(`PDF created: ${outputPath} (${(size / 1024).toFixed(1)} KB)`);
  });
}

if (inputFile && fs.existsSync(inputFile)) {
  const text = fs.readFileSync(inputFile, 'utf-8');
  createPDF(text, outputFile);
} else if (!inputFile) {
  let stdin = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', chunk => stdin += chunk);
  process.stdin.on('end', () => createPDF(stdin, outputFile));
} else {
  console.error('Usage: gemini-pdf [input.txt] [output.pdf]');
  process.exit(1);
}
