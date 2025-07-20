import { type Accessor, type Component, createSignal, For, type Setter, Show } from 'solid-js';
import type { CoveredPoint, Mode } from './types';

const colorByYear: Record<string, string> = {
  '2013': '#78350f',
  // there is no 2014 data
  '2015': '#365314',
  '2016': '#064e3b',
  '2017': '#164e63',
  '2018': '#1e3a8a',
  '2019': '#4c1d95',
  '2020': '#701a75',
  '2021': '#c2410c',
  '2022': '#4d7c0f',
  '2023': '#15803d',
  '2024': '#0f766e',
  '2025': '#0369a1',
};

const mapModeConfig = {
  copyright: {
    getColor(point: CoveredPoint) {
      const year = point.svCopyright.slice(0, 4);
      return colorByYear[year] ?? '#000000';
    },
  },
};

export const App: Component<{
  hoveredPoint: Accessor<CoveredPoint | undefined>;
  mode: Accessor<'copyright'>;
  setMode: Setter<'copyright'>;
  selectedSubset: Accessor<string>;
  setSelectedSubset: Setter<string>;
}> = (props) => {
  const modes = ['copyright'] as const;
  return (
    <div class="fixed top-4 right-4 left-4 flex w-full gap-8 bg-white/50 p-4 backdrop-blur-sm">
      <select value={props.mode()} onChange={(e) => props.setMode(e.target.value as Mode)}>
        {modes.map((mode) => (
          <option value={mode}>{mode}</option>
        ))}
      </select>
      <Show when={props.mode() === 'copyright'}>
        <div class="flex gap-8">
          <For each={Object.entries(colorByYear)}>
            {([year, color]) => (
              <button class="flex cursor-pointer items-center gap-1" onClick={[props.setSelectedSubset, year]}>
                <span
                  class="size-2 rounded-full"
                  classList={{ 'scale-150 -translate-x-1': props.selectedSubset() === year }}
                  style={{ background: color }}
                />
                <span
                  classList={{
                    'text-neutral-950': props.selectedSubset() === year,
                    'text-neutral-800': props.selectedSubset() !== year,
                  }}
                >
                  {year}
                </span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
