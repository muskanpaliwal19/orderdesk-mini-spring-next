# DESIGN.md

## Framework & Core Library
- **Framework**: Next.js
- **UI Component Library**: Material-UI (MUI) v5.
- Import components directly from `@mui/material`. Example: `import Button from '@mui/material/Button';`

## Theming & Styling
- All theme customizations (palette, typography, spacing) must be defined in a central MUI theme object.
- Wrap the application in MUI's `ThemeProvider`.
- Use the `sx` prop for component-specific, one-off style overrides.
- Use the `styled()` utility for creating new, reusable styled components.
- Adhere to Google's Material Design principles as implemented by MUI.
- **Do NOT** use inline styles (`style={{}}`).
- **Do NOT** create custom global CSS files for component styling. Use the theme.

## Layout & Spacing
- Use MUI's layout components: `<Box>`, `<Grid>`, `<Stack>`, and `<Container>`.
- Use the theme's spacing unit for all margins, padding, and gaps.
- Access spacing via the theme function: `theme.spacing()`. The default increment is 8px (e.g., `theme.spacing(1)` is `8px`, `theme.spacing(2)` is `16px`).
- Example usage in `sx` prop: `sx={{ padding: 2 }}` which translates to `padding: 16px;`.
- **Do NOT** use hardcoded pixel values (e.g., `margin: '10px'`) for spacing.

## Typography
- Use the `<Typography>` component for all text elements.
- Apply text styles using `variant` prop (e.g., `variant="h1"`, `variant="body1"`, `variant="caption"`).
- Customize typography variants within the central theme object.
- **Do NOT** manually set `font-family`, `font-size`, or `font-weight` on text elements. Rely on the theme's typography scale.

## Color
- All colors must be defined in the `palette` key of the central MUI theme object.
- Use theme color references like `primary.main`, `background.paper`, or `text.secondary`.
- Apply colors using the `color` and `bgcolor` properties in the `sx` prop. Example: `sx={{ color: 'primary.main' }}`.
- **Do NOT** use hardcoded hex color values directly in components.

## Icons
- Use icons exclusively from the `@mui/icons-material` package.
- Icons should inherit size and color from the surrounding text context by default.
- Adjust icon styling using the `sx` prop when necessary. Example: `sx={{ fontSize: 20 }}`.