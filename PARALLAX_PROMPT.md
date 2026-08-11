# 100/100 Portfolio Design Prompt: JR//OS

Design and build an award-caliber, cinematic, interactive portfolio for Jashwanth Raj using only verified facts and the real portrait from https://jashwanth-raj.github.io/. The outcome must feel as if a top global experience-design studio created a personal operating system for a Technical Support L1 professional at Lenovo, cybersecurity researcher, and IT problem solver in Bengaluru.

Do not make another generic developer portfolio. Do not use a card grid, glassmorphism template, floating skill pills, decorative code snippets, generic gradient blobs, fake metrics, or a dashboard hero. Create one memorable visual and narrative system called **JR//OS** around the idea: **"Find the signal inside the noise."** Every interaction must reinforce diagnosis, clarity, security, and ownership.

## Art Direction

Use near-black, warm mineral white, electric signal green, and one controlled safety-orange accent. Combine massive editorial typography with tiny monospace system labels. Add fine grids, crosshairs, scan lines, subtle film grain, tracing lines, and severe whitespace. Make the portrait cinematic and full bleed, treated in high-contrast monochrome with a faint signal-green cast. Avoid rounded cards and soft SaaS styling. Interaction containers may be boxed only where they function as tools.

The first viewport must look unmistakably like Jashwanth's brand even with the navigation removed. Layer his full-height portrait behind enormous two-line **JASHWANTH / RAJ.** typography. Set the second line in outline type and offset it across the portrait. Add only: availability, Bengaluru, Technical Support L1 at Lenovo, the one-line thesis "I find the signal inside the noise, then turn technical complexity into human confidence," and one CTA to enter the Incident Lab. Add a slow portrait/typography depth split on scroll, a restrained scan line, and a vertical scroll trace. No badges, stats, or floating panels in the hero.

## Signature Interaction: Incident Lab

Build a real, replayable, branching network-diagnostics simulation, not a decorative terminal and not a multiple-choice trivia widget. Present a realistic employee incident: the laptop joins Wi-Fi, but websites and VPN fail. Let the visitor act as the L1 operator across four layers:

1. Inspect the IP configuration and identify an APIPA address.
2. Release and renew DHCP using the least destructive action.
3. Prove that external IP connectivity works but DNS resolution fails.
4. Apply an approved fallback DNS, flush cache, verify VPN and websites, and document the resolution.

At every layer offer three plausible actions. Wrong actions must remain playable, explain why they are disproportionate or irrelevant, reduce the score, and allow another attempt. Correct actions advance the trace. Support keyboard choices 1-3. Include a running timer, score, case ID, terminal output, evidence telemetry, animated client/Wi-Fi/DHCP/DNS/web path, progress trace, immediate rationale, final grade, and replay. The game should teach Jashwanth's support philosophy: evidence first, least-destructive action, validate the user journey, document the outcome. Make the lab responsive and fully usable on touch screens.

## Narrative Flow

1. **Identity:** Full-bleed parallax portrait hero with JR//OS branding and the single Incident Lab CTA.
2. **Principle:** Switch to warm white. Move a giant outlined "HUMAN FIRST / SYSTEMS DEEP" phrase laterally on scroll. Use the statement "Technology fails. Trust should not." and one concise philosophy paragraph. End with an integrated evidence line: 9.0 BCA CGPA, 3+ years in tech, 4 languages, 3 major awards.
3. **Protocols:** Four full-width typographic rows: Diagnose, Secure, Connect, Support. Each row reveals one concise behavior and relevant technical domain on hover or entry. No cards.
4. **Incident Lab:** Give the interactive simulation an entire dark technical stage with excellent hierarchy and enough space to feel like the centerpiece.
5. **Career Trace:** Large editorial chronology for Lenovo, Infidata Technologies, and Karnataka Slum Development Board. Integrate the BCA 9.0 CGPA education detail as a kinetic signal-green ribbon, not a separate education card.
6. **Evidence:** Use a deep oxidized-red section with three oversized bordered rows for State-Level Hackathon Winner, Router Vulnerability Discovery, and Best Team Leader NSS. On hover, flood each row with safety orange while retaining readability.
7. **Contact:** Return to a full-bleed portrait and make "Bring me the hard problem" the closing statement. Open a keyboard-accessible contact command palette with email, copy email, LinkedIn, and GitHub actions.

## Motion System

- Use separate scroll-linked transforms for the hero portrait and title.
- Fade the hero only after the visitor begins leaving the first viewport.
- Move oversized outlined text laterally through the principle section.
- Animate the scan line slowly, the active network route with dashed flow, the current node with a pulse, and feedback panels from the bottom.
- Reveal content once with short, confident vertical or horizontal motion. Never make all elements float continuously.
- Add a 2px fixed page-progress line and a very subtle pointer-following ambient glow on precise pointer devices.
- Use expressive hover states that alter spacing, line fill, arrow position, or text color rather than simply adding shadows.
- Respect `prefers-reduced-motion`, preserve all functionality without animation, and never gate content behind motion.

## Functional Standard

Use React, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons. Build data-driven sections and a proper game state machine. Add smooth anchors, a fixed nav that becomes blurred after scroll, a full-screen mobile menu, Escape handling, Ctrl/Cmd+K contact palette, live-region updates for game output, semantic structure, clear focus states, descriptive labels, working external links, and a copy-email confirmation. Ensure polished layouts at 320px, 768px, 1440px, and ultra-wide sizes.

The result should not merely look technical. It should let the visitor experience Jashwanth's decision-making. The portfolio succeeds only if the visitor remembers three things after leaving: his name, his calm technical method, and the Incident Lab they actually played.