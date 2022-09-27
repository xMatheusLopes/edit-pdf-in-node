
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from "node-fetch";
import * as fs from 'fs';
import fontkit from '@pdf-lib/fontkit'

async function modifyPdf() {
  const url = 'http://127.0.0.1:8080/files/teste.pdf'
  const urlFont = 'http://127.0.0.1:8080/files/BNPP Sans Condensed Light.otf'
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
  const fontBytes = await fetch(urlFont).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit);
  const bnpp = await pdfDoc.embedFont(fontBytes)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText('Teste de input', {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: bnpp,
    color: rgb(0.95, 0.1, 0.1)
  })

  const pdfBytes = await pdfDoc.save();

  var callback = (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  }
  fs.writeFile('aa.pdf', pdfBytes, callback);

}

modifyPdf().then(response => console.log(response));