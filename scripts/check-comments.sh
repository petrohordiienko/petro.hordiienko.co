#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

usage() {
  echo "usage: $0 <path>..." >&2
  echo "       $0 --self-test" >&2
  exit 2
}

awk_prog='
function ltrim(s) { sub(/^[ \t\r]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)) }

function esc(s,    r, i, c, special) {
  r = ""
  special = "\\.*+?()[]{}|^$"
  for (i = 1; i <= length(s); i++) {
    c = substr(s, i, 1)
    if (index(special, c) > 0) r = r "\\" c
    else r = r c
  }
  return r
}

function even_quotes(line, uptoPos, ch,    i, c, cnt, inEsc) {
  cnt = 0
  inEsc = 0
  for (i = 1; i < uptoPos; i++) {
    c = substr(line, i, 1)
    if (inEsc) { inEsc = 0; continue }
    if (c == "\\") { inEsc = 1; continue }
    if (c == ch) cnt++
  }
  return (cnt % 2 == 0)
}

function outside_strings(line, pos) {
  return (even_quotes(line, pos, "\"") && even_quotes(line, pos, "\047") && even_quotes(line, pos, "`"))
}

function strip_symbols(s,    t) {
  t = s
  sub(/^[ \t]*[#\/*!-]+/, "", t)
  return trim(t)
}

function is_tagged(s,    t) {
  t = strip_symbols(s)
  return (t ~ /^(WORKAROUND|SECURITY|INVARIANT):/ || t ~ /^TODO\(([A-Z][A-Z0-9]*-[0-9]+|#[0-9]+)\):/)
}

function is_license_start(s,    t, lt) {
  t = strip_symbols(s)
  lt = tolower(t)
  return (lt ~ /^copyright([ \t]|\(|$)/ || lt ~ /^spdx-license-identifier(:|[ \t]|$)/)
}

function is_suppressed(t,    lt, rest) {
  lt = tolower(t)

  if (lt ~ /^nolint(:|[ \t]|$)/) {
    rest = t
    if (match(lt, /^nolint(:[ \t]*[a-z0-9_]+(,[ \t]*[a-z0-9_]+)*)?/)) rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /\/\/[ \t]*[^ \t]/)
  }
  if (lt ~ /^noqa(:|[ \t]|$)/) {
    rest = t
    if (match(lt, /^noqa(:[ \t]*[a-z0-9]+(,[ \t]*[a-z0-9]+)*)?/)) rest = substr(t, RSTART + RLENGTH)
    return (trim(rest) != "")
  }
  if (lt ~ /^eslint-disable(-next-line|-line)?([ \t]|$)/) {
    match(lt, /^eslint-disable(-next-line|-line)?/)
    rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /--[ \t]*[^ \t]/)
  }
  if (lt ~ /^@ts-expect-error([ \t]|$)/) {
    match(lt, /^@ts-expect-error/)
    rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /--[ \t]*[^ \t]/)
  }
  if (lt ~ /^@ts-ignore([ \t]|$)/) {
    match(lt, /^@ts-ignore/)
    rest = substr(t, RSTART + RLENGTH)
    return (trim(rest) != "")
  }
  if (lt ~ /^type:[ \t]*ignore([ \t\[]|$)/) {
    rest = t
    if (match(lt, /^type:[ \t]*ignore(\[[a-z0-9_,-]+\])?/)) rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /^[ \t]*#[ \t]*[^ \t]/)
  }
  if (lt ~ /^pylint:[ \t]*disable(-next)?([ \t=]|$)/) {
    rest = t
    if (match(lt, /^pylint:[ \t]*disable(-next)?(=[a-z0-9_-]+(,[ \t]*[a-z0-9_-]+)*)?/)) rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /^[ \t]*#[ \t]*[^ \t]/)
  }
  if (lt ~ /^prettier-ignore([ \t]|$)/) {
    match(lt, /^prettier-ignore/)
    rest = substr(t, RSTART + RLENGTH)
    return (trim(rest) != "")
  }
  if (lt ~ /^biome-ignore(-all|-start|-end)?([ \t]|$)/) {
    return (t ~ /^[Bb]iome-ignore(-all|-start|-end)?[ \t]+[A-Za-z0-9\/]+(\([^)]*\))?:[ \t]*[^ \t]/)
  }
  if (lt ~ /^shellcheck[ \t]+(source|source-path|shell)=/) return 1
  if (lt ~ /^shellcheck[ \t]+(disable|enable)=/) {
    rest = t
    if (match(lt, /^shellcheck[ \t]+(disable|enable)=[a-z0-9,]+/)) rest = substr(t, RSTART + RLENGTH)
    return (rest ~ /^[ \t]*#[ \t]*[^ \t]/)
  }
  if (lt ~ /^yaml-language-server:/) return 1
  if (lt ~ /^istanbul ignore([ \t]|$)/) {
    rest = t
    if (match(lt, /^istanbul ignore([ \t]+(next|if|else))?/)) rest = substr(t, RSTART + RLENGTH)
    return (trim(rest) != "")
  }
  if (lt ~ /^c8 ignore([ \t]|$)/) {
    rest = t
    if (match(lt, /^c8 ignore([ \t]+(next|start|stop)([ \t]+[0-9]+)?)?/)) rest = substr(t, RSTART + RLENGTH)
    return (trim(rest) != "")
  }
  return 0
}

function is_exempt(s, lineno, trailing,    t) {
  if (trim(s) == "") return 1
  if (lineno == 1 && s ~ /^!/) return 1
  if (MAKE && trailing && s ~ /^[#!]/) return 1
  t = strip_symbols(s)
  if (t ~ /^go:[A-Za-z]/) return 1
  if (t ~ /^<reference[ \t]/) return 1
  if (t ~ /^@type[ \t]*\{.*\}$/) return 1
  if (t ~ /^\+build([ \t]|$)/) return 1
  if (t ~ /^\+goose([ \t]|$)/) return 1
  if (t ~ /^[A-Za-z_][A-Za-z0-9_]*:(begin|end|line)$/) return 1
  if (t ~ /^coding:[ \t]*[A-Za-z0-9_.-]+([ \t]*-\*-)?[ \t]*$/) return 1
  if (!seen_code && is_license_start(s)) return 1
  if (lineno <= 5 && t ~ /^(syntax|escape|check)=/) return 1
  return is_suppressed(t)
}

function allowed(s, lineno, trailing) { return (is_tagged(s) || is_exempt(s, lineno, trailing)) }

function report(lineno) {
  violations++
  printf "%s:%d: untagged or over-length comment\n", FILE, lineno
}

function detect_heredoc(s,    t, pos, rest) {
  t = ltrim(s)
  if (substr(t, 1, 1) == "#") return
  pos = index(s, "<<")
  if (pos == 0 || substr(s, pos, 3) == "<<<") return
  rest = substr(s, pos + 2)
  hd_tab = 0
  if (substr(rest, 1, 1) == "-") { hd_tab = 1; rest = substr(rest, 2) }
  rest = ltrim(rest)
  if (rest ~ /^[\047"]/) rest = substr(rest, 2)
  if (match(rest, /^[A-Za-z_][A-Za-z0-9_]*/)) {
    hd_delim = substr(rest, 1, RLENGTH)
    hd_start = 1
  }
}

function mark_code(s) {
  if (trim(s) != "") seen_code = 1
}

function note_run_line(content, has_content) {
  if (!run_active) {
    run_active = 1
    run_start = NR
    run_ok = allowed(content, NR, 0)
    run_first_tagged = is_tagged(content)
    run_first_licensed = (!seen_code && is_license_start(content))
    if (run_first_licensed) run_ok = 1
    run_len = has_content ? 1 : 0
  } else if (has_content) {
    run_len++
    if (!run_first_tagged && !run_first_licensed && !allowed(content, NR, 0)) run_ok = 0
  }
}

function note_block_line(content) {
  if (trim(content) == "") return
  block_len++
  if (!block_checked) {
    block_ok = allowed(content, block_start, 0)
    block_first_tagged = is_tagged(content)
    block_first_licensed = (!seen_code && is_license_start(content))
    if (block_first_licensed) block_ok = 1
    block_checked = 1
  } else if (!block_first_tagged && !block_first_licensed && !allowed(content, block_start, 0)) {
    block_ok = 0
  }
}

function flush_run() {
  if (run_active) {
    if (!run_ok) report(run_start)
    else if (run_first_tagged && run_len > 3) report(run_start)
  }
  run_active = 0
  run_ok = 1
  run_first_tagged = 0
  run_first_licensed = 0
  run_start = 0
  run_len = 0
}

BEGIN {
  violations = 0
  in_block = 0
  block_ok = 1
  block_checked = 0
  block_start = 0
  block_len = 0
  run_active = 0
  run_ok = 1
  run_first_tagged = 0
  run_first_licensed = 0
  run_start = 0
  run_len = 0
  block_first_tagged = 0
  block_first_licensed = 0
  seen_code = 0
  hd_start = 0
  hd_active = 0
  lc_re = (LC != "") ? esc(LC) : ""
  bc_re = (BC != "") ? esc(BC) : ""
  bo_re = (BO != "") ? esc(BO) : ""
}

{
  if (hd_start) { hd_active = 1; hd_start = 0 }
  if (hd_active) {
    hd_line = $0
    sub(/\r$/, "", hd_line)
    if (hd_tab) sub(/^\t+/, "", hd_line)
    if (hd_line == hd_delim) hd_active = 0
    next
  }
  line = $0
  if (SH && !in_block) detect_heredoc(line)

  if (in_block) {
    pos = match(line, bc_re)
    if (pos > 0) {
      content = substr(line, 1, pos - 1)
      note_block_line(content)
      if (!block_ok || (block_first_tagged && block_len > 3)) report(block_start)
      in_block = 0
      line = substr(line, pos + length(BC))
    } else {
      note_block_line(line)
      next
    }
  }

  lc_pos = 0
  bo_pos = 0
  if (lc_re != "" && match(line, "(^|[ \t])" lc_re)) {
    cand = (RLENGTH > length(LC)) ? RSTART + 1 : RSTART
    if (outside_strings(line, cand)) lc_pos = cand
  }
  if (bo_re != "" && match(line, bo_re) && outside_strings(line, RSTART)) bo_pos = RSTART

  if (bo_pos > 0 && (lc_pos == 0 || bo_pos < lc_pos)) {
    flush_run()
    mark_code(substr(line, 1, bo_pos - 1))
    rest_line = substr(line, bo_pos + length(BO))
    close_pos = match(rest_line, bc_re)
    if (close_pos > 0) {
      content = substr(rest_line, 1, close_pos - 1)
      if (!allowed(content, NR, 0)) report(NR)
    } else {
      in_block = 1
      block_start = NR
      block_checked = 0
      block_ok = 1
      block_first_tagged = 0
      block_first_licensed = 0
      block_len = 0
      note_block_line(rest_line)
    }
    next
  }

  if (lc_pos > 0) {
    content = substr(line, lc_pos + length(LC))
    is_full = (trim(substr(line, 1, lc_pos - 1)) == "")
    has_content = (trim(content) != "")
    if (is_full) {
      note_run_line(content, has_content)
    } else {
      flush_run()
      mark_code(substr(line, 1, lc_pos - 1))
      if (!allowed(content, NR, 1)) report(NR)
    }
    next
  }

  flush_run()
  mark_code(line)
}

END {
  flush_run()
  exit (violations > 0) ? 1 : 0
}
'

syntax_for() {
  local f="$1" base
  base="$(basename -- "$f")"
  case "$base" in
    Makefile|*.mk|*.makefile)
      printf '#|||1'
      return 0
      ;;
  esac
  case "$base" in
    Dockerfile|Dockerfile.*)
      printf '#|||0'
      return 0
      ;;
  esac
  case "$f" in
    *.sh | *.bash | *.toml) printf '#|||0' ;;
    *.yml | *.yaml | *.tpl) printf '#|{{/*|*/}}|0' ;;
    *.go) printf '//|/*|*/|0' ;;
    *.py) printf '#|||0' ;;
    *.ts | *.tsx | *.js | *.mjs | *.cjs | *.mts) printf '//|/*|*/|0' ;;
    *.dart) printf '//|/*|*/|0' ;;
    *.sql) printf -- '--|/*|*/|0' ;;
    *) return 1 ;;
  esac
}

