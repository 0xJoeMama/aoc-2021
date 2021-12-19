#!/usr/bin/env bash

set -e

if [ $# -eq 0 ]
then
    deno run --allow-run --allow-read ./AdventOfCode.ts
    exit
fi

deno run --allow-run --allow-read ./AdventOfCode.ts "$@"
