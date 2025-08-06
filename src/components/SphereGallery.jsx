import React, { useEffect } from 'react';

const SphereGallery = () => {
  useEffect(() => {
    const SphereApp = () => {
      const MAX_POLAR_ROT_DEG = 3;
      const PAN_SENSITIVTY = 18;
      const TRANSITION_DUR_MS = 300;

      const DOM = {
        sphere: document.querySelector(".sphere"),
        main: document.querySelector("main"),
        items: document.querySelectorAll(".item__image"),
        frame: document.querySelector(".frame"),
        viewer: document.querySelector(".viewer"),
        scrim: document.querySelector(".scrim"),
      };

      const state = {
        rotation: { x: 0, y: 0 },
        startRotation: { x: 0, y: 0 },
        inertiaFrame: null,
        cancelTap: false,
      };

      const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

      const applyTransform = () => {
        DOM.sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${state.rotation.x}deg) rotateY(${state.rotation.y}deg)`;
      };

      const stopInertia = () => {
        if (state.inertiaFrame) {
          cancelAnimationFrame(state.inertiaFrame);
          state.inertiaFrame = null;
        }
      };

      const startInertia = (velocityX, velocityY) => {
        let vx = velocityX * 100;
        let vy = velocityY * 100;

        const friction = 0.92;
        const minVelocity = 0.1;
        const maxFrames = 120;
        let frameCount = 0;

        const step = () => {
          vx *= friction;
          vy *= friction;

          if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) {
            state.inertiaFrame = null;
            return;
          }

          const proposedX = state.rotation.x - vy / 200;

          state.rotation.x = clamp(
            proposedX,
            -MAX_POLAR_ROT_DEG,
            MAX_POLAR_ROT_DEG
          );
          state.rotation.y += vx / 200;

          applyTransform();

          frameCount++;
          if (frameCount > maxFrames) {
            state.inertiaFrame = null;
            return;
          }

          state.inertiaFrame = requestAnimationFrame(step);
        };

        stopInertia();
        state.inertiaFrame = requestAnimationFrame(step);
      };

      const setupGestures = () => {
        if (!window.Hammer) {
          console.error('Hammer.js not found. Please include it in your project.');
          return;
        }

        const hammer = new window.Hammer(DOM.main);
        hammer.get("pan").set({ direction: window.Hammer.DIRECTION_ALL });

        hammer.on("panstart", () => {
          state.cancelTap = true;
          stopInertia();
          state.startRotation.x = state.rotation.x;
          state.startRotation.y = state.rotation.y;
        });

        hammer.on("panmove", ({ deltaX, deltaY }) => {
          const proposedX = state.startRotation.x - deltaY / PAN_SENSITIVTY;

          state.rotation.y = state.startRotation.y + deltaX / PAN_SENSITIVTY;
          state.rotation.x = clamp(
            proposedX,
            -MAX_POLAR_ROT_DEG,
            MAX_POLAR_ROT_DEG
          );

          applyTransform();
        });

        hammer.on("panend", ({ velocityX, velocityY }) => {
          setTimeout(() => (state.cancelTap = false), 100);
          startInertia(velocityX, velocityY);
        });
      };

      const setupTaps = () => {
        const getTransformRotation = (el) => {
          const str = el.style.transform;
          const matchX = str.match(/rotateX\((-?\d+(\.\d+)?)deg\)/);
          const matchY = str.match(/rotateY\((-?\d+(\.\d+)?)deg\)/);

          const rotateX = matchX ? parseFloat(matchX[1]) : 0;
          const rotateY = matchY ? parseFloat(matchY[1]) : 0;

          return { rotateX, rotateY };
        };

        const getRotationXY = (el) => {
          const style = window.getComputedStyle(el);
          const transform = style.transform;

          if (!transform || transform === "none") {
            return { rotateX: 0, rotateY: 0 };
          }

          if (!transform.startsWith("matrix3d")) {
            console.warn("Transform is not 3D. rotateX/Y won't be accurate.");
            return { rotateX: 0, rotateY: 0 };
          }

          const values = transform
            .match(/matrix3d\((.+)\)/)[1]
            .split(",")
            .map(parseFloat);

          const rotateX = Math.asin(-values[9]) * (180 / Math.PI);
          const rotateY = Math.atan2(values[8], values[10]) * (180 / Math.PI);

          return { rotateX, rotateY };
        };

        const handleClickScrim = () => {
          const el = document.querySelector('[data-focused="true"]');
          const parentEl = el.parentNode;

          const referenceDiv = document.querySelector(".item__image--reference");
          referenceDiv.remove();

          const enlargedImg = document.querySelector(".enlarge");
          enlargedImg.remove();

          parentEl.style.setProperty("--rot-y-delta", `0deg`);
          parentEl.style.setProperty("--rot-x-delta", `0deg`);
          el.style.transform = ``;
          el.style.zIndex = 0;

          setTimeout(() => {
            document.body.setAttribute("data-enlarging", "false");
            el.setAttribute("data-focused", "false");
          }, TRANSITION_DUR_MS);
        };

        const handleClick = (e) => {
          if (state.cancelTap) return;

          const el = e.target;
          const parentEl = el.parentNode;

          el.setAttribute("data-focused", "true");

          const parentRotation = getRotationXY(parentEl);
          const globalRotation = getTransformRotation(DOM.sphere);

          const normalizeDegrees = (deg) => ((deg % 360) + 360) % 360;
          const parentY = normalizeDegrees(parentRotation.rotateY);
          const globalY = normalizeDegrees(globalRotation.rotateY);

          let rotY = -(parentY + globalY) % 360;
          if (rotY < -180) rotY += 360;

          parentEl.style.setProperty("--rot-y-delta", `${rotY}deg`);

          const rotX = -parentRotation.rotateX - globalRotation.rotateX;
          parentEl.style.setProperty("--rot-x-delta", `${rotX}deg`);

          const referenceDiv = document.createElement("div");
          parentEl.appendChild(referenceDiv);
          referenceDiv.style.opacity = 0;
          referenceDiv.classList.add("item__image", "item__image--reference");
          referenceDiv.style.transform = `rotateX(${-parentRotation.rotateX}deg) rotateY(${-parentRotation.rotateY}deg)`;

          const sourceRect = referenceDiv.getBoundingClientRect();
          const targetRect = DOM.frame.getBoundingClientRect();
          const deltaScaleX = targetRect.width / sourceRect.width;
          const deltaScaleY = targetRect.height / sourceRect.height;
          const deltaScale = Math.min(deltaScaleX, deltaScaleY);

          el.style.transform = `scale(${deltaScale}) translateZ(30px)`;
          el.style.zIndex = 3;

          const img = document.createElement("img");
          const newSrc = `${parentEl.getAttribute("data-src")}`;
          img.src = newSrc;

          img.addEventListener("load", () => {
            const newSrc = `https://images.unsplash.com${parentEl
              .getAttribute("data-src")
              .replace(".jpg", "")
              .replace("https://assets.codepen.io/215059", "")}?w=1200&h=1200&fit=crop`;
            img.src = newSrc;
          });

          DOM.scrim.addEventListener("click", handleClickScrim, { once: true });

          setTimeout(() => {
            const renderedRect = el.getBoundingClientRect();
            const enlargementEl = document.createElement("div");

            Object.assign(enlargementEl.style, {
              top: renderedRect.top - DOM.main.getBoundingClientRect().top + "px",
              left: renderedRect.left + "px",
              width: renderedRect.width + "px",
              height: renderedRect.height + "px",
              opacity: 0,
            });

            setTimeout(() => {
              enlargementEl.style.opacity = 1;
              document.body.setAttribute("data-enlarging", "true");
            }, TRANSITION_DUR_MS);

            enlargementEl.classList.add("enlarge");
            enlargementEl.appendChild(img);
            DOM.viewer.appendChild(enlargementEl);
          }, TRANSITION_DUR_MS);
        };

        DOM.items.forEach((el) => el.addEventListener("click", handleClick));
      };

      const init = () => {
        setupGestures();
        setupTaps();
      };

      return { init };
    };

    // Initialize the sphere when component mounts
    const sphereApp = SphereApp();
    sphereApp.init();

    // Cleanup function
    return () => {
      // Clean up any event listeners or animations if needed
    };
  }, []);

  const images = [
    // Bald men with different hairstyles and hair pieces
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    // Hair styling tools and products
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    // Hair salon and barber shop images
    "https://images.unsplash.com/photo-1521849243351-59b3b7fb0c78?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    // Different hairstyles and hair textures
    "https://images.unsplash.com/photo-1570158268183-d296b2892211?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1548783307-f63adc3f200b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1587653263995-422546a7a569?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1447871622716-5dc761437456?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop"
  ];

  const generateSphereItems = () => {
    const items = [];
    const radius = 18; // Half of 37 segments
    
    for (let x = -radius; x <= radius; x += 2) {
      for (let y = -6; y <= 6; y += 2) {
        const imageIndex = Math.abs((x + y) * 3) % images.length;
        items.push(
          <div 
            key={`${x},${y}`}
            className="item" 
            data-src={images[imageIndex]} 
            data-item={`${x},${y}`} 
            data-item-size="2,2"
          >
            <div className="item__image">
              <img src={images[imageIndex]} alt="" draggable="false" />
            </div>
          </div>
        );
      }
    }
    
    return items;
  };

  return (
    <>
      <style>{`
        :root {
          --radius: max(1300px, 100vw);
          --circ: calc(var(--radius) * 3.14);
          --segments-x: 37;
          --segments-y: 37;
          --sphere-rotation-y: 0;
          --sphere-rotation-x: 0;
          --offset-x: 0;
          --offset-y: 0;
          --rot-y: calc((360deg / var(--segments-x)) / 2);
          --rot-x: calc((360deg / var(--segments-y)) / 2);
          --rot-y-delta: 0deg;
          --item-width: calc((var(--circ) / var(--segments-x)));
          --item-height: calc((var(--circ) / var(--segments-y)));
          --item-size-x: 1;
          --item-size-y: 1;
          --gradient: radial-gradient(
            var(--gradient-center) 50%,
            var(--gradient-edge) 90%
          );
          --gradient-blur: radial-gradient(
            var(--gradient-center) 70%,
            var(--gradient-edge) 90%
          );
          --bg-scrim: rgba(0, 0, 0, 0.6);
          --bg: rgb(235, 235, 235);
          --item-bg: rgb(225, 225, 225);
          --gradient-center: rgba(235, 235, 235, 0);
          --gradient-edge: rgba(235, 235, 235, 0.5);
          --bg-scrim: rgba(0, 0, 0, 0.4);
          --gradient: radial-gradient(
            var(--gradient-center) 65%,
            var(--gradient-edge) 100%
          );
        }

        .sphere-gallery * {
          box-sizing: border-box;
        }

        .sphere-gallery {
          display: flex;
          width: 100%;
          height: 100vh;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          touch-action: none;
          background-color: var(--bg);
        }

        .sphere-gallery * {
          touch-action: none;
        }

        .stage {
          perspective: calc(var(--radius) * 2);
        }

        .sphere {
          transform: translateZ(calc(var(--radius) * -1))
            rotateY(var(--sphere-rotation-y)) rotateX(var(--sphere-rotation-x));
          transform-style: preserve-3d;
        }

        .overlay {
          background-image: var(--gradient);
          position: fixed;
          inset: 0;
          margin: auto;
          z-index: 3;
          content: "";
          pointer-events: none;
          opacity: 1;
        }

        .overlay--blur {
          mask-image: var(--gradient-blur);
          backdrop-filter: blur(3px);
          position: fixed;
          inset: 0;
          margin: auto;
          z-index: 3;
          opacity: 1;
          content: "";
          pointer-events: none;
        }

        .item {
          width: calc(var(--item-width) * var(--item-size-x));
          height: calc(var(--item-height) * var(--item-size-y));
          position: absolute;
          transform-origin: 50% 50%;
          top: -999px;
          bottom: -999px;
          left: -999px;
          right: -999px;
          margin: auto;
          backface-visibility: hidden;
          color: transparent;
          transform-style: preserve-3d;
          transition: transform 300ms;
          transform: rotateY(
              calc(
                var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) +
                  var(--rot-y-delta, 0deg)
              )
            )
            rotateX(
              calc(
                calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2))) +
                  var(--rot-x-delta, 0deg)
              )
            )
            translateZ(var(--radius));
        }

        .item__image {
          transition: transform 300ms;
          position: absolute;
          display: block;
          inset: 10px;
          border-radius: 12px;
          background-color: var(--item-bg);
          overflow: hidden;
          backface-visibility: hidden;
        }

        .item__image img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          pointer-events: none;
          backface-visibility: hidden;
        }

        * {
          transform-style: preserve-3d;
        }

        .viewer {
          position: absolute;
          inset: 0;
          z-index: 9;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px;
        }

        .viewer .frame {
          height: 100%;
          aspect-ratio: 1;
          border-radius: 32px;
          display: flex;
        }

        .viewer .enlarge {
          position: absolute;
          z-index: 1;
          border-radius: 32px;
          overflow: hidden;
          transition: opacity 300ms;
        }

        .viewer .enlarge img {
          width: 100%;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .viewer .scrim {
          position: absolute;
          inset: 0;
          background-color: var(--bg-scrim);
          pointer-events: none;
          opacity: 0;
          transition: opacity 300ms;
          backdrop-filter: blur(3px);
        }

        [data-enlarging="true"] .scrim {
          opacity: 1;
          pointer-events: all;
        }

        @media (max-aspect-ratio: 1/1) {
          .viewer .frame {
            height: auto;
            width: 100%;
          }
        }

        ${(() => {
          let styles = '';
          for (let x = -50; x <= 50; x++) {
            for (let y = -50; y <= 50; y++) {
              styles += `.item[data-item="${x},${y}"] { --offset-x: ${x}; --offset-y: ${y}; }`;
            }
          }
          for (let x = 1; x <= 4; x++) {
            for (let y = 1; y <= 4; y++) {
              styles += `.item[data-item-size="${x},${y}"] { --item-size-x: ${x}; --item-size-y: ${y}; }`;
            }
          }
          return styles;
        })()}
      `}</style>
      
      <main className="sphere-gallery">
        <div className="stage">
          <div className="sphere">
            {generateSphereItems()}
          </div>
        </div>
        
        <div className="overlay"></div>
        <div className="overlay overlay--blur"></div>
        
        <div className="viewer">
          <div className="scrim"></div>
          <div className="frame">
            <div className="enlarged"></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SphereGallery;