import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

interface StarRatingProps {
	rating?: number;
	max?: number;
}

export const StarRating = component$<StarRatingProps>(
	({ rating = 5, max = 5 }) => {
		const t = inlineTranslate();
		return (
			<div
				class="rating rating-sm gap-0.5"
				data-testid="review-rating"
				role="img"
				aria-label={t(
					"app.reviews.rating_label@@{{rating}} out of {{max}} stars",
					{ rating, max },
				)}
			>
				{Array.from({ length: max }, (_, i) => (
					<div
						key={i}
						class="mask mask-star-2 size-4 bg-accent"
						aria-hidden="true"
						aria-current={i + 1 === rating ? "true" : undefined}
					/>
				))}
			</div>
		);
	},
);