check_file() {
  local f="$1" spec lc bo bc make sh=0
  spec="$(syntax_for "$f")" || return 0
  IFS='|' read -r lc bo bc make <<<"$spec"
  case "$f" in *.sh | *.bash) sh=1 ;; esac
  if [[ "$bo" == '{{/*' ]]; then
    sed -E 's#\{\{-?[[:space:]]*/\*#{{/*#g; s#\*/[[:space:]]*-?\}\}#*/}}#g' "$f" |
      awk -v LC="$lc" -v BO="$bo" -v BC="$bc" -v MAKE="$make" -v SH="$sh" -v FILE="$f" "$awk_prog" -
  else
    awk -v LC="$lc" -v BO="$bo" -v BC="$bc" -v MAKE="$make" -v SH="$sh" -v FILE="$f" "$awk_prog" "$f"
  fi
}

collect_files() {
  local path="$1"
  if [[ -f "$path" ]]; then
    printf '%s\n' "$path"
    return 0
  fi
  [[ -d "$path" ]] || { echo "no such file or directory: $path" >&2; return 2; }
  find "$path" -type f \( \
    -name '*.go' -o -name '*.py' -o -name '*.ts' -o -name '*.tsx' -o -name '*.js' \
    -o -name '*.mjs' -o -name '*.cjs' -o -name '*.mts' -o -name '*.dart' \
    -o -name '*.sql' -o -name 'Makefile' -o -name '*.mk' -o -name '*.makefile' \
    -o -name '*.sh' -o -name '*.bash' -o -name '*.yml' -o -name '*.yaml' -o -name '*.toml' -o -name '*.tpl' \
    -o -name 'Dockerfile' -o -name 'Dockerfile.*' \
    \) -not -path '*/vendor/*' -not -path '*/node_modules/*' -not -path '*/.git/*' \
    -not -path '*/.go/*' -not -path '*/.pub-cache/*' -not -path '*/.uv-cache/*' -not -path '*/.bun-cache/*' \
    -not -path '*/.pytest_cache/*' -not -path '*/.ruff_cache/*' -not -path '*/.mypy_cache/*' \
    -not -path '*/.security-reports/*' -not -path '*/.ci-common/*' -not -path '*/.flutter-sdk/*' \
    -not -path '*/.venv/*' -not -path '*/dist/*' -not -path '*/build/*' -not -path '*/.next/*' \
    -not -path '*/.dart_tool/*' -not -path '*/config/semgrep/*' \
    -not -path '*/coverage/*' -not -name 'next-env.d.ts' \
    -not -name '*.freezed.dart' -not -name '*.g.dart' -not -name '*.mocks.dart'
}

