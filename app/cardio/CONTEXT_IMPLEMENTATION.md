# Cardio: Context + Reducer + Client Provider (Plan & examples)

Goal
- Keep app/cardio/page.tsx as a server component that fetches initial data via server action.
- Move client-only state (context, reducer, useRef, useState) into a Client Provider and small client components.
- Use optimistic updates and server actions for mutations.

Files implemented
- CardioProvider.tsx (client): context + reducer + addWorkout using server action
- CardioList.tsx (client): reads context state
- AddWorkout.tsx (client): simple form using useState and useRef
- page.tsx (server): fetch initial data and wrap provider

Notes
- Keep the page a server component and pass server-fetched initial data to the provider.
- Import your actual server action signatures from app/actions/cardio and adapt types.
- Used ICardio from models/Cardio.ts for types.
- Optimistic updates with useRef to prevent duplicates.
- TODO: Add userId from auth, handle errors in UI.