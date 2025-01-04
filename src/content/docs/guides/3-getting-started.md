---
title: "Getting Started"
description: "Learn the core syntax of Elevate CSS, from quick start to responsive styling."
---
Elevate CSS aims to get you up and running quickly while still encouraging you to explore its deeper configuration capabilities.

### Installation and Usage

```bash
# Install dependencies
npm install

# Compile to CSS
npm start
```

### Syntax Guide

At the heart of Elevate's syntax is what are called *utility strings*, which describe styling and serve as the basis for CSS generation. They also double as the actual CSS classes. Unlike traditional utility frameworks with pre-defined classes, you effectively write CSS as you write these utility strings. They are validated against the design system and syntax rules at build-time.

#### Basic Format

```html
<div class="property:modifier">
```

#### Direct Properties

Properties that don’t require a modifier to define a single CSS declaration—often used for layout and positioning.

```html
<div class="block"> <!-- display: block -->
```

#### Compound Properties

Properties that require one or more modifiers for more complex CSS declarations:

```html
<div class="text:dark:bold:left">
  <!--
    .text\:dark\:bold\:left {
      color: #2C2638;
      font-weight: 700;
      text-align: left;
    }
  -->
</div>
```

#### Practical Examples

```html
<div class="text:bold:purple">      <!-- Bold text with purple color -->
<div class="color:purple">          <!-- Element color set to purple -->
<div class="row:x-center:y-start">  <!-- Row layout with specific alignment -->
<div class="absolute left:d12 z:10"> <!-- Absolute positioning, d12 from the left, and z-index of 10 -->
```

> **Note**  
> Modifiers are order agnostic. You can write `text:red:bold` or `text:bold:red` and achieve the same result.

---

### Responsive Styling

Elevate enforces a mobile-first, organized syntax for responsive design:

```html
<div class="text:purple p:d1:d2 /md/ text:right /lg/ @hover:[text:green:right]">
```

1. Define universal classes on the far left.  
2. Add breakpoint-specific adjustments after a `/breakpoint/` indicator.

---

### Contextual and Functional Flags

#### Contextual Flag `@`

Allows complex, conditional styling for states, conditions, and other pseudo-classes or pseudo-elements:

```html
<div class="@hover:[text:green:right_p:d1]">
  <!-- Hover state changes text color to green, right-aligned, and adds padding. -->
</div>
```

Chaining with underscores (`_`) allows for concise expressions of design intent.

#### Functional Flag `$`

Exempts certain classes from CSS generation (e.g., for JavaScript interactions):

```html
<div class="$mySelector">
  <!-- This class name won't generate CSS. Useful for JS hooks. -->
</div>
```

---

### Design Tokens and Rules

Elevate’s systems are driven by two distinct elements:

1. **Design System Tokens**  
   - Global, immutable design constraints.  
   - Located in `elevate/design/` directory.  
   - Examples: color definitions, typography scales, spacing units.

2. **Syntax Rule Mappings**  
   - Property-specific structural validation and syntax expansion.  
   - Located in `elevate/rules/` directory.  
   - Ensures that modifiers map to the correct token types and build valid declarations.