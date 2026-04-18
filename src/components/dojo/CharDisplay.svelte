<script lang="ts">
  interface Props {
    template: string;
    results: ('correct' | 'miss' | null)[];
    currentIndex: number;
  }

  let { template, results, currentIndex }: Props = $props();

  const chars = $derived(template.split(''));
</script>

<div class="char-display flex flex-wrap gap-0 font-mono text-2xl md:text-3xl leading-relaxed tracking-widest select-none">
  {#each chars as char, i}
    {#if char === '　' || char === ' '}
      <span class="char-spacer inline-block w-6 md:w-8"></span>
    {:else}
      <span
        class="char inline-block w-8 md:w-10 h-10 md:h-12 flex items-center justify-center rounded transition-all duration-150"
        class:correct={results[i] === 'correct'}
        class:miss={results[i] === 'miss'}
        class:current={i === currentIndex && results[i] === null}
        class:pending={results[i] === null && i !== currentIndex}
      >
        {char}
      </span>
    {/if}
  {/each}
</div>

<style>
  .char {
    color: var(--char-pending-color, oklch(0.6 0 0));
    background: transparent;
  }

  .char.current {
    color: oklch(0.85 0 0);
    background: oklch(0.4 0.08 250 / 0.3);
    outline: 2px solid oklch(0.6 0.1 250);
    outline-offset: -2px;
  }

  .char.correct {
    color: oklch(0.75 0.18 145);
    background: oklch(0.35 0.08 145 / 0.3);
  }

  .char.miss {
    color: oklch(0.7 0.2 25);
    background: oklch(0.35 0.08 25 / 0.3);
  }

  .char.pending {
    color: oklch(0.55 0 0);
  }

  :global(.dark) .char.pending {
    color: oklch(0.55 0 0);
  }

  :global(:not(.dark)) .char.pending {
    color: oklch(0.45 0 0);
  }
</style>
