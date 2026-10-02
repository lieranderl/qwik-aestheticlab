import { $, component$, useSignal } from "@qwik.dev/core";
import { _ } from "compiled-i18n";

interface ExpandableTextProps {
	text: string;
	maxLength?: number;
	class?: string;
}

export const ExpandableText = component$<ExpandableTextProps>(
	({ text, maxLength = 140, class: className }) => {
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
						{isExpanded.value ? _`common.read_less` : _`common.read_more`}
					</button>
				) : null}
			</div>
		);
	},
);
