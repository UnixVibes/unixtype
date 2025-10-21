import gsap from 'gsap';

/**
 * GSAP Animation Utilities for UnixType
 * High-performance animations for typing test interactions
 */

// ============================================
// PHASE 1: CORE INTERACTIONS
// ============================================

/**
 * Word completion celebration with physics-based particles
 */
export const celebrateWordCompletion = (wordElement: HTMLElement) => {
  const tl = gsap.timeline();

  // Word scale bounce
  tl.to(wordElement, {
    scale: 1.15,
    duration: 0.15,
    ease: 'power2.out'
  })
  .to(wordElement, {
    scale: 1,
    duration: 0.25,
    ease: 'elastic.out(1, 0.3)'
  });

  return tl;
};

/**
 * Create exploding particles for word completion
 */
export const createWordParticles = (x: number, y: number, container: HTMLElement) => {
  const particleCount = 8;
  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute w-2 h-2 rounded-full bg-unix-main';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.pointerEvents = 'none';
    container.appendChild(particle);
    particles.push(particle);

    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 50 + Math.random() * 30;

    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20, // slight upward bias
      opacity: 0,
      scale: 0,
      duration: 0.6 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => {
        particle.remove();
      }
    });
  }
};

/**
 * Error shake animation with red flash
 */
export const shakeOnError = (element: HTMLElement) => {
  const tl = gsap.timeline();

  // Violent shake
  tl.to(element, {
    x: -8,
    duration: 0.05,
    ease: 'power2.inOut'
  })
  .to(element, {
    x: 8,
    duration: 0.05,
    ease: 'power2.inOut',
    repeat: 3,
    yoyo: true
  })
  .to(element, {
    x: 0,
    duration: 0.1
  });

  // Red flash overlay
  gsap.to(element, {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut'
  });

  return tl;
};

/**
 * Personal best breaking celebration with screen flash and confetti
 */
export const celebrateNewRecord = (container: HTMLElement) => {
  // Create screen flash overlay
  const flash = document.createElement('div');
  flash.className = 'fixed inset-0 pointer-events-none z-50';
  flash.style.backgroundColor = 'rgba(20, 184, 166, 0)';
  document.body.appendChild(flash);

  // Flash animation
  gsap.timeline()
    .to(flash, {
      backgroundColor: 'rgba(20, 184, 166, 0.3)',
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(flash, {
      backgroundColor: 'rgba(20, 184, 166, 0)',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => flash.remove()
    });

  // Confetti explosion
  createConfetti(container);
};

/**
 * Create confetti particles that fall from top
 */
export const createConfetti = (container: HTMLElement) => {
  const confettiCount = 50;
  const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'absolute w-2 h-2 rounded-sm';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-20px';
    confetti.style.pointerEvents = 'none';
    container.appendChild(confetti);

    gsap.to(confetti, {
      y: window.innerHeight + 100,
      x: `+=${Math.random() * 200 - 100}`,
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      duration: 2 + Math.random() * 1.5,
      ease: 'power1.in',
      onComplete: () => confetti.remove()
    });
  }
};

// ============================================
// PHASE 2: ENHANCED FEEDBACK
// ============================================

/**
 * Combo multiplier charge-up pulse animation
 */
export const pulseComboMultiplier = (element: HTMLElement, intensity: number = 1) => {
  // Kill any existing animations on this element
  gsap.killTweensOf(element);

  const tl = gsap.timeline({ repeat: -1 });

  const maxGlow = 20 + (intensity * 20);

  tl.to(element, {
    boxShadow: `0 0 ${maxGlow}px rgba(20, 184, 166, 0.6)`,
    scale: 1.03,
    duration: 0.6,
    ease: 'power2.inOut'
  })
  .to(element, {
    boxShadow: `0 0 ${maxGlow * 2}px rgba(20, 184, 166, 0.9)`,
    scale: 1.06,
    duration: 0.6,
    ease: 'power2.inOut'
  })
  .to(element, {
    boxShadow: `0 0 ${maxGlow}px rgba(20, 184, 166, 0.6)`,
    scale: 1.03,
    duration: 0.6,
    ease: 'power2.inOut'
  });

  return tl;
};

/**
 * Stop combo pulse animation
 */
export const stopComboPulse = (element: HTMLElement) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    boxShadow: '0 0 0px rgba(20, 184, 166, 0)',
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
};

/**
 * Streak milestone fireworks burst
 */
export const createStreakFireworks = (x: number, y: number, container: HTMLElement) => {
  const particleCount = 30;
  const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#fbbf24'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute w-3 h-3 rounded-full';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = '0 0 10px currentColor';
    container.appendChild(particle);

    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 100 + Math.random() * 100;

    const tl = gsap.timeline();

    // Explosion outward
    tl.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 50,
      duration: 0.6,
      ease: 'power2.out'
    })
    // Gravity fall
    .to(particle, {
      y: `+=150`,
      opacity: 0,
      duration: 0.8,
      ease: 'power1.in',
      onComplete: () => particle.remove()
    }, '<0.3');
  }
};

/**
 * Timer countdown urgent pulse (last 10 seconds)
 */
