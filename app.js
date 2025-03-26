// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// DOM Elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const originalPriceElement = document.getElementById("originalPrice");
const translatedPriceElement = document.getElementById("translatedPrice");

// CHARLESTON cipher mapping
const CHARLESTON_MAP = {
  C: "0",
  H: "1",
  A: "2",
  R: "3",
  L: "4",
  E: "5",
  S: "6",
  T: "7",
  O: "8",
  N: "9",
};

// Initialize camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Error accessing camera. Please make sure you have granted camera permissions.");
  }
}

// Capture image from video
function captureImage() {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
}

// Extract price from text
function extractPrice(text) {
  // Look for price patterns like $XX.XX or XX.XX
  const priceRegex = /\$?\d+\.\d{2}/;
  const match = text.match(priceRegex);
  return match ? match[0] : null;
}

// Translate price using CHARLESTON cipher
function translatePrice(price) {
  if (!price) return null;

  // Remove $ symbol if present
  price = price.replace("$", "");

  // Convert each digit to its CHARLESTON equivalent
  const translated = price
    .split("")
    .map((digit) => {
      const char = Object.keys(CHARLESTON_MAP).find((key) => CHARLESTON_MAP[key] === digit);
      return char || digit;
    })
    .join("");

  return translated;
}

// Process image with Tesseract OCR
async function processImage(imageData) {
  try {
    const result = await Tesseract.recognize(imageData, "eng");
    const price = extractPrice(result.data.text);

    if (price) {
      originalPriceElement.textContent = price;
      const translated = translatePrice(price);
      translatedPriceElement.textContent = translated;
    } else {
      originalPriceElement.textContent = "No price found";
      translatedPriceElement.textContent = "-";
    }
  } catch (err) {
    console.error("Error processing image:", err);
    originalPriceElement.textContent = "Error processing image";
    translatedPriceElement.textContent = "-";
  }
}

// Event Listeners
captureBtn.addEventListener("click", async () => {
  const imageData = captureImage();
  await processImage(imageData);
});

// Initialize camera when the page loads
initCamera();
