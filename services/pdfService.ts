
import { PDFDocument } from 'pdf-lib';

export const getPageCount = async (data: ArrayBuffer): Promise<number> => {
  const pdfDoc = await PDFDocument.load(data);
  return pdfDoc.getPageCount();
};

export const mergePDFs = async (pdfDataList: ArrayBuffer[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const data of pdfDataList) {
    const pdfDoc = await PDFDocument.load(data);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

export const splitPDF = async (data: ArrayBuffer, start: number, end: number): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(data);
  const newPdf = await PDFDocument.create();
  
  // Page numbers are 1-based for users, but indices are 0-based
  const totalPages = pdfDoc.getPageCount();
  const startIndex = Math.max(0, start - 1);
  const endIndex = Math.min(totalPages - 1, end - 1);
  
  const pageIndices = [];
  for (let i = startIndex; i <= endIndex; i++) {
    pageIndices.push(i);
  }
  
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
};

export const downloadBlob = (data: Uint8Array, fileName: string) => {
  const blob = new Blob([data as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
