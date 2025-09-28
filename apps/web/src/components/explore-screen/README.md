# ExploreScreen Component

A **radically simplified** stock exploration interface with **zero prop drilling** and **self-contained components**.

## Architecture Philosophy

This component prioritizes **radical simplification**:

- **Zero Prop Drilling**: Components handle their own concerns
- **Self-Contained Logic**: StockGrid manages its own data, errors, and pagination
- **Minimal Main Component**: ExploreScreen is just layout + routing (16 lines!)
- **React Compiler Optimized**: Lets the compiler handle memoization automatically

## Structure

```text
explore-screen/
├── explore-screen.tsx          # Main component (clean & minimal)
├── components/                 # Co-located related components
│   ├── header.tsx              # Header with search + status badges (self-contained)
│   ├── stock-grid.tsx          # Grid + loading + pagination logic
│   ├── states.tsx              # EmptyState + ErrorState
│   ├── stock-card.tsx          # Individual stock card
│   └── stock-card-skeleton.tsx # Loading skeleton
├── hooks/                      # Component-specific hooks
│   └── use-search-with-url.ts  # Search logic with URL sync
├── types/index.ts             # TypeScript definitions
└── index.ts                   # Barrel exports

global-hooks/
└── use-infinite-scroll.ts     # Reusable scrolling logic
```

## Component Organization

### 🎯 **Smart Co-location Strategy**

Instead of over-engineering with multiple directories, related components are co-located:

- **`header.tsx`**: Self-contained header with search logic + status badges (no prop drilling)
- **`stock-grid.tsx`**: Includes grid + loading indicators + pagination (all stock display logic)
- **`states.tsx`**: EmptyState + ErrorState together (both are simple state displays)
- **`stock-card.tsx` + `stock-card-skeleton.tsx`**: Co-located since tightly coupled
- **`hooks/`**: Component-specific hooks like search logic with URL synchronization

### 📋 **Benefits of This Approach**

- ✅ **Reduces cognitive load** - fewer directories to navigate
- ✅ **Co-locates related logic** - things that change together live together
- ✅ **Eliminates over-abstraction** - no unnecessary separation
- ✅ **Easy to understand** - clear file purposes without complex hierarchy
- ✅ **Faster development** - less time spent navigating folder structures

## Performance Optimizations

### ⚡ **What Makes It Fast**

1. **Direct Hook Usage**: No context provider wrapping - hooks used directly in component
2. **React Compiler Friendly**: Simple patterns that the compiler can optimize automatically
3. **Minimal Component Boundaries**: Fewer React tree nodes = faster reconciliation
4. **Extracted Logic**: Scrolling logic moved to reusable `useInfiniteScroll` hook
5. **Smart Co-location**: Related logic bundled together reduces import overhead

### 🚫 **What We Avoided**

- ❌ Heavy Context Providers that force re-renders
- ❌ Manual `useMemo`/`useCallback` (React Compiler handles this)
- ❌ Over-abstracted directory structures
- ❌ Unnecessary state derivation (ViewState)
- ❌ Prop drilling through multiple components
- ❌ Unnecessary component boundaries

## Direct ts-pattern on React Query Status

```typescript
// No unnecessary state derivation - use React Query status directly
{
  match(status)
    .with(
      "pending",
      () => isEmpty && <StockGrid stocks={[]} isLoading={true} />
    )
    .with("error", () => error && <ErrorState error={error} />)
    .with("success", () =>
      isEmpty ? (
        <EmptyState />
      ) : (
        <StockGrid
          stocks={stocks}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
          onLoadMore={fetchNextPage}
        />
      )
    )
    .exhaustive();
}
```

## Maintained UX Features

- Infinite scrolling with intersection observer
- Real-time search with URL synchronization
- Network status indicators
- Responsive skeleton loading
- Error handling and empty states
- All accessibility features

## Usage

### Basic Usage

```typescript
import { ExploreScreen } from "@/components/explore-screen";

function App() {
  return <ExploreScreen />;
}
```

### Reusing Components (If Needed)

```typescript
import { Header, StockGrid } from "@/components/explore-screen";

function CustomView() {
  const { input, setInput, isPending } = useSearchWithURL();

  return (
    <div>
      <Header
        input={input}
        setInput={setInput}
        isPending={isPending}
        error={null}
      />
      {/* Custom content */}
    </div>
  );
}
```

## Performance Comparison

| Approach                   | Re-renders | Bundle Impact | Complexity          | Directory Count |
| -------------------------- | ---------- | ------------- | ------------------- | --------------- |
| **Current (Co-located)**   | ✅ Minimal | ✅ Small      | ✅ Simple           | ✅ 2 dirs       |
| Previous (Over-abstracted) | ❌ Many    | ❌ Larger     | ❌ Complex          | ❌ 4 dirs       |
| Original Monolith          | ✅ Minimal | ✅ Small      | ❌ Hard to maintain | ✅ 1 dir        |

## Key Insight

> **Co-location > Separation**
>
> Not everything needs its own directory. Related components that change together should live together. This reduces cognitive load and makes the codebase easier to navigate and understand.

The component now achieves the perfect balance: **organized without being over-engineered**, **performant without sacrificing maintainability**.
