export type StyleName = 'Ghibli Style' | 'Pencil Sketch' | 'Oil Painting' | 'Cartoon Portrait';

export interface TransformOptions {
  style: StyleName;
}

const applyFilter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  style: StyleName,
  imageData: ImageData
): ImageData => {
  const data = imageData.data;
  const length = data.length;

  switch (style) {
    case 'Ghibli Style':
      return applyGhibliStyle(imageData, ctx, canvas);
    case 'Pencil Sketch':
      return applyPencilSketch(imageData);
    case 'Oil Painting':
      return applyOilPainting(imageData, canvas, ctx);
    case 'Cartoon Portrait':
      return applyCartoonEffect(imageData);
    default:
      return imageData;
  }
};

const applyGhibliStyle = (
  imageData: ImageData,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): ImageData => {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness = (r + g + b) / 3;
    const saturation = 1.3;
    const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);

    data[i] = Math.min(255, r * saturation);
    data[i + 1] = Math.min(255, g * saturation);
    data[i + 2] = Math.min(255, b * saturation);
  }

  return imageData;
};

const applyPencilSketch = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  const outData = output.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = r * 0.299 + g * 0.587 + b * 0.114;

    outData[i] = gray;
    outData[i + 1] = gray;
    outData[i + 2] = gray;
  }

  for (let i = 0; i < outData.length; i += 4) {
    const pixelIndex = Math.floor(i / 4);
    if (pixelIndex % width < 1 || pixelIndex % width >= width - 1) continue;
    if (Math.floor(pixelIndex / width) < 1 || Math.floor(pixelIndex / width) >= height - 1) continue;

    const centerGray = outData[i];
    const surroundGray =
      (outData[i - 4] +
        outData[i + 4] +
        outData[i - width * 4] +
        outData[i + width * 4]) /
      4;

    const edge = centerGray - surroundGray;
    const inverted = 255 - Math.abs(edge * 2);

    outData[i] = Math.max(0, inverted);
    outData[i + 1] = Math.max(0, inverted);
    outData[i + 2] = Math.max(0, inverted);
  }

  return output;
};

const applyOilPainting = (
  imageData: ImageData,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const radius = 4;

  const output = new Uint8ClampedArray(data);

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const buckets: Record<number, number[]> = {};

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const gray = Math.floor(r * 0.299 + g * 0.587 + b * 0.114);
          const bucket = Math.floor(gray / 32);

          if (!buckets[bucket]) {
            buckets[bucket] = [];
          }
          buckets[bucket].push(idx);
        }
      }

      let maxBucket = 0;
      let maxCount = 0;
      let selectedIdx = (y * width + x) * 4;

      for (const bucket in buckets) {
        if (buckets[bucket].length > maxCount) {
          maxCount = buckets[bucket].length;
          selectedIdx = buckets[bucket][0];
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = data[selectedIdx];
      output[idx + 1] = data[selectedIdx + 1];
      output[idx + 2] = data[selectedIdx + 2];
    }
  }

  return new ImageData(output, width, height);
};

const applyCartoonEffect = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const temp = new Uint8ClampedArray(data);

  const quantize = (value: number, levels: number) => {
    return Math.floor((value / 255) * (levels - 1)) * (255 / (levels - 1));
  };

  for (let i = 0; i < data.length; i += 4) {
    temp[i] = quantize(data[i], 8);
    temp[i + 1] = quantize(data[i + 1], 8);
    temp[i + 2] = quantize(data[i + 2], 8);
  }

  for (let i = 0; i < temp.length; i += 4) {
    data[i] = temp[i];
    data[i + 1] = temp[i + 1];
    data[i + 2] = temp[i + 2];
  }

  return imageData;
};

export const transformImage = async (
  file: File,
  style: StyleName
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const transformed = applyFilter(canvas, ctx, style, imageData);
        ctx.putImageData(transformed, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
};