export const pulseTimerUrgent = (element: HTMLElement) => {
  gsap.killTweensOf(element);

  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    scale: 1.1,
    color: '#ef4444',
    duration: 0.4,
    ease: 'power2.out'
  })
  .to(element, {
    scale: 1,
    duration: 0.4,
    ease: 'power2.in'
  });

  return tl;
};

/**
 * Timer final seconds screen shake
 */
export const shakeScreenUrgent = (element: HTMLElement) => {
  gsap.killTweensOf(element);

  gsap.to(element, {
    x: 'random(-3, 3)',
    y: 'random(-3, 3)',
    duration: 0.08,
    repeat: -1,
    ease: 'none'
  });
};

/**
 * Stop timer animations
 */
export const stopTimerAnimations = (timerElement: HTMLElement, screenElement?: HTMLElement) => {
  gsap.killTweensOf(timerElement);
  gsap.to(timerElement, {
    scale: 1,
    color: 'inherit',
    duration: 0.2
  });

  if (screenElement) {
    gsap.killTweensOf(screenElement);
    gsap.to(screenElement, {
      x: 0,
      y: 0,
      duration: 0.2
    });
  }
};

// ============================================
// PHASE 3: VISUAL WOW FACTOR
// ============================================

/**
 * Result screen dramatic entrance sequence
 */
export const animateResultScreen = (
  rankBadge: HTMLElement,
  statCards: HTMLElement[],
  fortuneCookie: HTMLElement
) => {
  const tl = gsap.timeline();

  // Rank badge entrance with rotation
  tl.fromTo(rankBadge,
    { scale: 0, rotation: -360, opacity: 0 },
    {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }
  );

  // Stats cascade
  tl.fromTo(statCards,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    },
    '-=0.4'
  );

  // Fortune cookie reveal
  tl.fromTo(fortuneCookie,
    { scale: 0, rotation: -180, opacity: 0 },
    {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    },
    '-=0.2'
  );

  return tl;
};

/**
 * Smooth scroll animation with fade effects
 */
export const smoothScrollWords = (
  container: HTMLElement,
  targetScroll: number,
  previousWords?: HTMLElement[],
  upcomingWords?: HTMLElement[]
) => {
  // Scroll animation
  gsap.to(container, {
    scrollTop: targetScroll,
    duration: 0.6,
    ease: 'power2.out'
  });

  // Fade previous words
  if (previousWords && previousWords.length > 0) {
    gsap.to(previousWords, {
      opacity: 0.3,
      duration: 0.3,
      stagger: -0.05,
      ease: 'power1.out'
    });
  }

  // Fade in upcoming words
  if (upcomingWords && upcomingWords.length > 0) {
    gsap.fromTo(upcomingWords,
      { opacity: 0.2, y: 10 },
      {
        opacity: 0.6,
        y: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out'
      }
    );
  }
};

/**
 * Character pop-in animation for correct typing
 */
export const popCharacter = (charElement: HTMLElement, isCorrect: boolean) => {
  if (isCorrect) {
    gsap.fromTo(charElement,
      { scale: 0.5, y: -5 },
      {
        scale: 1,
        y: 0,
        duration: 0.15,
        ease: 'back.out(3)'
      }
    );
  } else {
    // Error wiggle
    const tl = gsap.timeline();
    tl.to(charElement, {
      x: -4,
      duration: 0.04,
      repeat: 5,
      yoyo: true,
      ease: 'power1.inOut'
    })
    .to(charElement, {
      x: 0,
      duration: 0.08
    });
  }
};

/**
 * Badge/element entrance with bounce
 */
export const bounceIn = (element: HTMLElement, delay: number = 0) => {
  gsap.fromTo(element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      delay,
      ease: 'back.out(1.7)'
    }
  );
};

/**
 * Utility: Kill all animations on element
 */
export const killAnimations = (element: HTMLElement) => {
  gsap.killTweensOf(element);
};

/**
 * Utility: Reset element to default state
 */
export const resetElement = (element: HTMLElement) => {
  gsap.killTweensOf(element);
  gsap.set(element, {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    backgroundColor: 'transparent',
    boxShadow: 'none'
  });
};

// ============================================
// PHASE 4: MICRO-INTERACTIONS
// ============================================

/**
 * Button hover effect with scale and glow
 */
export const buttonHover = (element: HTMLElement, enter: boolean = true) => {
  if (enter) {
    gsap.to(element, {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)',
      duration: 0.2,
      ease: 'power2.out'
    });
  } else {
    gsap.to(element, {
      scale: 1,
      boxShadow: '0 0 0 rgba(20, 184, 166, 0)',
      duration: 0.2,
      ease: 'power2.in'
    });
  }
};

/**
 * Button press effect with scale
 */
export const buttonPress = (element: HTMLElement) => {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in'
  })
  .to(element, {
    scale: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  });

  return tl;
};

/**
 * Mode switch animation with slide and fade
 */
