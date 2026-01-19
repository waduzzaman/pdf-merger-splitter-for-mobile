
export interface PDFFile {
  id: string;
  name: string;
  size: number;
  data: ArrayBuffer;
  pageCount: number;
}

export enum AppMode {
  MERGE = 'MERGE',
  SPLIT = 'SPLIT'
}

export interface SplitRange {
  start: number;
  end: number;
}
