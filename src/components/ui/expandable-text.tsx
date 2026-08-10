import { $, component$, useSignal } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

interface ExpandableTextProps {
	text: string;
	maxLength?: number;
	class?: string;
}

export const ExpandableText = component$<ExpandableTextProps>(
	({ text, maxLength = 140, class: className }) => {
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const hasLongText = text.length > maxLength;

		return (
			<div>
				<p
					class={[
						"text-pretty font-main text-sm leading-relaxed text-base-content/75",
						isExpanded.value ? "" : "line-clamp-3",
						className,
					]}
				>
					{text}
				</p>
				{hasLongText ? (
					<button
						type="button"
						onClick$={$(() => {
							isExpanded.value = !isExpanded.value;
						})}
						class="btn btn-ghost btn-sm min-h-11 w-fit rounded-full px-0 font-main uppercase tracking-wider text-secondary"
						aria-expanded={isExpanded.value}
					>
						{isExpanded.value
							? t("app.common.read_less@@Read Less")
							: t("app.common.read_more@@Read More")}
					</button>
				) : null}
			</div>
		);
	},
);
