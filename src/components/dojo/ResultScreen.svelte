<script lang="ts">
  import confetti from 'canvas-confetti';
  import { onMount } from 'svelte';

  interface Props {
    totalChars: number;
    correctChars: number;
    elapsedMs: number;
    onRetry: () => void;
    listUrl: string;
  }

  let { totalChars, correctChars, elapsedMs, onRetry, listUrl }: Props = $props();

  const accuracy = $derived(totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0);
  const seconds = $derived((elapsedMs / 1000).toFixed(1));
  const cpm = $derived(elapsedMs > 0 ? Math.round((correctChars / elapsedMs) * 60000) : 0);

  onMount(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#2563eb', '#059669'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#2563eb', '#059669'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  });
</script>

<div class="result-screen flex flex-col items-center gap-6 py-10 px-4 text-center">
  <div class="text-4xl font-bold">
    {#if accuracy >= 95}
      🎉 すばらしい！
    {:else if accuracy >= 80}
      👏 よくできました！
    {:else}
      💪 また挑戦しよう！
    {/if}
  </div>

  <div class="stats grid grid-cols-3 gap-6 w-full max-w-sm">
    <div class="stat-item flex flex-col items-center gap-1">
      <span class="stat-value text-3xl font-bold text-[oklch(0.75_0.18_145)]">{accuracy}%</span>
      <span class="stat-label text-sm opacity-60">正確率</span>
    </div>
    <div class="stat-item flex flex-col items-center gap-1">
      <span class="stat-value text-3xl font-bold text-[oklch(0.7_0.15_250)]">{seconds}秒</span>
      <span class="stat-label text-sm opacity-60">タイム</span>
    </div>
    <div class="stat-item flex flex-col items-center gap-1">
      <span class="stat-value text-3xl font-bold text-[oklch(0.75_0.15_60)]">{cpm}</span>
      <span class="stat-label text-sm opacity-60">文字/分</span>
    </div>
  </div>

  <div class="detail-stats text-sm opacity-60">
    {correctChars} / {totalChars} 文字正解
  </div>

  <div class="actions flex gap-4 flex-wrap justify-center">
    <button
      onclick={onRetry}
      class="btn-retry px-6 py-3 rounded-lg font-bold text-white bg-[oklch(0.5_0.18_250)] hover:bg-[oklch(0.55_0.18_250)] transition-colors cursor-pointer"
    >
      もう一度
    </button>
    <a
      href={listUrl}
      class="btn-list px-6 py-3 rounded-lg font-bold border border-current opacity-70 hover:opacity-100 transition-opacity"
    >
      レッスン一覧へ
    </a>
  </div>
</div>
