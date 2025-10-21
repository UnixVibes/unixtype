# GSAP Integration Plan for UnixType

## 🎯 High-Priority GSAP Animations

### 1. **Word Completion Celebration** ✨
**Current:** Simple particle effect
**GSAP Enhancement:**
```typescript
// Exploding particles with physics
gsap.to(particles, {
  duration: 1,
  x: "random(-100, 100)",
  y: "random(-100, 100)",
  opacity: 0,
  scale: 0,
  ease: "power2.out",
  stagger: 0.02
});

// Word scale bounce
gsap.timeline()
  .to(wordElement, { scale: 1.2, duration: 0.2 })
  .to(wordElement, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
```

**Impact:** More satisfying feedback for correct words

---

### 2. **Error Shake Animation** 🔴
**Current:** No error animation
**GSAP Enhancement:**
```typescript
// Violent shake on error
gsap.timeline()
  .to(wordElement, {
    x: -10,
    duration: 0.05,
    ease: "power2.inOut"
  })
  .to(wordElement, {
    x: 10,
    duration: 0.05,
    ease: "power2.inOut",
    repeat: 3,
    yoyo: true
  })
  .to(wordElement, {
    x: 0,
    duration: 0.1
  });

// Red flash
gsap.to(wordElement, {
  backgroundColor: "rgba(239, 68, 68, 0.2)",
  duration: 0.1,
  yoyo: true,
  repeat: 1
});
```

**Impact:** Clear visual feedback for mistakes

---

### 3. **Streak Milestone Fireworks** 🎆
**Current:** Basic sound and particle
**GSAP Enhancement:**
```typescript
// Create firework burst at 10, 20, 30 streak
const createFirework = (x: number, y: number) => {
  const particles = Array.from({ length: 20 }, () => ({
    element: document.createElement('div'),
    angle: Math.random() * Math.PI * 2
  }));

  particles.forEach(({ element, angle }) => {
    gsap.timeline()
      .to(element, {
        duration: 1,
        x: Math.cos(angle) * 200,
        y: Math.sin(angle) * 200 - 100, // gravity
        opacity: 0,
        ease: "power2.out"
      })
      .to(element, {
        y: "+=100", // fall down
        duration: 0.5,
        ease: "power1.in"
      }, "<0.5");
  });
};
```

**Impact:** Epic celebrations for major milestones

---

### 4. **Personal Best Breaking Animation** 🏆
**Current:** Simple badge popup
**GSAP Enhancement:**
```typescript
// Screen flash + confetti explosion
const celebrateNewRecord = () => {
  // Flash the screen
  gsap.timeline()
    .to('.screen-overlay', {
      opacity: 0.3,
      duration: 0.1,
      backgroundColor: '#14b8a6'
    })
    .to('.screen-overlay', {
      opacity: 0,
      duration: 0.3
    });

  // Confetti from top
  const confettiCount = 50;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    gsap.to(confetti, {
      duration: 2 + Math.random(),
      y: window.innerHeight,
      x: `+=${Math.random() * 200 - 100}`,
      rotation: Math.random() * 720,
      opacity: 0,
      ease: "power1.in"
    });
  }

  // Trophy bounce
  gsap.timeline()
    .fromTo('.new-record-badge',
      { scale: 0, rotation: -180 },
      {
        scale: 1.2,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(2)"
      }
    )
    .to('.new-record-badge', {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
};
```

**Impact:** Unforgettable achievement moment

---

### 5. **Combo Multiplier Charge-Up** ⚡
**Current:** Static badge
**GSAP Enhancement:**
```typescript
// Energy gathering animation
gsap.timeline({ repeat: -1 })
  .to('.combo-badge', {
    boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
    scale: 1.05,
    duration: 0.5,
    ease: "power2.inOut"
  })
  .to('.combo-badge', {
    boxShadow: "0 0 40px rgba(20, 184, 166, 0.9)",
    scale: 1.1,
    duration: 0.5,
    ease: "power2.inOut"
  })
  .to('.combo-badge', {
    boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
    scale: 1.05,
    duration: 0.5,
    ease: "power2.inOut"
  });

// Lightning bolts around badge
const createLightning = () => {
  gsap.to('.lightning-path', {
    strokeDashoffset: 0,
    duration: 0.2,
    ease: "power1.inOut",
    stagger: 0.05
  });
};
```

