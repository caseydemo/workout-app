# Cardio: Context + Reducer + Client Provider (Plan & examples)

Goal
- Keep app/cardio/page.tsx as a server component that fetches initial data via server action.
- Move client-only state (context, reducer, useRef, useState) into a Client Provider and small client components.
- Use optimistic updates and server actions for mutations.

Files to create later
- CardioProvider.tsx (client): context + reducer + addWorkout using server action
- CardioList.tsx (client): reads context state
- AddWorkout.tsx (client): simple form using useState and useRef
- page.tsx (server): fetch initial data and wrap provider

Example: page.tsx (server)
```tsx
// ...existing code...
import CardioProvider from "./CardioProvider";
import CardioList from "./CardioList";
import AddWorkout from "./AddWorkout";
import { getCardioWorkouts } from "../actions/cardio";

export default async function Page() {
  const workouts = await getCardioWorkouts();

  return (
    <main>
      <h1>Cardio Workouts</h1>
      <CardioProvider initialWorkouts={workouts}>
        <AddWorkout />
        <CardioList />
      </CardioProvider>
    </main>
  );
}