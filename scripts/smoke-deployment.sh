#!/usr/bin/env bash
set -euo pipefail

base_url="${1:?usage: smoke-deployment.sh BASE_URL}"
base_url="${base_url%/}"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

curl_args=(
	--fail
	--show-error
	--silent
	--connect-timeout 5
	--max-time 20
	--retry 3
	--retry-all-errors
	--retry-delay 2
	--header "Cache-Control: no-cache"
)

curl "${curl_args[@]}" "${base_url}/readyz" > /dev/null

if [[ "${SMOKE_SKIP_DEPENDENCY:-false}" != "true" ]]; then
	curl "${curl_args[@]}" "${base_url}/dependencyz" > /dev/null
fi

for path in /en-BE/ /fr-BE/pricelist/; do
	name="$(printf '%s' "$path" | tr '/-' '__')"
	curl "${curl_args[@]}" \
		--dump-header "${work_dir}/${name}.headers" \
		--output "${work_dir}/${name}.body" \
		"${base_url}${path}"

	grep --fixed-strings --quiet "Aesthetic Lab" "${work_dir}/${name}.body"
	grep --extended-regexp --ignore-case --quiet \
		'^x-content-type-options:[[:space:]]*nosniff' \
		"${work_dir}/${name}.headers"
done
