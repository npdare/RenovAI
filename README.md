# RenovAI

This project uses Replicate and OpenAI to analyze and transform uploaded images.

## New Features

- YOLOv8 object detection via Replicate is now integrated in the V2 preprocessing pipeline.
- Each segmentation mask is pre‑labeled based on detected classes before analysis.

## API Updates

- `POST /api/v2/preprocess` now returns a `maskInfo` array containing predicted labels for each mask.
- `POST /api/v2/architectural-analysis` accepts optional `maskInfo` to improve element summaries.

## Dependencies

- Added `pngjs` for mask bounding box calculations.
- Added `@types/pngjs` as a dev dependency for TypeScript support.

Ensure `REPLICATE_API_TOKEN` and `OPENAI_API_KEY` are configured in the environment.