run_check() {
  local -a paths=("$@")
  local status=0 path file list
  for path in "${paths[@]}"; do
    list="$(mktemp)"
    if ! collect_files "$path" >"$list"; then
      status=1
      rm -f "$list"
      continue
    fi
    while IFS= read -r file; do
      [[ -n "$file" ]] || continue
      check_file "$file" || status=1
    done <"$list"
    rm -f "$list"
  done
  return "$status"
}

self_test() {
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN

  cat >"$tmp/pass.go" <<'EOF'
package sample

// WORKAROUND: upstream driver returns nil on empty rows, not io.EOF.
func Load() error {
	x := 1 // SECURITY: never log x, it may carry a raw token
	/* INVARIANT: callers already hold the row lock here */
	return nil
}

//go:build linux

//nolint:errcheck // best-effort close, error already logged
func Close() {}
EOF

  cat >"$tmp/fail.go" <<'EOF'
package sample

// New builds a sample.
func New() *T {
	x := 1 // increment counter
	/* helper block */
	return &T{x: x}
}
EOF

  cat >"$tmp/fail.nolint-bare.go" <<'EOF'
package sample

func Close() {
	f.Close() //nolint:errcheck
}
EOF

  cat >"$tmp/fail.nolint-midsentence.go" <<'EOF'
package sample

// we could nolint here but this is just narrative prose
func Close() {}
EOF

  cat >"$tmp/fail.build-continuation.go" <<'EOF'
package sample

//go:build linux
// this narrative line must not be licensed by the directive above
func Load() {}
EOF

  cat >"$tmp/fail.nolint-continuation.go" <<'EOF'
package sample

//nolint:errcheck // reason
// this narrative line must not be licensed by the suppression above
func Close() {}
EOF

  cat >"$tmp/pass.py" <<'EOF'
# WORKAROUND: upstream lib swallows KeyError, so check membership first.
def load():
    x = 1  # SECURITY: never print x
    return x

import storage.gitlab_storage  # noqa: F401  (triggers the imports below)


def swap():
    global x  # pylint: disable=global-statement  # module-level cache reassigned per request
    x = 1


def assign() -> None:
    obj.attr = value  # type: ignore[method-assign]  # test double reassigns a bound method
EOF

  cat >"$tmp/pass.pylint-disable-next.py" <<'EOF'
# pylint: disable-next=broad-except  # narrow catch would miss the retry-annotated subclasses
def risky():
    try:
        pass
    except Exception:
        pass
EOF

  cat >"$tmp/fail.py" <<'EOF'
# load reads the config
def load():
    x = 1  # the answer
    return x
EOF

  cat >"$tmp/fail.noqa-bare.py" <<'EOF'
import storage.gitlab_storage  # noqa: F401
EOF

  cat >"$tmp/pass.ts" <<'EOF'
// WORKAROUND: the SDK types this as any; narrow it ourselves.
export function load(): number {
  // eslint-disable-next-line no-explicit-any -- SDK gap, see above
  // @ts-expect-error -- upstream types are wrong here, tracked upstream
  // @ts-ignore -- generated .d.ts predates this overload, tracked upstream
  return 1
}
EOF

  cat >"$tmp/fail.ts" <<'EOF'
// load returns one
export function load(): number {
  return 1 // always one
}
EOF

  cat >"$tmp/fail.at-annotation.ts" <<'EOF'
// @deprecated this whole narrative should not be exempt
export function load(): number {
  return 1
}
EOF

  cat >"$tmp/fail.eslint-bare.ts" <<'EOF'
export function load(): number {
  // eslint-disable-next-line no-explicit-any
  return 1
}
EOF

  cat >"$tmp/fail.ts-expect-error-bare.ts" <<'EOF'
export function load(): number {
  // @ts-expect-error
  return 1
}
EOF

  cat >"$tmp/fail.ts-ignore-bare.ts" <<'EOF'
export function load(): number {
  // @ts-ignore
  return 1
}
EOF

  cat >"$tmp/fail.type-ignore-bare.py" <<'EOF'
def assign() -> None:
    obj.attr = value  # type: ignore[method-assign]
EOF

  cat >"$tmp/fail.pylint-disable-bare.py" <<'EOF'
def swap():
    global x  # pylint: disable=global-statement
    x = 1
EOF

  cat >"$tmp/fail.pylint-disable-paren.py" <<'EOF'
def swap():
    global x  # pylint: disable=global-statement  (module-level cache reassigned per request)
    x = 1
EOF

  cat >"$tmp/fail.type-ignore-paren.py" <<'EOF'
def assign() -> None:
    obj.attr = value  # type: ignore[method-assign]  (test double reassigns a bound method)
EOF

  cat >"$tmp/fail.pylint-disable-unanchored.py" <<'EOF'
def swap():
    global x  # pylint: disable=global-statement  (why) # more
    x = 1
EOF

  cat >"$tmp/pass.prettier-ignore.mjs" <<'EOF'
// prettier-ignore -- keep this table hand-aligned for readability
const table = [
  [1, 2],
  [3, 4],
]

export default table
EOF

  cat >"$tmp/fail.prettier-ignore-bare.mjs" <<'EOF'
// prettier-ignore
const table = [
  [1, 2],
]

export default table
EOF

  cat >"$tmp/pass.istanbul-ignore.mjs" <<'EOF'
export function load() {
  /* istanbul ignore next -- defensive branch, unreachable in tests */
  if (false) return 0
  return 1
}
EOF

  cat >"$tmp/fail.istanbul-ignore-bare.mjs" <<'EOF'
export function load() {
  /* istanbul ignore next */
  if (false) return 0
  return 1
}
EOF

  cat >"$tmp/pass.c8-ignore.mjs" <<'EOF'
export function load() {
  /* c8 ignore next -- defensive branch, unreachable in tests */
  if (false) return 0
  return 1
}
EOF

  cat >"$tmp/fail.c8-ignore-bare.mjs" <<'EOF'
export function load() {
  /* c8 ignore next */
  if (false) return 0
  return 1
}
EOF

  cat >"$tmp/pass.todo.go" <<'EOF'
package sample

// TODO(STORY-123): switch to the batched API once it ships.
func Load() {}
EOF

  cat >"$tmp/pass.todo-issue.go" <<'EOF'
package sample

// TODO(#42): switch to the batched API once it ships.
func Load() {}
EOF

  cat >"$tmp/fail.todo-bare.go" <<'EOF'
package sample

// TODO: fix this later
func Load() {}
EOF

  cat >"$tmp/fail.todo-nonticket.go" <<'EOF'
package sample

// TODO(scaffold): copy the shape from pkg/post and wire the router.
func Load() {}
EOF

  cat >"$tmp/fail.todo-word.go" <<'EOF'
package sample

// TODO(fixme): rework this once the new client lands.
func Load() {}
EOF

  cat >"$tmp/pass.encoding.py" <<'EOF'
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def load():
    return 1
EOF

  cat >"$tmp/fail.coding-lookalike.py" <<'EOF'
# coding style is enforced by black, not a PEP 263 directive at all here
def load():
    return 1
EOF

  cat >"$tmp/pass.go-generate.go" <<'EOF'
package sample

//go:generate mockgen -source=foo.go -destination=foo_mock.go
//go:generate mockgen -source=bar.go -destination=bar_mock.go
//go:generate mockgen -source=baz.go -destination=baz_mock.go
//go:generate mockgen -source=qux.go -destination=qux_mock.go

func Load() {}
EOF

  cat >"$tmp/fail.go-generate-narrative.go" <<'EOF'
package sample

//go:generate mockgen -source=foo.go -destination=foo_mock.go
//go:generate mockgen -source=bar.go -destination=bar_mock.go
// this line is narrative prose, not a directive, and must still fail
//go:generate mockgen -source=baz.go -destination=baz_mock.go

func Load() {}
EOF

  cat >"$tmp/pass.block-directives.go" <<'EOF'
package sample

/*
 * nolint:errcheck // reason one, kept short
 * nolint:gosec // reason two, kept short
 * nolint:unused // reason three, kept short
 * nolint:ineffassign // reason four, kept short
 */

func Load() {}
EOF

  cat >"$tmp/fail.copyright-midfunction.go" <<'EOF'
package sample

func Load() {
	x := 1
	// Copyright 2026 Sneaky Corp, pretend license header mid-function
	// this narrative line must not be licensed by the fake header above
	_ = x
}
EOF

  cat >"$tmp/fail.spdx-lookalike.go" <<'EOF'
package sample

// Distributed per SPDX-License-Identifier: MIT-ish wording embedded in prose.

func Load() {}
EOF

  cat >"$tmp/pass.sql" <<'EOF'
-- WORKAROUND: planner misestimates this join without the hint.
SELECT 1;
EOF

  cat >"$tmp/fail.sql" <<'EOF'
-- select the row
SELECT 1;
EOF

  cat >"$tmp/pass.goose.sql" <<'EOF'
-- +goose Up
CREATE TABLE t (id TEXT PRIMARY KEY);

-- +goose Down
DROP TABLE t;
EOF

  cat >"$tmp/fail.goose-continuation.sql" <<'EOF'
-- +goose Up
-- this narrative line must not be licensed by the directive above
CREATE TABLE t (id TEXT PRIMARY KEY);
EOF

  cat >"$tmp/pass.sentinel.go" <<'EOF'
package sample

// agg2:begin
func Load() {
	x := 1 // agg2:line
	_ = x
}

// agg2:end
EOF

  cat >"$tmp/fail.sentinel-continuation.go" <<'EOF'
package sample

// agg2:begin
// this narrative line must not be licensed by the sentinel above
func Load() {}

// agg2:end
EOF

  cat >"$tmp/fail.sentinel-lookalike.go" <<'EOF'
package sample

// note:line items below still need review before shipping
func Load() {}
EOF

  cat >"$tmp/Makefile" <<'EOF'
#!/usr/bin/make
help: ## Print this help
	@echo help

build: ## Build the binary
	@go build ./...
EOF

  cat >"$tmp/fail.makefile" <<'EOF'
build:
	@go build ./... # compile everything
EOF

  cat >"$tmp/longmarker.makefile" <<'EOF'
## This is a long untagged narrative comment explaining historical context
## that is not attached to any target, so it is not a help marker at all.
build:
	@go build ./...
EOF

  cat >"$tmp/fail.shebang-continuation.makefile" <<'EOF'
#!/usr/bin/make
# this narrative line must not be licensed by the shebang above
build:
	@go build ./...
EOF

  cat >"$tmp/fail.block-continuation.ts" <<'EOF'
export function load(): number {
  /* eslint-disable-next-line no-explicit-any -- SDK gap, see above
     this narrative line must not be licensed by the directive above */
  return 1
}
EOF

  cat >"$tmp/pass.string.go" <<'EOF'
package sample

func Format(x string) string {
	return fmt.Sprintf("value is %s // not a comment", x)
}
EOF

  cat >"$tmp/fail.longrun.go" <<'EOF'
package sample

// WORKAROUND: short reason.
// This continuation line is completely untagged narrative that keeps
// going well past the three-line limit the tag is supposed to have,
// smuggling a whole paragraph of history under one legitimate tag.
func Load() {}
EOF

  cat >"$tmp/pass.block.go" <<'EOF'
package sample

/*
 * WORKAROUND: the driver needs a warmup query before first use,
 * otherwise the connection pool reports a false-positive timeout.
 */
func Warm() {}
EOF

  cat >"$tmp/fail.longblock.go" <<'EOF'
package sample

/*
 * WORKAROUND: short reason.
 * This block keeps going with untagged narrative well past the
 * three-line limit that a tagged comment is allowed to use, and
 * a fourth line of prose on top of that.
 */
func Warm() {}
EOF

  cat >"$tmp/pass.mjs" <<'EOF'
// WORKAROUND: bundler resolves this only as an ESM entrypoint.
export function load() {
  return 1
}
EOF

  cat >"$tmp/fail.mjs" <<'EOF'
// load returns one
export function load() {
  return 1
}
EOF

  cat >"$tmp/pass.cjs" <<'EOF'
// WORKAROUND: the CLI loader only accepts CommonJS for this config file.
module.exports = { load: () => 1 }
EOF

  cat >"$tmp/fail.cjs" <<'EOF'
// load returns one
module.exports = { load: () => 1 }
EOF

  cat >"$tmp/pass.copyright.go" <<'EOF'
// Copyright 2026 Example Corp. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
//
// SPDX-License-Identifier: BSD-3-Clause

package sample

func Load() {}
EOF

  cat >"$tmp/pass.copyright-lowercase.go" <<'EOF'
// copyright 2026 example corp.
// licensed under the apache license, version 2.0.
// see the license file for details.
// this line proves the exemption does not require a capital C.

package sample

func Load() {}
EOF

  cat >"$tmp/pass.copyright.block.go" <<'EOF'
/*
 * Copyright 2026 Example Corp. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 * This line also proves the block form is exempt from the length cap.
 */

package sample

func Load() {}
EOF

  cat >"$tmp/fail.copyright-lookalike.go" <<'EOF'
// This copyright notice thing is not a real header, just narrative
// that keeps going past the three-line limit like an essay would,
// pretending to be exempt by mentioning copyright somewhere inside,
// and it should still be flagged like any other untagged comment.

package sample

func Load() {}
EOF

  cat >"$tmp/pass.mts" <<'EOF'
// WORKAROUND: ts-node needs the .mts extension to pick ESM mode here.
export function load(): number {
  return 1
}
EOF

  cat >"$tmp/fail.mts" <<'EOF'
// load returns one
export function load(): number {
  return 1
}
EOF

  cat >"$tmp/pass.tsref.ts" <<'EOF'
/// <reference types="vitest" />
export function load(): number {
  return 1
}
EOF

  cat >"$tmp/fail.tsref-continuation.ts" <<'EOF'
/// <reference types="vitest" />
// this narrative line must not be licensed by the directive above
export function load(): number {
  return 1
}
EOF

  cat >"$tmp/pass.jsdoc-type.mjs" <<'EOF'
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
}

