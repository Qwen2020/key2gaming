// Stagger animatons.
gsap.utils.toArray('[gsap="stagger-children"]').forEach((section, index) => {
  gsap.from(section.querySelectorAll(':scope > *'), {
    opacity: 0,
    y: 50,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
    },
    stagger: 0.1,
  });
});
