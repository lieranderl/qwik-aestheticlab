import { component$ } from "@builder.io/qwik";

interface StarRatingProps {
	rating?: number;
	max?: number;
}

export const StarRating = component$<StarRatingProps>(
	({ rating = 5, max = 5 }) => {
		return (
			<div
				class="rating rating-sm gap-0.5"
				data-testid="review-rating"
				role="img"
				aria-label={`${rating} out of ${max} stars`}
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
