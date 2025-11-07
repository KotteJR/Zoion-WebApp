'use client';

import { useEffect } from 'react';

export default function AnimatedBackground() {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;

    // Helper function to create paw SVG
    function createPawSVG(color: string): string {
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      const r = rgbMatch ? rgbMatch[1] : '0';
      const g = rgbMatch ? rgbMatch[2] : '100';
      const b = rgbMatch ? rgbMatch[3] : '60';
      const rgbColor = `rgb(${r},${g},${b})`;
      
      return encodeURIComponent(`
        <svg width="118" height="97" viewBox="0 0 118 97" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_184_12021" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="118" height="97">
            <path d="M117.062 0.603027H0.938965V96.861H117.062V0.603027Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_184_12021)">
            <path d="M62.06 92.071C66.7306 95.5735 72.5193 97.2504 78.339 96.7868C84.1586 96.3232 89.6088 93.7509 93.666 89.553C98.0185 84.9548 100.397 78.8346 100.291 72.504C100.185 66.1734 97.6037 60.1361 93.1 55.686L77.1 39.686C74.7887 37.3747 72.0448 35.5413 69.025 34.2904C66.0052 33.0396 62.7686 32.3958 59.5 32.3958C56.2313 32.3958 52.9947 33.0396 49.9749 34.2904C46.9551 35.5413 44.2112 37.3747 41.9 39.686L25.9 55.686C21.3965 60.1363 18.8152 66.1735 18.7094 72.504C18.6036 78.8346 20.9817 84.9547 25.334 89.553C29.3913 93.7507 34.8414 96.3228 40.661 96.7865C46.4806 97.2501 52.2692 95.5733 56.94 92.071C57.6774 91.5126 58.577 91.2104 59.502 91.2104C60.4269 91.2104 61.3266 91.5126 62.064 92.071" fill="${rgbColor}"/>
            <path d="M20.919 24.7561C26.775 29.6411 28.31 37.4561 24.346 42.2031C20.382 46.9501 12.423 46.8461 6.56702 41.9611C0.711015 37.0761 -0.822984 29.2651 3.13902 24.5131C7.10102 19.7611 15.062 19.8701 20.918 24.7551" fill="${rgbColor}"/>
            <path d="M52.6139 11.3021C54.8609 18.5891 51.8909 25.9751 45.9779 27.8021C40.0649 29.6291 33.4509 25.1961 31.2029 17.9091C28.9549 10.6221 31.9259 3.23605 37.8389 1.40905C43.7519 -0.417949 50.3669 4.01805 52.6139 11.3021Z" fill="${rgbColor}"/>
            <path d="M86.5172 17.3031C84.4302 24.6381 77.9172 29.2111 71.9632 27.5171C66.0092 25.8231 62.8802 18.5051 64.9632 11.1701C67.0462 3.83505 73.5712 -0.736946 79.5222 0.956054C85.4732 2.64905 88.6052 9.96805 86.5222 17.3031" fill="${rgbColor}"/>
            <path d="M111.675 40.8091C105.927 45.8211 97.9748 46.1091 93.9048 41.4411C89.8348 36.7731 91.2048 28.9341 96.9498 23.9221C102.695 18.9101 110.65 18.6271 114.719 23.2911C118.788 27.9551 117.419 35.7971 111.675 40.8091Z" fill="${rgbColor}"/>
          </g>
        </svg>
      `);
    }

    // Throttle particle creation to prevent jittery resizing
    let lastParticleTime = 0;
    const throttleDelay = 40; // Create max 1 particle every 40ms for more particles
    
    // Track previous mouse position to determine movement direction
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isFirstMove = true;

    // Mouse interaction - only create particles when cursor is moving
    const handleMouseMove = (e: MouseEvent) => {
      if (!particlesContainer) return;

      // Throttle particle creation
      const now = Date.now();
      if (now - lastParticleTime < throttleDelay) return;
      lastParticleTime = now;

      // Current mouse position
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;
      
      // Calculate movement direction (only if not first move)
      let directionX = 0;
      let directionY = 0;
      if (!isFirstMove) {
        directionX = mouseX - lastMouseX;
        directionY = mouseY - lastMouseY;
        // Normalize direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        if (magnitude > 0) {
          directionX = directionX / magnitude;
          directionY = directionY / magnitude;
        }
      } else {
        isFirstMove = false;
      }
      
      // Update last position
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      
      // Spawn behind cursor in movement direction (closer together but not same place)
      const behindDistance = 0.5; // 0.5% behind cursor
      const randomOffset = 0.8; // Random offset (0.8% radius) - close but varied
      const spawnX = mouseX - (directionX * behindDistance) + (Math.random() * randomOffset * 2 - randomOffset);
      const spawnY = mouseY - (directionY * behindDistance) + (Math.random() * randomOffset * 2 - randomOffset);

      // Random color - vibrant dark green only
      const colors = [
        'rgba(0, 100, 60, 0.4)',
        'rgba(0, 110, 65, 0.38)',
        'rgba(0, 120, 70, 0.35)',
        'rgba(0, 90, 55, 0.42)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = color.match(/[\d.]+\)$/)?.[0]?.replace(')', '') || '0.4';
      
      // Create paw SVG
      const svgData = createPawSVG(color);

      // Create temporary particle
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Fixed size for paw icon to prevent jittery resizing
      const size = 15; // Fixed 15px size for smooth appearance
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundImage = `url("data:image/svg+xml,${svgData}")`;
      particle.style.backgroundSize = 'contain';
      particle.style.backgroundRepeat = 'no-repeat';
      particle.style.backgroundPosition = 'center';
      particle.style.opacity = '0.15'; // Start invisible for smooth fade-in

      // Position at mouse with random offset
      particle.style.left = `${spawnX}%`;
      particle.style.top = `${spawnY}%`;

      particlesContainer.appendChild(particle);

      // Fade in smoothly first (fast but not instant)
      requestAnimationFrame(() => {
        particle.style.transition = 'opacity 1s ease-out';
        particle.style.opacity = opacity;
        
        // Then animate outward after fade-in (faster spread)
        setTimeout(() => {
          particle.style.transition = 'all 2s ease-out';
          particle.style.left = `${spawnX + (Math.random() * 10 - 5)}%`;
          particle.style.top = `${spawnY + (Math.random() * 10 - 5)}%`;
          particle.style.opacity = '0';

          // Remove after animation
          setTimeout(() => {
            particle.remove();
          }, 1000);
        }, 100); // Wait for fade-in to complete (faster)
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
}