export const switchMode = (
  outElement: HTMLElement,
  inElement: HTMLElement,
  direction: 'left' | 'right' = 'right'
) => {
  const tl = gsap.timeline();
  const slideDistance = direction === 'right' ? 30 : -30;

  // Fade out current mode
  tl.to(outElement, {
    x: slideDistance,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  })
  // Fade in new mode
  .fromTo(inElement,
    { x: -slideDistance, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    },
    '-=0.1'
  );

  return tl;
};

/**
 * Loading spinner pulse animation
 */
export const loadingPulse = (element: HTMLElement) => {
  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    scale: 1.2,
    opacity: 0.6,
    duration: 0.6,
    ease: 'power1.inOut'
  })
  .to(element, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'power1.inOut'
  });

  return tl;
};

/**
 * Stop loading animation
 */
export const stopLoading = (element: HTMLElement) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 1,
    opacity: 1,
    duration: 0.2
  });
};

/**
 * Tooltip appear animation
 */
export const showTooltip = (element: HTMLElement) => {
  gsap.fromTo(element,
    { y: 10, opacity: 0, scale: 0.9 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.7)'
    }
  );
};

/**
 * Tooltip disappear animation
 */
export const hideTooltip = (element: HTMLElement) => {
  gsap.to(element, {
    y: 10,
    opacity: 0,
    scale: 0.9,
    duration: 0.2,
    ease: 'power2.in'
  });
};

/**
 * Card flip animation for stats reveal
 */
export const flipCard = (element: HTMLElement, showBack: boolean = true) => {
  const tl = gsap.timeline();

  if (showBack) {
    tl.to(element, {
      rotationY: 90,
      duration: 0.3,
      ease: 'power2.in'
    })
    .set(element, { rotationY: -90 })
    .to(element, {
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  } else {
    tl.to(element, {
      rotationY: -90,
      duration: 0.3,
      ease: 'power2.in'
    })
    .set(element, { rotationY: 90 })
    .to(element, {
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  return tl;
};

/**
 * Number counter animation
 */
export const animateNumber = (
  element: HTMLElement,
  from: number,
  to: number,
  duration: number = 1,
  suffix: string = ''
) => {
  const obj = { value: from };

  gsap.to(obj, {
    value: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString() + suffix;
    }
  });
};

/**
 * Progress bar fill animation
 */
export const fillProgressBar = (
  element: HTMLElement,
  percentage: number,
  duration: number = 1
) => {
  gsap.to(element, {
    width: `${percentage}%`,
    duration,
    ease: 'power2.out'
  });
};

/**
 * Ripple effect on click
 */
export const createRipple = (x: number, y: number, container: HTMLElement, color: string = '#14b8a6') => {
  const ripple = document.createElement('div');
  ripple.className = 'absolute rounded-full pointer-events-none';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.backgroundColor = color;
  ripple.style.transform = 'translate(-50%, -50%)';
  container.appendChild(ripple);

  gsap.to(ripple, {
    width: '100px',
    height: '100px',
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => ripple.remove()
  });
};

/**
 * Glow pulse on notification/achievement
 */
export const glowPulse = (element: HTMLElement, color: string = '#14b8a6', count: number = 3) => {
  const tl = gsap.timeline({ repeat: count - 1 });

  tl.to(element, {
    boxShadow: `0 0 20px ${color}`,
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(element, {
    boxShadow: '0 0 0 rgba(0,0,0,0)',
    duration: 0.3,
    ease: 'power2.in'
  });

  return tl;
};

/**
 * Shake on invalid input
 */
export const shakeInvalid = (element: HTMLElement) => {
  const tl = gsap.timeline();

  tl.to(element, {
    x: -5,
    duration: 0.05,
    ease: 'power1.inOut'
  })
  .to(element, {
    x: 5,
    duration: 0.05,
    repeat: 3,
    yoyo: true,
    ease: 'power1.inOut'
  })
  .to(element, {
    x: 0,
    duration: 0.05
  });

  return tl;
};

/**
 * Success checkmark animation
 */
export const successCheckmark = (element: HTMLElement) => {
  gsap.fromTo(element,
    { scale: 0, rotation: -180 },
    {
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    }
  );
};

/**
 * Floating animation for decorative elements
 */
export const float = (element: HTMLElement, distance: number = 10) => {
  gsap.to(element, {
    y: distance,
    duration: 2 + Math.random(),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
};

/**
 * Stagger fade in for lists
 */
export const staggerFadeIn = (elements: HTMLElement[], stagger: number = 0.1) => {
  gsap.fromTo(elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger,
      ease: 'power2.out'
    }
  );
};

/**
 * Magnetic button effect (follows cursor)
 */
export const magneticButton = (
  button: HTMLElement,
  event: MouseEvent,
  strength: number = 0.3
) => {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = (event.clientX - centerX) * strength;
  const deltaY = (event.clientY - centerY) * strength;

  gsap.to(button, {
    x: deltaX,
    y: deltaY,
    duration: 0.3,
    ease: 'power2.out'
  });
};

/**
 * Reset magnetic button
 */
export const resetMagneticButton = (button: HTMLElement) => {
  gsap.to(button, {
    x: 0,
    y: 0,
    duration: 0.4,
    ease: 'elastic.out(1, 0.5)'
  });
};
