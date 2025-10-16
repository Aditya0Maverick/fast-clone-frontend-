// script.js
const startBtn = document.getElementById("start");
const speedValue = document.getElementById("speedValue"); // circle number
const statusText = document.getElementById("statusText");
const downloadText = document.getElementById("downloadText");
const uploadText = document.getElementById("uploadText");
const circle = document.querySelector(".circle");

// Your deployed backend URL
const BACKEND_URL = "https://fast-clone-production.up.railway.app";

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  circle.classList.add("active");

  // reset UI
  speedValue.textContent = "0";
  downloadText.textContent = "Download: 0 Mbps";
  uploadText.textContent = "Upload: 0 Mbps";

  // DOWNLOAD TEST
  statusText.textContent = "Testing download speed...";
  const downloadSpeed = await testDownloadSpeed();
  downloadText.textContent = `Download: ${downloadSpeed} Mbps`;
  await animateSpeedDisplay(downloadSpeed, speedValue);

  // small pause before upload
  await delay(500);
  await animateSpeedDisplay(0, speedValue);

  // UPLOAD TEST
  statusText.textContent = "Testing upload speed...";
  const uploadSpeed = await testUploadSpeed();
  uploadText.textContent = `Upload: ${uploadSpeed} Mbps`;
  await animateSpeedDisplay(uploadSpeed, speedValue);

  // done
  statusText.textContent = "Test complete ✅";
  circle.classList.remove("active");
  startBtn.disabled = false;
});

// ----------------- DOWNLOAD -----------------
async function testDownloadSpeed() {
  try {
    const fileUrl = `${BACKEND_URL}/testfile`;
    const startTime = performance.now();
    const response = await fetch(fileUrl + "?cache=" + Math.random());
    const blob = await response.blob();
    const endTime = performance.now();

    const fileSizeInBytes = blob.size;
    const duration = (endTime - startTime) / 1000; // in seconds
    const bitsLoaded = fileSizeInBytes * 8;
    const speedMbps = bitsLoaded / duration / 1024 / 1024;

    console.log("Downloaded:", blob.size, "bytes");
    console.log("Duration:", duration.toFixed(2), "s");
    console.log("Speed:", speedMbps.toFixed(2), "Mbps");

    return Number(speedMbps.toFixed(2));
  } catch (err) {
    console.error("Download test failed:", err);
    return 0;
  }
}

// ----------------- UPLOAD -----------------


// ----------------- ANIMATION -----------------
function animateSpeedDisplay(targetSpeed, element) {
  return new Promise((resolve) => {
    const currentVal = parseFloat(element.textContent) || 0;
    const steps = 45;
    const step = (targetSpeed - currentVal) / steps;
    let i = 0;

    if (Math.abs(targetSpeed - currentVal) < 0.05) {
      element.textContent = targetSpeed.toFixed(1);
      resolve();
      return;
    }

    const iv = setInterval(() => {
      i++;
      const v = currentVal + step * i;
      element.textContent = Math.max(0, v).toFixed(1);

      if (i >= steps) {
        clearInterval(iv);
        element.textContent = targetSpeed.toFixed(1);
        resolve();
      }
    }, 18);
  });
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
// ----------------- END -----------------