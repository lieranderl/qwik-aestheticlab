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
						"text-pretty font-main text-sm leading-relaxed text-base-content/80",
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
						class="link link-hover inline-flex min-h-11 w-fit items-center font-main text-[0.6875rem] font-semibold uppercase tracking-[0.16em] underline-offset-4"
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
