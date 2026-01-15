# Google Antigravity Design System Analysis

## Typography
- **Primary Font**: `Google Sans Code` (monospace coding font)
- **Font Weights**: 400 (Regular), 700 (Bold)
- **Font Styles**: Normal, Italic
- **Character**: Clean, geometric, highly readable monospace

## Color Palette
Based on the website analysis:
- **Background**: Pure white (#FFFFFF)
- **Blue Morphing Gradient**: Soft cyan/blue tones (#00F0FF to #4285F4)
- **Text Primary**: Deep black (#1F1F1F to #000000)
- **Text Secondary**: Medium gray (#5F6368)
- **Accent**: Electric blue (#4285F4)

## Background Effects
1. **Morphing Gradient**: 
   - Animated radial gradients
   - Slow, organic movement
   - Multiple color stops (cyan, blue, purple)
   - Heavy blur (100-200px)
   - Opacity 10-20%

2. **Particle System**:
   - Very small particles (2-4px)
   - Subtle cyan/blue colors
   - Slow drift animation
   - Interactive on mouse/touch
   - 30-50 particles

## Animations
1. **Typewriter Effect on Titles**:
   - Character-by-character reveal
   - Blinking cursor
   - Speed: ~50-80ms per character
   - Appears on page load or scroll into view

2. **Button Hover**:
   - Subtle scale (1.02-1.05)
   - Soft shadow expansion
   - Smooth transitions (300-400ms)

3. **Card Entrance**:
   - Fade in + slide up
   - Staggered (100ms delay between each)
   - Spring physics

## Layout
- **Max Width**: 1200-1400px
- **Spacing System**: 8px base unit (8, 16, 24, 32, 48, 64, 96)
- **Generous White Space**: 2-3x normal spacing
- **Grid**: Flexbox-based, responsive
  
## Components

### Buttons
- **Border Radius**: Full rounded (9999px / rounded-full)
- **Padding**: 16px 32px (vertical horizontal)
- **Font**: Bold, uppercase tracking
- **Primary**: Black background, white text
- **Secondary**: White background, black text, 1px border
- **Shadow**: Soft, 0 4px 20px rgba(0,0,0,0.08)

### Cards
- **Border Radius**: 24-32px
- **Background**: White
- **Border**: 1px solid rgba(0,0,0,0.05)
- **Shadow**: 0 8px 40px rgba(0,0,0,0.06)
- **Padding**: 40-48px
- **Hover**: Lift effect (translateY: -4px)

### Navigation
- **Style**: Minimal, clean
- **Spacing**: Large gaps (32-48px between items)
- **Hover**: Underline or color change
- **Logo**: Simple, icon + text

## Key Differences from Current Implementation
1. **Font**: Need to use Google Sans Code instead of default
2. **Typewriter**: Missing completely
3. **Morphing Background**: Current is static vignette, need animated gradients
4. **Particles**: Too visible, need more subtle
5. **Spacing**: Need more generous white space
6. **Buttons**: Need perfect pills with specific styles
