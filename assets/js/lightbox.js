(() => {
  const dialog = document.querySelector(".lightbox");
  const items = [...document.querySelectorAll("[data-lightbox-item]")];

  if (!dialog || items.length === 0) return;

  const fullImage = dialog.querySelector(".lightbox-image");
  const caption = dialog.querySelector(".lightbox-caption");
  const closeButton = dialog.querySelector(".lightbox-close");
  const previousButton = dialog.querySelector(".lightbox-prev");
  const nextButton = dialog.querySelector(".lightbox-next");
  let currentIndex = 0;
  let opener = null;

  const showImage = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const image = item.querySelector("img");
    const title = item.querySelector(".work-title");

    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt;
    caption.textContent = title?.textContent || image.alt;
  };

  const openLightbox = (item, index) => {
    opener = item;
    showImage(index);
    dialog.showModal();
    closeButton.focus();
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(item, index));
  });

  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  dialog.addEventListener("close", () => {
    fullImage.src = "";
    opener?.focus();
  });
})();
