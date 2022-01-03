#!/usr/bin/env bash

set -e

rm -rf ./tmp/*

COMMAND="deno run --allow-run --allow-read ./AdventOfCode.ts"

if [ $# -eq 0 ];
then
    $COMMAND
    exit
elif [ $# -eq 1 ] && [ "$1" == "all" ];
then
   $COMMAND all
   exit
fi

$COMMAND "$@"