**Impact:** Shows power building up

---

### 6. **Words Scroll Animation** 📜
**Current:** CSS smooth scroll
**GSAP Enhancement:**
```typescript
// Custom smooth scroll with easing
gsap.to(wordsContainer, {
  scrollTop: targetScroll,
  duration: 0.6,
  ease: "power2.out"
});

// Fade out previous words
gsap.to('.previous-words', {
  opacity: 0.3,
  duration: 0.3,
  stagger: -0.05
});

// Fade in upcoming words
gsap.fromTo('.upcoming-words',
  { opacity: 0.2, y: 10 },
  {
    opacity: 0.6,
    y: 0,
    duration: 0.4,
    stagger: 0.03
  }
);
```

**Impact:** Smoother, more polished scrolling

---

### 7. **Timer Countdown Pulse** ⏱️
**Current:** Static number
**GSAP Enhancement:**
```typescript
// Pulse when time is running out (< 10 seconds)
if (timeLeft <= 10) {
  gsap.timeline({ repeat: -1 })
    .to('.timer', {
      scale: 1.15,
      color: '#ef4444', // red
      duration: 0.3,
      ease: "power2.out"
    })
    .to('.timer', {
      scale: 1,
      duration: 0.3,
      ease: "power2.in"
    });
}

// Final 3 seconds - screen shake
if (timeLeft <= 3) {
  gsap.to('.main-container', {
    x: "random(-2, 2)",
    y: "random(-2, 2)",
    duration: 0.1,
    repeat: -1
  });
}
```

**Impact:** Creates urgency and tension

---

### 8. **Result Screen Entrance** 🎊
**Current:** Simple fade-in
**GSAP Enhancement:**
```typescript
const animateResults = () => {
  const tl = gsap.timeline();

  // Screen transition
  tl.to('.typing-test', {
    opacity: 0,
    scale: 0.9,
    duration: 0.4
  })

  // Rank badge entrance
  .fromTo('.rank-badge',
    { scale: 0, rotation: -360, opacity: 0 },
    {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }
  )

  // Stats cascade
  .fromTo('.stat-card',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    },
    "-=0.4"
  )

  // Fortune cookie reveal
  .fromTo('.fortune-cookie',
    { scale: 0, rotation: -180 },
    {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)"
    },
    "-=0.2"
  );
};
```

**Impact:** Dramatic, professional results reveal

---

### 9. **Typing Speed Meter** 📊
**Current:** Text WPM only
**GSAP Enhancement:**
```typescript
// Animated speedometer arc
const updateSpeedometer = (wpm: number) => {
  const rotation = (wpm / 200) * 180; // 200 WPM = max

  gsap.to('.speedometer-needle', {
    rotation: rotation,
    duration: 0.5,
    ease: "power2.out"
  });

  // Color zones: green -> yellow -> red
  const color = wpm < 40 ? '#10b981' :
                wpm < 80 ? '#f59e0b' : '#ef4444';

  gsap.to('.speedometer-arc', {
    stroke: color,
    duration: 0.3
  });
};
```

**Impact:** Visual speed representation

---

### 10. **Character Pop Animation** 🔤
**Current:** Instant character appearance
**GSAP Enhancement:**
```typescript
// Each correct character pops in
const animateCharacter = (charElement: HTMLElement, isCorrect: boolean) => {
  if (isCorrect) {
    gsap.fromTo(charElement,
      { scale: 0, y: -10 },
      {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: "back.out(3)"
      }
    );
  } else {
    // Error wiggle
    gsap.timeline()
      .to(charElement, {
        x: -5,
        duration: 0.05,
        repeat: 5,
        yoyo: true
      })
      .to(charElement, {
        x: 0,
        duration: 0.1
      });
  }
};
```

**Impact:** Satisfying micro-interactions

---

## 🎭 Advanced GSAP Features to Use