export default config
EOF

  cat >"$tmp/pass.biome-ignore.ts" <<'EOF'
export function load(): number {
  // biome-ignore lint/suspicious/noExplicitAny: SDK gap, tracked upstream
  return 1
}
EOF

  cat >"$tmp/fail.biome-ignore-bare.ts" <<'EOF'
export function load(): number {
  // biome-ignore lint/suspicious/noExplicitAny
  return 1
}
EOF

  cat >"$tmp/fail.jsdoc-type-continuation.mjs" <<'EOF'
// @type {import('next').NextConfig}
// this narrative line must not be licensed by the pragma above
export default {}
EOF

  cat >"$tmp/pass.sh" <<'EOF'
#!/usr/bin/env bash
# WORKAROUND: the upstream CLI prints to stderr, so merge the streams.
run() {
  # shellcheck disable=SC2034 # consumed by the sourced file
  x=1
  # shellcheck source=/dev/null
  . ./lib.sh
  echo "a # not a comment"
}
EOF

  cat >"$tmp/fail.sh" <<'EOF'
#!/usr/bin/env bash
# run the thing
run() {
  echo hi # say hi
}
EOF

  cat >"$tmp/fail.shellcheck-bare.sh" <<'EOF'
#!/usr/bin/env bash
# shellcheck disable=SC2034
x=1
EOF

  cat >"$tmp/pass.yaml" <<'EOF'
