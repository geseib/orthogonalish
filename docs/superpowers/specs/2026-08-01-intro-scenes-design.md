# Introductory Theatre Scenes

## Purpose

Teach the central idea before asking the reader to use the calculator:

1. Perfectly perpendicular directions represent distinct ideas.
2. Relaxing 90° to 88°–92° does not create an obvious extra direction in two dimensions.
3. Adding only one dimension still does not reveal the eventual surprise.
4. Repeating that addition many times produces the dramatic high-dimensional growth shown by the calculator.

The introduction must feel like the opening of the same play, not a separate explainer or second calculator.

## Story order

### Title card

Keep the current opening screen: “How many arrows can stand nearly sideways?” Its down-arrow advances to Scene I.

### Scene I — Two ideas, no interruption

Two luminous lines meet at an exact right angle. Rosencrantz treats them as two different ideas that never interrupt one another. Guildenstern supplies the concise interpretation: perfectly perpendicular directions share no component.

The scene ends with a simple statement: in two dimensions, two perfectly perpendicular directions fit.

### Scene II — Surely one more

Guildenstern holds thumb and forefinger in an L. Rosencrantz tries to insert another finger or line between them. He relaxes the demand from exactly 90° to the range 88°–92°, but a third nearly-perpendicular direction still does not fit in the flat plane.

Rosencrantz then proposes one more dimension. Guildenstern notes that three dimensions still give only the three obvious near-right-angle directions at this tight tolerance. The joke is that Rosencrantz has discovered a genuine principle but appears to have discovered nothing useful.

The final exchange points forward without formulas: one extra dimension changes almost nothing; thousands of them change the kind of growth.

### Calculator

The next down-arrow lands on the existing calculator. The calculator remains the first interactive mathematical surface and retains the large estimated total as its visual focus.

## Visual treatment

- Each scene occupies approximately one viewport and uses the existing black, ivory, gold, and cyan palette.
- Typography, borders, caption treatment, and spacing match the current stage and dialogue cards.
- Create two original illustrations in the same editorial-cartoon series as the existing theatre art.
- Scene I centers the right-angle relationship with the characters secondary.
- Scene II centers Guildenstern’s L-shaped hand gesture and Rosencrantz’s unsuccessful third line.
- Avoid formulas, graphs, dashboards, extra controls, and floating technical labels.
- Preserve generous negative space and one dominant visual idea per scene.

## Dialogue

Dialogue stays short enough to read without stopping the scroll. Rosencrantz pokes at the physical demonstration and stumbles onto the lesson; Guildenstern theorizes about what it means.

Every introductory scene contains three short beats:

1. **Setup:** the characters name or physically arrange the problem.
2. **Experiment:** Rosencrantz changes or pokes the demonstration.
3. **Discovery:** the result appears and Guildenstern interprets it—usually just after Rosencrantz has lost interest.

Every beat contains:

- one Rosencrantz line;
- one Guildenstern line;
- one plain-language aside;

Each scene retains one optional “What did that mean?” expansion for a slightly deeper explanation of its discovery.

Advanced terms such as dot product, tolerance, coherence, and named bounds do not appear in the default scene copy. They remain candidates for the later tooltip work.

## Navigation

- The title card and both introductory scenes have a visible down control.
- Down Arrow advances to the next full section in a viewport-sized movement.
- Up Arrow returns to the previous full section in a viewport-sized movement.
- Right Arrow advances to the next dialogue beat inside the current introductory scene without scrolling the page.
- Left Arrow returns to the previous dialogue beat inside the current introductory scene without scrolling the page.
- Each introductory scene includes visible left and right controls that perform the same actions as the keyboard arrows.
- Left and right movement stops at the first and last beat rather than wrapping into another section.
- Moving up or down preserves each scene’s most recently viewed dialogue beat during the current visit.
- Keyboard navigation does not intercept keys while the reader is typing in an input, textarea, or editable element.
- Keyboard navigation also leaves native buttons, links, and form controls alone when they have focus.
- Scrolling respects reduced-motion preferences.
- Normal touchpad, mouse-wheel, and touch scrolling continue to work.
- The existing calculator and later page sections remain reachable in document order.

## Accessibility

- Navigation controls are real buttons or links with descriptive labels.
- Illustrations have useful alt text describing the teaching action rather than decorative details.
- Dialogue remains text in the document instead of being baked into images.
- Heading levels follow the page order.
- Focus states remain visible.
- Reduced-motion mode uses immediate section movement.

## Scope boundaries

This step does not add tooltips, change the calculator mathematics, redesign the existing experiment, or add another input surface. It adds only the two introductory scenes, their matching illustrations, and section-by-section navigation.

## Verification

- Automated tests confirm the title → Scene I → Scene II → calculator order.
- Tests confirm left/right beat boundaries and that beat changes do not scroll the page.
- Tests confirm up/down section navigation skips interactive controls and respects reduced motion.
- Tests confirm the required plain-language lesson and character roles.
- Existing calculator, dialogue, worker, accessibility, and rendering tests remain green.
- Lint and production build complete successfully.
