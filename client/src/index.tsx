/* @refresh reload */
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import maplibregl from 'maplibre-gl';
import { App } from './App';
import { initializeMap } from './map';
import type { CoveredPoint } from './types';

import './index.css';

const [hoveredPoint, setHoveredPoint] = createSignal<CoveredPoint | undefined>();
const [mode, setMode] = createSignal<'copyright'>('copyright');
const [selectedSubset, setSelectedSubset] = createSignal('all');

const map = new maplibregl.Map({
  container: 'map', // html map div id
  style: 'https://demotiles.maplibre.org/style.json',
  center: [117.0, -2.5], // starting position [lng, lat] centered on Indonesia
  zoom: 4,
});

initializeMap({
  map,
  setHoveredPoint,
  mode,
  selectedSubset,
});

render(
  () => (
    <App
      hoveredPoint={hoveredPoint}
      mode={mode}
      setMode={setMode}
      selectedSubset={selectedSubset}
      setSelectedSubset={setSelectedSubset}
    />
  ),
  document.getElementById('app')!,
);
