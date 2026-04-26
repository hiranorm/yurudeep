<script lang="ts">
import { tick } from "svelte";
import CharDisplay from "./CharDisplay.svelte";
import ResultScreen from "./ResultScreen.svelte";

interface Props {
	lines: string[];
	title: string;
	listUrl: string;
	isFreeMode?: boolean;
}

let { lines, title, listUrl, isFreeMode = false }: Props = $props();

// --- State ---
type CharResult = "correct" | "miss" | null;
type Phase = "ready" | "playing" | "done";

let phase = $state<Phase>("ready");
let currentLineIndex = $state(0);
let currentCharIndex = $state(0);

// results[lineIndex][charIndex]
let lineResults = $state<CharResult[][]>(
	lines.map(
		(l) =>
			Array(
				l.replace(/[　 ]/g, "").length +
					l.split("").filter((c) => c === "　" || c === " ").length,
			).fill(null) as CharResult[],
	),
);

let startTime = $state(0);
let endTime = $state(0);
let totalCorrect = $state(0);
let totalMiss = $state(0);

let inputEl = $state<HTMLInputElement | null>(null);
let isComposing = $state(false);
let inputValue = $state("");

// free mode state
let freeInput = $state("");

// animation state
let lineSliding = $state(false);

const currentLine = $derived(lines[currentLineIndex] ?? "");
const currentLineChars = $derived(currentLine.split(""));
const currentResults = $derived(lineResults[currentLineIndex] ?? []);

const nextLine = $derived(lines[currentLineIndex + 1] ?? null);

const totalCharsAll = $derived(
	lines.reduce(
		(acc, l) => acc + l.split("").filter((c) => c !== "　" && c !== " ").length,
		0,
	),
);

// Chars in current line excluding spaces
function getNonSpaceIndices(line: string): number[] {
	return line
		.split("")
		.map((c, i) => ({ c, i }))
		.filter(({ c }) => c !== "　" && c !== " ")
		.map(({ i }) => i);
}

const nonSpaceIndices = $derived(getNonSpaceIndices(currentLine));

// Find the first non-space index at or after currentCharIndex
function findNextNonSpaceIndex(lineStr: string, from: number): number {
	for (let i = from; i < lineStr.length; i++) {
		if (lineStr[i] !== "　" && lineStr[i] !== " ") return i;
	}
	return lineStr.length; // done
}

function start() {
	phase = "playing";
	startTime = Date.now();
	currentLineIndex = 0;
	currentCharIndex = findNextNonSpaceIndex(lines[0], 0);
	lineResults = lines.map((l) => Array(l.length).fill(null) as CharResult[]);
	totalCorrect = 0;
	totalMiss = 0;
	inputValue = "";
	tick().then(() => inputEl?.focus());
}

function retry() {
	phase = "ready";
	currentLineIndex = 0;
	currentCharIndex = 0;
	lineResults = lines.map((l) => Array(l.length).fill(null) as CharResult[]);
	totalCorrect = 0;
	totalMiss = 0;
	inputValue = "";
	freeInput = "";
}

function handleCompositionStart() {
	isComposing = true;
}

async function handleCompositionEnd(e: CompositionEvent) {
	isComposing = false;
	const typed = e.data ?? "";
	if (phase !== "playing") return;
	if (isFreeMode) {
		freeInput += typed;
		// Clear input
		inputValue = "";
		return;
	}
	await processTyped(typed);
	// Clear input value after composition
	inputValue = "";
}

async function processTyped(typed: string) {
	for (const ch of typed) {
		if (currentCharIndex >= currentLine.length) break;

		// Skip spaces (they're already in results as null, skip them)
		while (
			currentCharIndex < currentLine.length &&
			(currentLine[currentCharIndex] === "　" ||
				currentLine[currentCharIndex] === " ")
		) {
			currentCharIndex++;
		}

		if (currentCharIndex >= currentLine.length) {
			await advanceLine();
			break;
		}

		const expected = currentLine[currentCharIndex];
		const isCorrect = ch === expected;
		const newResults = [...lineResults[currentLineIndex]];
		newResults[currentCharIndex] = isCorrect ? "correct" : "miss";
		lineResults[currentLineIndex] = newResults;

		if (isCorrect) totalCorrect++;
		else totalMiss++;

		currentCharIndex++;

		// Skip spaces after advancing
		while (
			currentCharIndex < currentLine.length &&
			(currentLine[currentCharIndex] === "　" ||
				currentLine[currentCharIndex] === " ")
		) {
			currentCharIndex++;
		}

		if (currentCharIndex >= currentLine.length) {
			await advanceLine();
			break;
		}
	}
}

async function advanceLine() {
	lineSliding = true;
	await tick();

	await new Promise((resolve) => setTimeout(resolve, 300));

	lineSliding = false;
	currentLineIndex++;

	if (currentLineIndex >= lines.length) {
		endTime = Date.now();
		phase = "done";
		return;
	}

	currentCharIndex = findNextNonSpaceIndex(lines[currentLineIndex], 0);
	inputValue = "";
}

