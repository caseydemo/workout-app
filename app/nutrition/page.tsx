import NutritionProvider from "./NutritionProvider";
import AddNutritionEntry from "./AddNutritionEntry";
import NutritionList from "./NutritionList";
import { getNutritionEntries } from "../actions/nutrition";
import styles from "./page.module.css";

/**
 * PRESENTATION NOTE: Server Component
 * ====================================
 * Next.js 13+ allows components to be server-side by default
 * Benefits:
 * - Fetch data on the server (faster, more secure)
 * - No client-side JavaScript for this component
 * - SEO-friendly
 * - Initial data loaded before page renders
 */
export default async function NutritionPage() {
	const entries = await getNutritionEntries();

	return (
		<main className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Nutrition Tracker</h1>
				<p className={styles.description}>
					Track your daily nutrition intake. Monitor calories, macros, and maintain a healthy diet.
				</p>
			</div>

			{/* 
				PRESENTATION NOTE: Provider Wrapping Pattern
				=============================================
				NutritionProvider wraps children to provide context
				Children can access state/actions via useNutrition hook
			*/}
			<NutritionProvider initialEntries={entries}>
				<AddNutritionEntry />
				<NutritionList />
			</NutritionProvider>
		</main>
	);
}