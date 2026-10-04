#!/usr/bin/env bash
set -euo pipefail

previous_url="${1:?usage: legacy-image-baseline.sh PREVIOUS_URL CANDIDATE_URL}"
candidate_url="${2:?usage: legacy-image-baseline.sh PREVIOUS_URL CANDIDATE_URL}"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT
curl_args=(--silent --show-error --connect-timeout 5 --max-time 20 --retry 3 --retry-all-errors --retry-delay 2)

# Run before splitting traffic. Only the old revision's own broken image URLs
# can qualify, and only if the candidate repairs them with byte-identical data
# already served under the canonical URL by the old revision.
for page in /en-BE/ /fr-BE/pricelist/; do
	curl "${curl_args[@]}" --fail "${previous_url%/}${page}" >> "$work_dir/html"
done
grep --only-matching --extended-regexp \
	'/assets/[A-Za-z0-9_-]{8}-lazer1\.webp' "$work_dir/html" \
	| sort -u > "$work_dir/legacy-paths" || true

while IFS= read -r path; do
	previous_status=$(curl "${curl_args[@]}" --output /dev/null \
		--write-out '%{http_code}' "${previous_url%/}${path}")
	if [[ "$previous_status" == "200" ]]; then continue; fi
	[[ "$previous_status" == "404" ]] || exit 1
	canonical_path="${path%-lazer1.webp}-universal.webp"
	previous_result=$(curl "${curl_args[@]}" --output "$work_dir/previous" \
		--write-out '%{http_code} %{content_type}' "${previous_url%/}${canonical_path}")
	candidate_result=$(curl "${curl_args[@]}" --output "$work_dir/candidate" \
		--write-out '%{http_code} %{content_type}' "${candidate_url%/}${path}")
	if [[ "$previous_result" == "200 image/webp" && "$candidate_result" == "200 image/webp" ]] \
		&& cmp -s "$work_dir/previous" "$work_dir/candidate"; then
		printf '%s\n' "$path"
	fi
done < "$work_dir/legacy-paths"
