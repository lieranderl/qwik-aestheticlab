import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import {
	HiArrowUpOnSquareOutline,
	HiEnvelopeOutline,
} from "@qwikest/icons/heroicons";
import { inlineTranslate } from "qwik-speak";
import { supabaseBrowser } from "~/shared/supabase-client";

type Client = { email: string; name: string | null };

export interface EmailInputProps {
	emailSignal: Signal<string>;
	readonly?: boolean;
	isAdmin?: boolean;
	changeEmailByAdmin?: Signal<string>;
	signOut?: ActionStore<{ success: boolean }, Record<string, unknown>, true>;
}

export const EmailInput = component$(
	({
		emailSignal,
		readonly,
		isAdmin,
		changeEmailByAdmin,
		signOut,
	}: EmailInputProps) => {
		const t = inlineTranslate();
		const searchTerm = useSignal("");
		const clients = useSignal<Client[]>([]);
		const dropdownOpen = useSignal(false);
		const selectedIndex = useSignal(0);
		const page = useSignal(0);
		const hasMore = useSignal(true);
		const isLoading = useSignal(false);
		const debounceInput = useSignal("");

		const fetchClients = $(async (reset = false) => {
			if (isLoading.value || (!hasMore.value && !reset)) return;
			isLoading.value = true;

			const currentPage = reset ? 0 : page.value;
			const from = currentPage * 10;
			const to = from + 9;

			const { data } = await supabaseBrowser
				.from("clients")
				.select("email, name")
				.or(
					`email.ilike.%${searchTerm.value}%,name.ilike.%${searchTerm.value}%`,
				)
				.order("email", { ascending: true })
				.range(from, to);

			const newClients = (data ?? []).map((d) => ({
				email: d.email,
				name: d.name || null,
			}));

			if (reset) {
				clients.value = newClients;
				page.value = 1;
			} else {
				clients.value = [...clients.value, ...newClients];
				page.value++;
			}

			hasMore.value = newClients.length === 10;
			isLoading.value = false;
		});

		// Debounced input search
		useTask$(({ track }) => {
			if (!isAdmin) return;
			const val = track(() => debounceInput.value);
			const timeout = setTimeout(() => {
				searchTerm.value = val;
				fetchClients(true);
			}, 500);
			return () => clearTimeout(timeout);
		});

		const handleInput = $((e: Event) => {
			const val = (e.target as HTMLInputElement).value;
			emailSignal.value = val;
			debounceInput.value = val;
			selectedIndex.value = 0;
		});

		const handleFocus = $(() => {
			fetchClients(true);
			dropdownOpen.value = true;
		});

		const handleBlur = $((e: Event) => {
			dropdownOpen.value = false;
			const target = e.target as HTMLInputElement;
			if (changeEmailByAdmin) changeEmailByAdmin.value = target.value;
		});

		const applyEmailChange = $((value: string) => {
			if (changeEmailByAdmin) changeEmailByAdmin.value = value;
			dropdownOpen.value = false;
		});

		const handleKeyDown = $((e: KeyboardEvent) => {
			if (!dropdownOpen.value || clients.value.length === 0) return;

			if (e.key === "ArrowDown") {
				selectedIndex.value = (selectedIndex.value + 1) % clients.value.length;
			} else if (e.key === "ArrowUp") {
				selectedIndex.value =
					(selectedIndex.value - 1 + clients.value.length) %
					clients.value.length;
			} else if (e.key === "Enter") {
				const selected = clients.value[selectedIndex.value];
				emailSignal.value = selected.email;
				applyEmailChange(selected.email);
			}
		});

		const handleScroll = $(async (e: Event) => {
			const container = e.target as HTMLUListElement;
			const nearBottom =
				container.scrollTop + container.clientHeight >=
				container.scrollHeight - 20;

			if (nearBottom && hasMore.value && !isLoading.value) {
				await fetchClients(false);
			}
		});

		return (
			<div class="w-full relative">
				<div class="flex gap-2 items-center">
					<label
						class={
							readonly
								? "input input-primary validator w-full pointer-events-none select-none"
								: "input input-primary validator w-full"
						}
					>
						<HiEnvelopeOutline class="text-primary w-4 h-4" />
						<input
							id="email-input"
							name="email"
							type="email"
							class="bg-transparent w-full focus:outline-none"
							placeholder={t(
								"app.auth.email_placeholder@@Enter your email address",
							)}
							bind:value={emailSignal}
							readOnly={readonly}
							onInput$={handleInput}
							onKeyDown$={isAdmin ? handleKeyDown : undefined}
							onBlur$={isAdmin ? handleBlur : undefined}
							onFocus$={isAdmin ? handleFocus : undefined}
						/>
					</label>

					{signOut && (
						<button
							type="button"
							class="btn btn-primary min-w-16"
							disabled={signOut.isRunning}
							onClick$={() => signOut.submit()}
						>
							{signOut.isRunning ? (
								<span class="loading loading-spinner me-2 loading-md" />
							) : (
								<>
									<HiArrowUpOnSquareOutline class="w-4 h-4 rotate-90" />
									<span class="hidden sm:block">
										{t("app.auth.signout@@Sign out")}
									</span>
								</>
							)}
						</button>
					)}
				</div>

				{dropdownOpen.value && (
					<ul
						onScroll$={handleScroll}
						class="absolute mt-2 z-10 w-full bg-base-200 rounded-box shadow max-h-48 overflow-y-auto overflow-x-hidden flex flex-col"
					>
						{clients.value.map((client, i) => (
							<li
								key={client.email}
								class={
									i === selectedIndex.value
										? "bg-neutral p-2 cursor-pointer"
										: "p-2 cursor-pointer"
								}
								onMouseDown$={() => {
									emailSignal.value = client.email;
									applyEmailChange(client.email);
								}}
								onMouseOver$={() => {
									selectedIndex.value = i;
								}}
							>
								<div class="flex flex-col">
									{client.name && (
										<span class="font-medium">{client.name}</span>
									)}
									<span class="text-sm text-accent italic">{client.email}</span>
								</div>
							</li>
						))}
						{isLoading.value && (
							<li class="text-center text-xs text-gray-400 py-2">
								{t("app.auth.loading@@Loading…")}
							</li>
						)}
					</ul>
				)}

				<div class="validator-hint hidden">
					{t("app.auth.email_hint@@Please enter a valid email address")}
				</div>
			</div>
		);
	},
);
