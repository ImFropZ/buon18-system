import { createWorker } from "tesseract.js";
import cv from "@techstark/opencv-js";

const patterns = [
  // ABA Bank
  /Trx\. ID:\s*(.+)/,
  /លេខកូដប្រតិបត្តិការ៖\s*(.+)/,
  // WingBank
  /Transaction ID:\s*(.+)/,
  /TID:\s*(.+)/,
  // Aceleda
  /Reference No. :\s*(.+)/,
  /Ref. \s*(.+)/,
  /លេខយោង :\s*(.+)/,
  /លេខយោង ះ\s*(.+)/,
];

const extractTrxId = (text: string): string => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1]; // Return the matched transaction ID
    }
  }

  return "";
};

const convertImageToText = async (
  selectedImage: File | null,
  setTransaction: (arg: string) => void,
) => {
  if (!selectedImage) return;

  const worker = await createWorker("eng+khm");
  const { data } = await worker.recognize(selectedImage);

  const trxId: string = extractTrxId(data.text);

  setTransaction(trxId);
};

export const scanTransactionFromImage = async (
  file: File | null,
  setTransaction: (arg: string) => void,
  setSelectedImage: (arg: File | null) => void,
  setLoading: (arg: boolean) => void,
) => {
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    // Create a canvas to draw the image
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);

    // Convert canvas to OpenCV matrix
    const src = cv.imread(canvas);
    const dst = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

    // Apply Gaussian blur to reduce noise
    cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

    // Resize the image for better OCR accuracy (upscaling)
    const dsize = new cv.Size(img.width * 2, img.height * 2);
    cv.resize(dst, dst, dsize, 0, 0, cv.INTER_CUBIC);

    // Apply adaptive thresholding to enhance contrast
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      11,
      2,
    );

    // Convert back to canvas for OCR processing
    cv.imshow(canvas, dst);

    canvas.toBlob(async (blob) => {
      if (blob) {
        // Create a File from the Blob (optional: change the filename and type as needed)
        const enhancedFile: File | null = new File(
          [blob],
          "processed-image.png",
          {
            type: "image/png",
          },
        );

        // Clean up
        src.delete();
        dst.delete();

        await convertImageToText(enhancedFile, setTransaction);
        setSelectedImage(file);
        setLoading(false);
      }
    }, "image/png");
  };
};
