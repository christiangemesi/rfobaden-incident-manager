# Styled Components

Styling is handled using [styled-components](https://styled-components.com/),
Reusable styled components are stored the same way as normal components, using their own file.
Styled components exclusively used by a single component can be stored in the  same file as that component, with their definition at the end of the file:

```ts
interface Props {
  ...
}
 
const MyComponent: React.VFC<Props> = ({ ... }) => {
  ...
}
export default MyComponent
 
...
 
const MyStyledComponent = styled.div`
  ...
`
```

## Naming

Reusable styled components follow the same naming rules as normal components.
Locally stored styled components do not have to follow strict naming rules. They should be named in accordance to their purpose:

- `SubmitButton` is a button used for submitting.
- `PaddedSection` is a section with padding.

Components that cannot be described in a comprehensible or otherwise meaningful name can simply be prefixed with `Styled`:

- `StyledButton` is a locally used styled button.
- `StyledSection` is a locally used styled section.

> Be aware that this naming scheme can easily lead to confusion if not  applied carefully - prefer naming using the components purpose over  simple prefixing!

## (Re-)Styling Components

> The code shown here is simplified and does not necessarily represent the actual implementation.

`styled-components` allows us to style any kind of component. For example, we can further style our `UiButton` like this:

```ts
const RedButton = styled(UiButton)`
  color: red;
`
```

For this to work, the component needs to define the prop `className?: string`, which then has to be passed to the actual HTML element rendered by the component. For easier implementation, we use the `StyledProps` interface. This also includes a `style?: CSSProperties` prop, which allows for inline styling.

```tsx
interface Props extends StyledProps {
  ...
}
    
const UiButton: React.VFC<Props> = ({ className, style, ... }) => {
  return (
    <button className={className} style={style} />
  )
}
export default styled(UiButton)``
```

Note the export statement - the `styled` function call is required to make the TypeScript compiler happy.

