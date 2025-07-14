# indonesia mapper

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

attributes:

```
{
  gen: 1 | 2 | 3 | 4 | 'trekker'
  copyright: string
  car: {
    color: 'black' | 'white' | 'gray' | 'transparent' | 'other'
    drivingDirection: number (deg) -> angle represented as an arrow instead of dot
    - is truck
    - has antenna
  }
  landscape: {
    soil: 'red' | 'brown'
    visibleAshes: boolean
    oilPalms: boolean
    ricePaddy: boolean
    bananaPalms: boolean
    lollipopPalms: boolean
  }
  architecture: {
    - has brick roof
    - has plastic fake-brick roof
    - has metal roof
    - has blue roof
    - has woodchip roof
    - has crowned roof
    - has gabled roof
    - has curved riau roof
    - has sumba pizzahut roof
    - has north suma roof
    - has west suma roof
    - has sula saddle roof
    - has palm leaf roof
    - has sula painted fence
  }
  poles: {
    - has steel pole
    - has metal pole
    - pole has snake trap
    - pole has jakarta triangle
    - pole is in 2 and 1 configuration
    - pole is in perfectly balanced configuration
    - pole is trident style
    - pole as bali rectangle
    - pole has sula bandaid
    - pole has nusa support
    - pole has 35 degree angled supports
    - has balanced pole tops
    - has unbalanced pole tops
  }
}
```

idea for the procedure:

- start with 1 kabupaten
- distribute 100 points in it
- create a "queue" item for each point. just { lat, lon } to begin with.
- find the nearest streetview image for each queued item, and add the streetview lat/lon to this data.
- cull any streetview image within some distance of all the others
- write the remaining queue items to files. one file per point.
- on a separate website, process each queue file. this does the following:
  - if none within radius {n}, delete the file
  - otherwise, use computer vision llm to traverse streetview until it has a good view of a pole {or rooftop} {or landscape feature}
  - once it's settled, record the streetview metadata (lat, lon, heading, altitude)
  - then zoom in on the pole. bring up the reference chart and categorize the pole with it.
  - then zoom out all the way and pan down to check the car, and record that data.
  - save all recorded data to a file and delete the queue file
- work on the next queued item

see:

- https://maplibre.org/maplibre-gl-js/docs/examples/create-and-style-clusters/
- https://maplibre.org/maplibre-gl-js/docs/examples/display-a-popup-on-hover/
- https://maplibre.org/maplibre-gl-js/docs/examples/get-coordinates-of-the-mouse-pointer/
- https://maplibre.org/maplibre-gl-js/docs/examples/restrict-map-panning-to-an-area/
- https://maplibre.org/maplibre-gl-js/docs/examples/view-a-fullscreen-map/
- https://maplibre.org/maplibre-gl-js/docs/examples/visualize-population-density/
- https://maplibre.org/maplibre-gl-js/docs/examples/display-a-hybrid-satellite-map-with-terrain-elevation/
- https://www.npmjs.com/package/geojson-rbush
- https://data.humdata.org/dataset/geoboundaries-admin-boundaries-for-indonesia
- https://commons.wikimedia.org/wiki/File%3AVariation_of_religious_affiliation_in_Indonesia_by_district_%282022%29.svg
- https://www.kaggle.com/datasets/fajarkhaswara/religion-in-indonesia
- https://code.highcharts.com/mapdata/countries/id/id-all.geo.json
- https://github.com/aesqe/mapboxgl-minimap?tab=readme-ov-file
- https://github.com/rezw4n/maplibre-google-streetview

credits:

- https://github.com/Caknoooo/provinces-cities-indonesia/blob/main/json/regencies.json
- https://data.humdata.org/dataset/geoboundaries-admin-boundaries-for-indonesia
