import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function generateThumbnail(
  pdfBuffer: Buffer,
  pageNumber: number = 1,
  maxWidth: number = 400,
  maxHeight: number = 560
): Promise<Buffer | null> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;

    if (pageNumber > pdfDocument.numPages) {
      pageNumber = 1;
    }

    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });

    const scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height);
    const scaledViewport = page.getViewport({ scale: scale * 1.5 });

    const canvas = createCanvas(scaledViewport.width, scaledViewport.height);
    const context = canvas.getContext('2d');

    const renderContext = {
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport: scaledViewport,
      canvas: canvas as unknown as HTMLCanvasElement,
    };

    await page.render(renderContext).promise;

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return null;
  }
}

export async function generateAllThumbnails(
  pdfBuffer: Buffer,
  maxWidth: number = 400,
  maxHeight: number = 560
): Promise<Buffer[]> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;
    const thumbnails: Buffer[] = [];

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const thumbnail = await generateThumbnail(pdfBuffer, i, maxWidth, maxHeight);
      if (thumbnail) {
        thumbnails.push(thumbnail);
      }
    }

    return thumbnails;
  } catch (error) {
    console.error('All thumbnails generation error:', error);
    return [];
  }
}

export async function getPdfPageCount(pdfBuffer: Buffer): Promise<number> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;
    return pdfDocument.numPages;
  } catch (error) {
    console.error('PDF page count error:', error);
    return 0;
  }
}

export async function renderPdfPageToDataUrl(
  pdfBuffer: Buffer,
  pageNumber: number,
  scale: number = 1.5
): Promise<string | null> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;

    if (pageNumber > pdfDocument.numPages) {
      return null;
    }

    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    const renderContext = {
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport: viewport,
      canvas: canvas as unknown as HTMLCanvasElement,
    };

    await page.render(renderContext).promise;

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('PDF page render error:', error);
    return null;
  }
}