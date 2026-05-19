# Theming & Customization

TrustConnect's modal UI can be customized at two levels: theme configuration for quick color scheme changes, or full component ejection for complete control over every element.

## Theme configuration

Set the theme via the `theme` prop on `TrustConnectProvider`:

```tsx
<TrustConnectProvider
    config={{ namespaces: [...], services: [...] }}
    theme="dark"
>
    {children}
</TrustConnectProvider>
```

| Value | Description |
|-------|-------------|
| `'auto'` | Follows the user's system preference (default) |
| `'light'` | Light theme |
| `'dark'` | Dark theme |

### Programmatic theme control

Use the `useTheme` hook to read and change the theme at runtime:

```tsx
import { useTheme } from '@trustwallet/connect-react'

function ThemeToggle() {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

    return (
        <div>
            <p>Current: {resolvedTheme}</p>
            <button onClick={toggleTheme}>Toggle</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('auto')}>Auto</button>
        </div>
    )
}
```

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `string` | The configured theme value (`'auto'`, `'light'`, or `'dark'`) |
| `resolvedTheme` | `string` | The actual active theme after resolving `'auto'` (`'light'` or `'dark'`) |
| `setTheme` | `function` | Set the theme to `'auto'`, `'light'`, or `'dark'` |
| `toggleTheme` | `function` | Toggle between light and dark themes |

## Full UI customization

For complete control over every UI element, eject the TrustConnect components into your project:

```bash
npx @trustwallet/connect-react add
```

You can specify a custom output path:

```bash
npx @trustwallet/connect-react add --path ./src/components/trust
```

This copies the React components and their styles into your project so you can customize everything locally. The CLI also installs two additional dependencies automatically:

- `@trustwallet/connect-ui-logic` — headless state logic used by the UI components
- `cuer` — QR code rendering

After ejecting, import `TrustConnectProvider` and other hooks directly from your local TrustConnect components folder instead of `@trustwallet/connect-react`.

> **Note:** After ejecting, you are responsible for maintaining the components. Updates to the SDK's built-in UI will not automatically apply to ejected components.
