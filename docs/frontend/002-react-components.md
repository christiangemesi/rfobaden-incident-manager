# React Components

Reusable React components are stored in the `components` folder. Normally, every file exports only a single component.

## Directory Structure

Each file defines either a general-purpose or model-specific component.

- `Ui` contains general-purpose components.
- `Page` contains page layout components.
- Every other directory is named after a data type (mostly API models), and contains components related to that data type.

Most component files have their own directory. The components themselves are named after all directories in which they are nested. A few examples:

- `Ui/Button/UiButton.tsx` contains a shared, general-purpose button component.
- `Page/Header/PageHeader.tsx` renders the header seen on most pages.
- `Report/Form/ReportForm.tsx` renders a form which can create and edit `Report` entities.
- `Incident/List/Item/IncidentListItem.tsx` renders a list item for a single `Incident` entity.

## Component Definitions

All components are written as _functional components_. State is handled using [React hooks](https://reactjs.org/docs/hooks-intro.html).

```ts
interface Props {
  ...
}
 
const MyComponent: React.VFC<Props> = ({ ... }) => {
  ...
}
export default MyComponent
```

- The properties of a component are defined in a separate `Props` interface.
- Use the `React.VFC` type to add type checking to your component.
- Components are always exported as `default`.
- `props` are always destructured. 

### Event Handlers

> The code shown here is simplified and does not necessarily represent the actual implementation.

Event handlers are defined as `on*` Props. For example, the `UiButton` has the following event handler prop, amongst others:
```ts
interface Props {
  /**
   * Click event handler.
   */
  onClick?: (event: MouseEvent) => void
}
```

When using event handlers, we rename them to `handle*`, since this reads better and makes their use clearer:

```ts
const UiButton: React.VFC<Props> = ({ onClick: handleClick }) => { ... }
```

