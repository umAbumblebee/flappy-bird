import { trimImage } from "./trim.js";

class GameImage extends HTMLElement {
  constructor() {
    super();
    this.classList.add('bird');
    this.attachShadow({ mode: "open" });
  }
  async connectedCallback() {
    const src = this.getAttribute("src");
    const shouldTrim = this.hasAttribute("trim");

    if (!src) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await img.decode();

      let output;
      if (shouldTrim) {
         output = trimImage(img);
      } else {
        output = img;
      }

      output.style.width = '100%';
      output.style.height = '100%';
      output.style.display = 'block';
      output.setAttribute('part', 'image');

      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(output);
    } catch (err) {
      console.error("Image load/decode failed", err);
      this.shadowRoot.textContent = "Failed to load image.";
    }
  }
}

customElements.define("game-image", GameImage);