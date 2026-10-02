(function () {
  const config = window.UPTOBER || {};
  const ca = (config.ca || "").trim();
  const pair = (config.pair || "").trim();

  const caText = document.getElementById("ca-text");
  const copyButton = document.getElementById("copy-ca");
  const toast = document.getElementById("toast");
  const chartFrame = document.getElementById("chart-frame");
  const chartLink = document.getElementById("chart-link");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  function isAddress(value) {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  }

  if (caText) {
    caText.textContent = ca || "Soon on Base";
    if (ca) caText.classList.add("is-live");
  }

  const chartAddress = isAddress(pair) ? pair : isAddress(ca) ? ca : "";

  if (chartAddress && chartFrame) {
    const params = new URLSearchParams({
      embed: "1",
      loadChartSettings: "0",
      trades: "0",
      info: "0",
      chartLeftToolbar: "0",
      chartDefaultOnMobile: "1",
      chartTheme: "dark",
      theme: "dark",
      chartStyle: "1",
      chartType: "usd",
      interval: "15",
    });
    const src = "https://dexscreener.com/base/" + chartAddress + "?" + params.toString();
    const iframe = document.createElement("iframe");
    iframe.title = "UPTOBER Dexscreener chart";
    iframe.src = src;
    iframe.loading = "lazy";
    iframe.allow = "clipboard-write";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    chartFrame.replaceChildren(iframe);
    if (chartLink) chartLink.href = "https://dexscreener.com/base/" + chartAddress;
  }

  let toastTimer = 0;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  if (copyButton) {
    copyButton.addEventListener("click", async function () {
      if (!ca) {
        showToast("CA isn't lit yet");
        return;
      }
      try {
        await navigator.clipboard.writeText(ca);
        showToast("CA copied");
        var label = copyButton.querySelector(".copy-label");
        if (label) label.textContent = "Copied";
        copyButton.classList.add("copied");
        window.setTimeout(function () {
          copyButton.classList.remove("copied");
          if (label) label.textContent = "Copy CA";
        }, 1200);
      } catch (error) {
        showToast("Copy blocked by the browser");
      }
    });
  }

  const dialog = document.getElementById("lightbox");
  const dialogImage = document.getElementById("lightbox-img");
  document.querySelectorAll("[data-meme]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!dialog || !dialogImage) return;
      const img = button.querySelector("img");
      dialogImage.src = img ? img.src : "";
      dialogImage.alt = img ? img.alt : "";
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });
  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }
})();
