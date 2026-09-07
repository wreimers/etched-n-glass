(() => {
  const tabs = [...document.querySelectorAll("[data-gallery-tab]")];
  const panels = [...document.querySelectorAll("[data-gallery-panel]")];
  const heading = document.querySelector("#work-heading");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeCategory = "drinkware";
  let transitionTimer = null;

  if (tabs.length === 0 || panels.length === 0) return;

  const headings = {
    drinkware: "Pieces made personal.",
    "custom-etching": "Made to hold a memory."
  };

  const selectCategory = (category, focusTab = false) => {
    if (category === activeCategory) {
      if (focusTab) tabs.find((tab) => tab.dataset.galleryTab === category)?.focus();
      return;
    }

    const nextPanel = panels.find((panel) => panel.dataset.galleryPanel === category);
    const currentPanel = panels.find((panel) => panel.dataset.galleryPanel === activeCategory);
    if (!nextPanel) return;

    window.clearTimeout(transitionTimer);
    currentPanel?.classList.remove("is-active");

    const reveal = () => {
      panels.forEach((panel) => {
        panel.hidden = panel !== nextPanel;
      });
      requestAnimationFrame(() => nextPanel.classList.add("is-active"));
    };

    if (reduceMotion.matches) reveal();
    else transitionTimer = window.setTimeout(reveal, 180);

    activeCategory = category;
    tabs.forEach((tab) => {
      const selected = tab.dataset.galleryTab === category;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    if (heading) heading.textContent = headings[category] || headings.drinkware;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCategory(tab.dataset.galleryTab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
      selectCategory(nextTab.dataset.galleryTab, true);
    });
  });

})();

(() => {
  const dialog = document.querySelector(".lightbox");
  const allItems = [...document.querySelectorAll("[data-lightbox-item]")];

  if (!dialog || allItems.length === 0) return;

  const fullImage = dialog.querySelector(".lightbox-image");
  const caption = dialog.querySelector(".lightbox-caption");
  const closeButton = dialog.querySelector(".lightbox-close");
  const previousButton = dialog.querySelector(".lightbox-prev");
  const nextButton = dialog.querySelector(".lightbox-next");
  let currentIndex = 0;
  let items = [];
  let opener = null;

  const visibleItems = () => allItems.filter((item) => !item.closest("[data-gallery-panel]")?.hidden);

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
    items = visibleItems();
    showImage(index);
    dialog.showModal();
    closeButton.focus();
  };

  allItems.forEach((item) => {
    item.addEventListener("click", () => {
      const activeItems = visibleItems();
      openLightbox(item, activeItems.indexOf(item));
    });
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
