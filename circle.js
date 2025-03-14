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

    // Create new timeline
    currentAnimation = gsap.timeline()
      // First phase: fade out content blocks and fade in all labels except active
      .to(contentBlocks, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut"
      })
      .to(rotateLabels, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<") // Start at same time as previous animation
      // Second phase: fade in active content and fade out active label
      .to(contentBlocks[activeIndex], {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.inOut"
      })
      .to(rotateLabels[activeIndex], {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<"); // Start at same time as previous animation
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
      rotate: "360deg",
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
      rotate: "-360deg",  // Rotate opposite to the circle
      transformOrigin: "center center",
      ease: "none"
    }
  );
});
