# ORGATICK Admin Landing Page

## 🎯 Overview
A premium, security-focused admin landing page for ORGATICK's administrative control panel. Built with Next.js 15, shadcn/ui components, and Tabler Icons.

## 📁 Structure

```
components/landing/
├── Header.jsx              # Navigation with logo and theme toggle
├── Hero.jsx                # Main hero section with CTA
├── Capabilities.jsx        # 9 core administrative capabilities
├── Security.jsx            # 6 security features with emphasis
├── DashboardPreview.jsx    # Wireframe preview of admin dashboard
├── Philosophy.jsx          # System design principles
├── Footer.jsx              # Footer with legal notice
└── index.js               # Centralized exports
```

## 🎨 Design Principles

### Visual Style
- **Clean & Minimal**: No illustrations, no mascots, no stock photos
- **Enterprise SaaS Feel**: Inspired by Stripe Admin + Vercel Dashboard + Linear
- **Dark/Light Theme**: Full theme support with toggle
- **High Contrast**: Readable typography with structured layouts
- **Wireframe Aesthetics**: Dashboard preview in wireframe style

### Color Usage
- Uses shadcn theme variables for consistency
- Primary color for CTAs and accents
- Muted tones for secondary content
- Destructive for alerts (minimal use)

### Typography
- **Headings**: Bold, tight tracking
- **Body**: Relaxed leading, clear hierarchy
- **Mono**: For URLs and technical content

## 🔒 Security Messaging

The page emphasizes:
1. Multi-factor authentication
2. Passkey/WebAuthn support
3. Session validation
4. Admin-only access
5. Login activity tracking
6. Audit-ready design

**Tone**: "This system is locked down and intentional."

## 🧩 Components Breakdown

### 1. Header
- Fixed position with backdrop blur
- Logo + ORGATICK branding
- Theme toggle (sun/moon icon)
- "Access Dashboard" CTA button

### 2. Hero
- Full-screen height
- Subtle grid background pattern
- Security badge
- Primary headline: "Control your events. Securely. At scale."
- Two CTAs: "Access Dashboard" + "View Capabilities"
- System notice footer

### 3. Capabilities
- 9 capabilities in 3-column grid
- Each with icon, title, description
- Hover effects on cards
- Covers: Events, Registrations, Payments, Approvals, Analytics, Communication, Multi-domain, Notifications, System Controls

### 4. Security
- 6 security features
- Dedicated security badge
- Prominent headline: "Locked down. By design."
- Security statement box
- Emphasizes zero-trust architecture

### 5. Dashboard Preview
- Browser chrome mockup
- Sidebar navigation wireframe
- Stats grid
- Chart visualization
- Table/list view
- All in wireframe style (no real data)

### 6. Philosophy
- 4 core principles
- Quote box: "This is not a consumer application. This is infrastructure."
- Technical stack mention
- Emphasizes: Scale, Backend-first, Predictability, Zero Surprises

### 7. Footer
- Logo and branding
- Internal system notice
- Copyright info
- Legal disclaimer about authorized access

## 🎨 Custom Styles

Added to `globals.css`:
```css
.bg-grid-pattern         # Subtle grid background
html                     # Smooth scrolling
::-webkit-scrollbar      # Custom scrollbar theming
```

## 🔧 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Tabler Icons React
- **Theme**: next-themes
- **Components**: Radix UI primitives

## 🚀 Usage

The landing page automatically redirects authenticated users to `/dashboard`. Non-authenticated users see the full landing experience.

```jsx
// Auto-redirect logic in page.jsx
useEffect(() => {
  if (isAuthenticated) {
    router.push("/dashboard");
  }
}, [isAuthenticated]);
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg
- Grid adapts: 1 col → 2 cols → 3 cols
- Typography scales appropriately

## ✨ Interactions

- Smooth scroll to sections
- Theme toggle with persistence
- Hover states on all interactive elements
- Button transitions
- Card hover effects

## 🎯 Messaging Guidelines

**What to say:**
- Secure, Controlled, Reliable, Structured
- Backend-first, Predictable, Infrastructure
- Admin, Operations, System-level

**What NOT to say:**
- Easy, Fun, Simple
- Playful, Friendly
- Consumer-focused language

## 🔗 Links

- Primary CTA: `/auth` (Access Dashboard)
- Capabilities anchor: `#capabilities`
- All external domains mentioned: `admin.orgatick.in`

## 📄 License Notice

Footer includes legal disclaimer:
- Authorized personnel only
- All access logged and monitored
- Compliance with security policies

---

**Built for**: Event organizers, internal admins, operations teams, and developers  
**Purpose**: Secure admin control panel gateway  
**Domain**: admin.orgatick.in
