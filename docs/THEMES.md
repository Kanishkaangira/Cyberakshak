# Application themes

CyberAkshak supports a light theme and a dark theme using the same semantic color
tokens. The existing light palette remains the default and is also exported as
`COLORS` for compatibility with static content.

## Switching themes

1. Run the app on an Android emulator or device with `npm start` and
   `npm run android`.
2. Open **Profile** and find **Dark theme** under **Preferences**. The preference
   is saved locally and restored on the next launch.
3. Visit **Home** and the other tabs to inspect the app in dark mode. Switch the
   setting off to preview the unchanged light theme.

The profile's Preferences section is the app's settings surface; the toggle is
deliberately located there rather than introducing a separate settings screen.
The app applies a short fade during theme changes and updates the status bar,
navigation chrome, and palette-aware screens, including backgrounds, cards,
text, borders, icons, and semantic status colors. The chatbot screen remains on
its existing self-contained palette; its source is intentionally isolated from
theme changes.

## Extending the palette

1. Add semantic color tokens to both `lightTheme` and `darkTheme` in
   `src/constants/theme.js`. Keep token names aligned between the two objects.
2. Use the theme context (`useTheme`) for runtime colors and
   `useThemeStyles(createStyles)` for `StyleSheet` values that depend on the
   active palette.
3. Keep layout, spacing, and typography independent from theme colors. Prefer
   existing semantic tokens such as `bg`, `surface`, `ink`, `muted`, `brand`,
   `line`, `green`, `orange`, and `red` over literal color values.
4. For a new palette-dependent screen, set its `StatusBar` style from `isDark`
   and pass the corresponding theme to any navigation or platform UI it owns.
5. Add any new shared tokens to both themes and verify contrast for normal text
   and interactive controls in both palettes.

`SIZES` remains theme-independent. `COLORS` is retained as an alias of
`lightTheme` so existing static-data consumers continue to see the original
light-theme values.