# yaml-language-server: $schema=https://example.invalid/schema.json
# WORKAROUND: the chart ignores empty lists, so default to one entry.
key: "a # not a comment"
url: https://example.invalid/#anchor
list:
  - one
EOF

  cat >"$tmp/fail.yaml" <<'EOF'
# enables the thing
key: value
EOF

  cat >"$tmp/fail.yaml-trailing.yml" <<'EOF'
key: value # the value
EOF

  cat >"$tmp/fail.yaml-blockscalar.yml" <<'EOF'
steps:
  - run: |
      # build it
      make build
EOF

  cat >"$tmp/pass.toml" <<'EOF'
# SECURITY: coverage must never be disabled for the auth package.
[tool.coverage.run]
omit = ["tests/*"]
EOF

  cat >"$tmp/fail.toml" <<'EOF'
[tool.coverage.run]
# files we skip
omit = ["tests/*"]
EOF

  cat >"$tmp/pass.tpl" <<'EOF'
{{- /* INVARIANT: the selector labels must never change after the first release. */ -}}
{{- define "x.labels" -}}
app: x
{{- end -}}
EOF

  cat >"$tmp/fail.tpl" <<'EOF'
{{- /* Common labels */ -}}
{{- define "x.labels" -}}
app: x
{{- end -}}
EOF

  cat >"$tmp/Dockerfile" <<'EOF'
