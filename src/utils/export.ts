import { toPng } from 'html-to-image';

function sanitizeFilenamePart(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '_');
}

export async function downloadNodeAsPng(node: HTMLElement, filenameBase: string): Promise<void> {
  const dataUrl = await toPng(node, {
    backgroundColor: '#07111b',
    cacheBust: true,
    pixelRatio: 2,
    filter: (target) => {
      if (!(target instanceof HTMLElement)) {
        return true;
      }

      return target.dataset.exportIgnore !== 'true';
    },
  });

  const link = document.createElement('a');
  link.download = `${sanitizeFilenamePart(filenameBase)}.png`;
  link.href = dataUrl;
  link.click();
}
