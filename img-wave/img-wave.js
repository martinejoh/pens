(function () {
  "use strict";

  const gsapWaveHover = {
    init() {
      const container = document.querySelector(".gsap-img-wave");
      if (!container) return;

      const imgEls = container.querySelectorAll("img");
      if (imgEls.length < 2 || container.dataset.gsapInit) return;
      container.dataset.gsapInit = true;

      container.style.position = "relative";
      container.style.overflow = "hidden";

      imgEls.forEach((img, i) => {
        Object.assign(img.style, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: i === 0 ? 1 : 0.3,
          zIndex: i,
        });
      });

      this.injectSVG(imgEls);
      this.animate(imgEls);
    },

    injectSVG(images) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      svg.style.position = "absolute";

      let filters = "";

      images.forEach((img, i) => {
        const filterId = `wave-filter-${i}`;
        const seed = Math.floor(Math.random() * 999);
        const baseFreq = (0.01 + Math.random() * 0.02).toFixed(3);
        const scale = (15 + Math.random() * 10).toFixed(1);

        filters += `
          <filter id="${filterId}">
            <feTurbulence id="turbulence-${i}" type="turbulence" baseFrequency="${baseFreq}" numOctaves="1.5" seed="${seed}" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        `;

        img.style.filter = `url(#${filterId})`;
        img.style.transformOrigin = "center center";
      });

      svg.innerHTML = `<defs>${filters}</defs>`;
      document.body.appendChild(svg);
    },

    animate(images) {
      images.forEach((img, i) => {
        const turb = document.querySelector(`#turbulence-${i}`);
        const freq = { x: 0.015 + Math.random() * 0.015, y: 0.015 };

        gsap
          .timeline({ repeat: -1, yoyo: true, delay: i * 0.3 })
          .to(freq, {
            x: freq.x + 0.01,
            duration: 5 + Math.random() * 2,
            ease: "sine.inOut",
            onUpdate: () =>
              turb.setAttribute(
                "baseFrequency",
                `${freq.x.toFixed(4)} ${freq.y}`
              ),
          })
          .to(freq, {
            x: freq.x - 0.008,
            duration: 5,
            ease: "sine.inOut",
            onUpdate: () =>
              turb.setAttribute(
                "baseFrequency",
                `${freq.x.toFixed(4)} ${freq.y}`
              ),
          });
      });

      let current = 0;
      const total = images.length;

      const loop = () => {
        const curr = images[current % total];
        const next = images[(current + 1) % total];

        images.forEach((img, i) => {
          img.style.zIndex =
            i === (current + 1) % total ? 2 : i === current % total ? 1 : 0;
        });

        const fadeOutTo = 0.3 + Math.random() * 0.1;
        const fadeInTo = 0.9 + Math.random() * 0.1;

        gsap.to(curr, { opacity: fadeOutTo, duration: 4, ease: "sine.inOut" });
        gsap.to(next, { opacity: fadeInTo, duration: 4, ease: "sine.inOut" });

        gsap.to(curr, {
          scale: 1.002,
          duration: 6,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(next, {
          scale: 1.01,
          duration: 6,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        });

        current = (current + 1) % total;
        setTimeout(loop, 8000);
      };

      loop();
    },
  };

  window.addEventListener("DOMContentLoaded", () => {
    gsapWaveHover.init();
  });
})();