# syntax=docker/dockerfile:1
# SECURITY: pinned base image, bumped by hand after review.
FROM alpine:3.22 AS prod
RUN echo ok
EOF

  cat >"$tmp/pass.heredoc.sh" <<'EOF'
#!/usr/bin/env bash
cat >out.py <<'PY'
# a comment inside a heredoc body is data, not a comment
x = 1
PY
cat <<-TXT
	# indented heredoc body
	TXT
echo $((1<<3))
EOF

  cat >"$tmp/fail.after-heredoc.sh" <<'EOF'
#!/usr/bin/env bash
cat >out.py <<'PY'
# data
PY
# narrative after the heredoc
echo done
EOF

  mkdir -p "$tmp/df-untagged" "$tmp/df-longtag"
  cat >"$tmp/df-untagged/Dockerfile.tmpl" <<'EOF'
# syntax=docker/dockerfile:1
# the base image
FROM alpine:3.22 AS prod
EOF

  cat >"$tmp/df-longtag/Dockerfile" <<'EOF'
# syntax=docker/dockerfile:1
# WORKAROUND: line one
# line two
# line three
# line four
FROM alpine:3.22 AS prod
EOF


  local -a expect_pass=(
    pass.go pass.py pass.ts pass.sql Makefile pass.string.go pass.block.go
    pass.mjs pass.cjs pass.mts pass.goose.sql pass.sentinel.go
    pass.copyright.go pass.copyright-lowercase.go pass.copyright.block.go
    pass.tsref.ts pass.jsdoc-type.mjs
    pass.biome-ignore.ts
    pass.prettier-ignore.mjs pass.istanbul-ignore.mjs pass.c8-ignore.mjs
    pass.todo.go pass.todo-issue.go pass.encoding.py pass.go-generate.go pass.block-directives.go
    pass.pylint-disable-next.py
    pass.sh pass.heredoc.sh pass.yaml pass.toml pass.tpl Dockerfile
  )
  local -a expect_fail=(
    fail.go fail.py fail.ts fail.sql fail.makefile longmarker.makefile fail.longrun.go fail.longblock.go
    fail.nolint-bare.go fail.nolint-midsentence.go fail.noqa-bare.py
    fail.at-annotation.ts fail.eslint-bare.ts fail.ts-expect-error-bare.ts
    fail.mjs fail.cjs fail.mts
    fail.build-continuation.go fail.nolint-continuation.go fail.shebang-continuation.makefile
    fail.block-continuation.ts fail.copyright-lookalike.go fail.goose-continuation.sql
    fail.sentinel-continuation.go fail.sentinel-lookalike.go fail.tsref-continuation.ts
    fail.jsdoc-type-continuation.mjs
    fail.ts-ignore-bare.ts fail.type-ignore-bare.py fail.pylint-disable-bare.py
    fail.biome-ignore-bare.ts
    fail.prettier-ignore-bare.mjs fail.istanbul-ignore-bare.mjs fail.c8-ignore-bare.mjs
    fail.todo-bare.go fail.todo-nonticket.go fail.todo-word.go fail.coding-lookalike.py
    fail.go-generate-narrative.go fail.copyright-midfunction.go fail.spdx-lookalike.go
    fail.pylint-disable-paren.py fail.type-ignore-paren.py fail.pylint-disable-unanchored.py
    fail.sh fail.after-heredoc.sh fail.shellcheck-bare.sh fail.yaml fail.yaml-trailing.yml fail.yaml-blockscalar.yml
    fail.toml fail.tpl df-untagged/Dockerfile.tmpl df-longtag/Dockerfile
  )
  local ok=1 f out="$tmp/.out"

  for f in "${expect_pass[@]}"; do
    if check_file "$tmp/$f" >"$out" 2>&1; then
      printf 'ok   pass  %s\n' "$f"
    else
      printf 'FAIL pass  %s (expected clean, got a violation)\n' "$f"
      cat "$out"
      ok=0
    fi
  done

  for f in "${expect_fail[@]}"; do
    if check_file "$tmp/$f" >"$out" 2>&1; then
      printf 'FAIL fail  %s (expected a violation, got none)\n' "$f"
      ok=0
    else
      printf 'ok   fail  %s\n' "$f"
    fi
  done

  collect_files "$tmp" >"$out"
  if grep -qE '\.(mjs|cjs|mts)$' "$out"; then
    printf 'ok   scan  .mjs/.cjs/.mts discovered by collect_files\n'
  else
    printf 'FAIL scan  .mjs/.cjs/.mts not discovered by collect_files\n'
    ok=0
  fi

  if grep -q 'pass\.sh$' "$out" && grep -q 'pass\.yaml$' "$out" && grep -q 'pass\.toml$' "$out" && grep -q 'pass\.tpl$' "$out" && grep -q '/Dockerfile$' "$out" && grep -q 'Dockerfile\.tmpl$' "$out"; then
    printf 'ok   scan  shell, YAML, TOML, Helm .tpl and Dockerfiles discovered by collect_files\n'
  else
    printf 'FAIL scan  shell, YAML, TOML, Helm .tpl or Dockerfiles not discovered by collect_files\n'
    ok=0
  fi

  mkdir -p "$tmp/.go/pkg/mod/x" "$tmp/.ci-common/scripts"
  printf '# untagged comment in a Go module cache\nkey: 1\n' >"$tmp/.go/pkg/mod/x/cache.yaml"
  printf '# untagged comment in the fetched ci-common\nx=1\n' >"$tmp/.ci-common/scripts/x.sh"
  mkdir -p "$tmp/config/semgrep"
  printf '# untagged comment in a vendored Semgrep rule pack\nrules: []\n' >"$tmp/config/semgrep/pack.yaml"
  mkdir -p "$tmp/.venv/lib" "$tmp/dist" "$tmp/build" "$tmp/.next/server" "$tmp/coverage/lcov-report" "$tmp/.dart_tool/flutter_build"
  cat >"$tmp/.venv/lib/vendored.py" <<'EOF'
