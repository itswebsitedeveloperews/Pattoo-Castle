# Header Submenu Design

## Goal

Add Contentful-powered submenu support to the site header.

## Requirements

- Read each header menu item's `subMenu` reference array from Contentful.
- Render desktop submenus on hover and keyboard focus.
- Render mobile submenus on click.
- On mobile, only one submenu can be open at a time.
- Preserve current behavior for menu items without submenus.

## Design

`getHeaderContent()` normalizes header menu entries into `{ name, url, subMenuItems }`. `subMenuItems` contains normalized `{ name, url }` objects from the referenced Menu entries and filters out empty references.

`HeaderMenuLink` renders a plain anchor when no submenu exists. When submenu items exist, it renders a wrapper with the parent link and nested submenu links. Desktop behavior is CSS-driven through hover and focus-within.

`SiteHeader` keeps mobile submenu state with the open menu index. Mobile `HeaderMenuLink` instances receive `isOpen` and `onToggle` props, so clicking a parent with children opens it and closes any other open submenu.

## Testing

Add script-level validation that checks Contentful submenu mapping, desktop submenu markup, and mobile accordion state wiring. Run the targeted validation, lint, and production build.