### ScrollTrigger Plugin
```typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Parallax leaderboard entries
gsap.to('.leaderboard-entry', {
  scrollTrigger: {
    trigger: '.leaderboard',
    start: 'top center',
    end: 'bottom center',
    scrub: 1
  },
  y: -50,
  stagger: 0.1
});
```

### DrawSVG Plugin (Premium)
```typescript
// Animate progress bars
gsap.fromTo('.progress-path',
  { drawSVG: "0%" },
  {
    drawSVG: "100%",
    duration: 1,
    ease: "power2.inOut"
  }
);
```

### MorphSVG Plugin (Premium)
```typescript
// Morph rank badges
gsap.to('.rank-icon', {
  morphSVG: '.next-rank-icon',
  duration: 1,
  ease: "power2.inOut"
});
```

---

## 🚀 Implementation Priority

**Phase 1: Core Interactions** (Immediate Impact)
1. Word completion celebration
2. Error shake animation
3. Personal best breaking animation

**Phase 2: Enhanced Feedback** (Polish)
4. Combo multiplier charge-up
5. Streak milestone fireworks
6. Timer countdown pulse

**Phase 3: Visual Wow Factor** (Delight)
7. Result screen entrance
8. Words scroll animation
9. Typing speed meter

**Phase 4: Micro-interactions** (Professional Touch)
10. Character pop animation

---

## 📦 GSAP vs Framer Motion Comparison

| Feature | Framer Motion | GSAP |
|---------|---------------|------|
| React Integration | ✅ Excellent | ⚠️ Manual |
| Timeline Control | ⚠️ Basic | ✅ Advanced |
| Performance | ✅ Good | ✅ Excellent |
| File Size | ~35KB | ~50KB (core) |
| Learning Curve | Easy | Medium |
| Physics/Easing | ⚠️ Limited | ✅ Extensive |
| SVG Animation | ⚠️ Basic | ✅ Advanced |
| Text Animation | ❌ None | ✅ SplitText |
| License | Free | Free + Premium |

---

## 🎨 Recommended Hybrid Approach

**Use Framer Motion for:**
- Component enter/exit transitions
- Layout animations
- Simple hover effects
- Page transitions

**Use GSAP for:**
- Complex celebrations (streaks, records)
- Timeline sequences (results screen)
- Physics-based particles
- Custom scroll effects
- Text splitting/scrambling
- Advanced easing curves

**Example: Hybrid Animation**
```typescript
// Framer Motion for mount/unmount
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  {/* GSAP for complex interaction */}
  <div ref={el => {
    if (el && isCorrect) {
      gsap.timeline()
        .to(el, { scale: 1.2, duration: 0.2 })
        .to(el, { scale: 1, duration: 0.3, ease: "elastic.out" });
    }
  }}>
    Word
  </div>
</motion.div>
```

---

## 💡 Pro Tips

1. **useGSAP Hook** - Use GSAP's React integration:
```typescript
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  gsap.to('.element', { x: 100 });
}, [dependency]);
```

2. **Cleanup Animations** - Always kill timelines:
```typescript
useEffect(() => {
  const tl = gsap.timeline();
  // ... animations

  return () => tl.kill();
}, []);
```

3. **Performance** - Use will-change for animated properties:
```css
.animated-element {
  will-change: transform, opacity;
}
```

4. **Reusable Animations** - Create animation utilities:
```typescript
export const animations = {
  celebrate: (element: HTMLElement) => {
    gsap.timeline()
      .to(element, { scale: 1.2, duration: 0.2 })
      .to(element, { scale: 1, duration: 0.3, ease: "elastic.out" });
  },

  shake: (element: HTMLElement) => {
    gsap.to(element, {
      x: -10,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut"
    });
  }
};
```

---

## 📚 Resources

- [GSAP Docs](https://greensock.com/docs/)
- [GSAP + React](https://greensock.com/react/)
- [Easing Visualizer](https://greensock.com/ease-visualizer/)
- [CodePen Examples](https://codepen.io/GreenSock/)

---

## 🎯 Next Steps

1. Install GSAP: `pnpm add gsap`
2. Start with Phase 1 animations
3. Test performance on mobile
4. Gradually add more complex animations
5. Consider GSAP Club membership for premium plugins

Would you like me to implement any of these animations?
