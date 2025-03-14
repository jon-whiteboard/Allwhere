document.addEventListener('DOMContentLoaded', () => {
  // Get all the trigger elements and content blocks
  const triggerElements = document.querySelectorAll('.rotate-scroll-target');
  const contentBlocks = document.querySelectorAll('.rotate-section-content-block');
  const rotateLabels = document.querySelectorAll('.rotate-icon .rotate-label');
  
  // Create a timeline reference
  let currentAnimation = null;

  // Hide all content blocks and labels initially except the first ones
  gsap.set(contentBlocks, { autoAlpha: 0 });
  gsap.set(rotateLabels, { autoAlpha: 0 });
  gsap.set(contentBlocks[0], { autoAlpha: 1 });
  gsap.set(rotateLabels[0], { autoAlpha: 1 });

  // Create ScrollTrigger for each trigger element
  triggerElements.forEach((trigger, index) => {
    ScrollTrigger.create({
      trigger: trigger,
      start: "top 50%",
      end: "bottom 50%",
      // markers: true,
      onEnter: () => updateContent(index),
      onEnterBack: () => updateContent(index),
      toggleActions: "play none none reverse"
    });
  });

  // Function to update content visibility
  function updateContent(activeIndex) {
    // Skip animation if the target content is already visible
    if (gsap.getProperty(contentBlocks[activeIndex], "autoAlpha") === 1) {
      return;
    }

    // Kill any running animation
    if (currentAnimation) {
      currentAnimation.kill();
    }

    const isLastSection = activeIndex === triggerElements.length - 1;
    const wasLastSection = gsap.getProperty(contentBlocks[triggerElements.length - 1], "autoAlpha") === 1;

    // Create new timeline
    currentAnimation = gsap.timeline()
      // First phase: fade out content blocks and handle header
      .to([contentBlocks, isLastSection || wasLastSection ? rotateHeader : null], {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut"
      })
      .to(rotateLabels, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<")
      // Second phase: fade in active content and restore header if needed
      .to(contentBlocks[activeIndex], {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.inOut"
      })
      .to(rotateLabels[activeIndex], {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<")
      .to(rotateHeader, {
        autoAlpha: !isLastSection ? 1 : 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<");
  }

  // Add rotation animation for the entire section
  const rotateSection = document.querySelector('.rotate-section');
  const rotateCircle = document.querySelector('.rotate-circle');
  const rotateIcons = document.querySelectorAll('.rotate-icon');
  
  // Main circle rotation
  gsap.fromTo(rotateCircle, 
    { rotate: "-50deg" },
    {
      scrollTrigger: {
        trigger: rotateSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true,
      },
      rotate: "500deg",
      transformOrigin: "center center",
      ease: "none"
    }
  );

  // Counter-rotate the icons
  gsap.fromTo(rotateIcons,
    { rotate: "50deg" },  // Start at opposite of circle's start
    {
      scrollTrigger: {
        trigger: rotateSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      rotate: "-500deg",  // Rotate opposite to the circle
      transformOrigin: "center center",
      ease: "none"
    }
  );

  // Add scale and move animation for the last section
  const lastTarget = triggerElements[triggerElements.length - 1];
  const rotateHeader = document.querySelector('.rotate-section-header');
  
  // Calculate scale factor to achieve 80vh max-height
  const circleHeight = rotateCircle.offsetHeight;
  const windowHeight = window.innerHeight;
  const targetHeight = windowHeight * 0.8; // 80vh
  const scaleTarget = targetHeight / circleHeight;
  
  // Circle scale and move animation with counter-scaling icons
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: lastTarget,
      start: "top 80%",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    }
  });

  tl.to(rotateCircle, {
    scale: scaleTarget,
    y: "-50rem",
    ease: "none"
  })
  .to(rotateIcons, {
    scale: 1/scaleTarget, // Inverse scale to counter the circle's scale
    ease: "none"
  }, "<"); // Start at the same time as circle animation
});