function handleInput(e: Event) {
	// For direct (non-IME) input on some systems
	if (isComposing) return;
	const target = e.target as HTMLInputElement;
	const val = target.value;
	if (!val) return;
	if (phase !== "playing") return;

	inputValue = "";
	target.value = "";

	if (isFreeMode) {
		freeInput += val;
		return;
	}

	processTyped(val);
}

function handleKeydown(e: KeyboardEvent) {
	// Prevent backspace from doing anything
	if (e.key === "Backspace") {
		e.preventDefault();
	}
	if (e.key === "Enter" && phase === "ready") {
		start();
	}
}
</script>

<div class="typing-practice w-full">
  {#if phase === 'ready'}
    <div class="ready-screen flex flex-col items-center gap-6 py-12">
      <h2 class="text-xl font-bold opacity-80">{title}</h2>
      <p class="opacity-60 text-sm">
        {#if isFreeMode}
          お題を見て、頭に浮かんだことをひらがなで打ち込もう
        {:else}
          お手本のひらがなをそのまま入力してください
        {/if}
      </p>
      <p class="opacity-50 text-xs">変換なし・バックスペース不可</p>
      {#if !isFreeMode}
        <p class="opacity-40 text-xs text-center leading-relaxed">
          Macの親指シフト入力の場合、1文字か複数文字打った後に<br>
          <span class="font-mono opacity-70">Enter</span> で確定してから次の文字へ進んでください
        </p>
      {/if}
      <button
        onclick={start}
        class="start-btn px-8 py-4 rounded-xl font-bold text-lg text-white bg-[oklch(0.5_0.18_250)] hover:bg-[oklch(0.55_0.18_250)] transition-all hover:scale-105 cursor-pointer shadow-lg"
      >
        スタート
      </button>
    </div>

  {:else if phase === 'playing'}
    <div class="playing-screen flex flex-col gap-6 py-6">
      <!-- Progress -->
      <div class="progress flex items-center gap-3">
        <div class="progress-bar flex-1 h-2 rounded-full bg-[oklch(0.3_0_0_/0.2)] overflow-hidden">
          <div
            class="h-full rounded-full bg-[oklch(0.6_0.15_250)] transition-all duration-300"
            style={`width: ${Math.round((currentLineIndex / lines.length) * 100)}%`}
          ></div>
        </div>
        <span class="text-xs opacity-50 min-w-[3rem] text-right">{currentLineIndex}/{lines.length}</span>
      </div>

      <!-- Current line -->
      <div
        class="current-line-wrapper overflow-hidden transition-all duration-300"
        class:slide-out={lineSliding}
      >
        {#if !isFreeMode}
          <CharDisplay
            template={currentLine}
            results={currentResults}
            currentIndex={currentCharIndex}
          />
        {:else}
          <div class="free-prompt text-xl md:text-2xl opacity-80 font-medium">{currentLine}</div>
        {/if}
      </div>

      <!-- Free mode typed display -->
      {#if isFreeMode}
        <div class="free-typed min-h-12 p-3 rounded-lg bg-[oklch(0.15_0_0_/0.3)] text-lg opacity-80 break-all">
          {#if freeInput}
            {freeInput}
          {:else}
            <span class="opacity-30">（ここに入力が表示されます）</span>
          {/if}
        </div>
      {/if}

      <!-- Next line preview -->
      {#if nextLine && !isFreeMode}
        <div class="next-line opacity-30 text-base font-mono tracking-widest transition-all duration-300" class:fade-in={!lineSliding}>
          次: {nextLine}
        </div>
      {/if}

      <!-- Hidden input for capturing keyboard -->
      <input
        bind:this={inputEl}
        bind:value={inputValue}
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        class="typing-input"
        oncompositionstart={handleCompositionStart}
        oncompositionend={handleCompositionEnd}
        oninput={handleInput}
        onkeydown={handleKeydown}
        aria-label="入力エリア"
      />

      <!-- Tap to focus hint -->
      <div class="flex justify-center">
        <button
          onclick={() => inputEl?.focus()}
          class="focus-hint text-xs opacity-40 hover:opacity-70 transition-opacity cursor-pointer underline underline-offset-2"
        >
          タップしてフォーカス
        </button>
      </div>
    </div>

  {:else if phase === 'done'}
    <ResultScreen
      totalChars={totalCorrect + totalMiss}
      correctChars={totalCorrect}
      elapsedMs={endTime - startTime}
      onRetry={retry}
      {listUrl}
    />
  {/if}
</div>

<style>
  .typing-input {
    position: fixed;
    opacity: 0;
    pointer-events: none;
    left: -9999px;
    width: 1px;
    height: 1px;
  }

  .current-line-wrapper {
    transform: translateY(0);
    opacity: 1;
  }

  .current-line-wrapper.slide-out {
    transform: translateY(-1rem);
    opacity: 0;
  }

  .next-line {
    opacity: 0.3;
  }

  .next-line.fade-in {
    opacity: 0.3;
  }
</style>