# untagged comment inside a vendored virtualenv
def load():
    return 1
EOF

  cat >"$tmp/.dart_tool/flutter_build/dart_plugin_registrant.dart" <<'EOF'
// untagged comment inside generated Flutter tooling output
void registrant() {}
EOF

  cat >"$tmp/dist/bundle.js" <<'EOF'
// untagged comment inside a build artifact
export function load() {
  return 1
}
EOF

  cat >"$tmp/build/output.go" <<'EOF'
package sample

// untagged comment inside a build output dir
func Load() {}
EOF

  cat >"$tmp/.next/server/middleware.js" <<'EOF'
// untagged comment inside a Next.js build artifact
export function load() {
  return 1
}
EOF

  cat >"$tmp/coverage/lcov-report/prettify.js" <<'EOF'
// untagged comment inside a generated coverage report
export function load() {
  return 1
}
EOF

  collect_files "$tmp" >"$out"
  if grep -qE '/(\.venv|dist|build|\.next|coverage|\.dart_tool|\.go|\.ci-common|config/semgrep)/' "$out"; then
    printf 'FAIL scan  .venv/dist/build/.next/coverage/.dart_tool not excluded by collect_files\n'
    ok=0
  else
    printf 'ok   scan  .venv/dist/build/.next/coverage/.dart_tool excluded by collect_files\n'
  fi

  cat >"$tmp/next-env.d.ts" <<'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
EOF

  collect_files "$tmp" >"$out"
  if grep -q 'next-env.d.ts' "$out"; then
    printf 'FAIL scan  next-env.d.ts not excluded by collect_files\n'
    ok=0
  else
    printf 'ok   scan  next-env.d.ts excluded by collect_files\n'
  fi

  if run_check "$tmp/does-not-exist-$$" >"$out" 2>&1; then
    printf 'FAIL path  missing path expected non-zero exit, got 0\n'
    ok=0
  else
    printf 'ok   path  missing path exits non-zero\n'
  fi

  [[ "$ok" -eq 1 ]]
}

main() {
  [[ $# -ge 1 ]] || usage
  if [[ "$1" == "--self-test" ]]; then
    self_test
    exit $?
  fi
  run_check "$@"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
