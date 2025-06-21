# RenovAI Python backend using Replicate and OpenAI APIs
# Provides utility functions and a FastAPI server that mirrors a subset of the
# Node.js endpoints. Generated images are saved under the existing `uploads/`
# directory so the web client can access them just like the Node server results.

import os
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional

import openai
import replicate
from fastapi import FastAPI, File, UploadFile, Form
from PIL import Image

# Initialise external API clients
openai.api_key = os.environ.get("OPENAI_API_KEY")
_replicate = replicate.Client(api_token=os.environ.get("REPLICATE_API_TOKEN"))

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def _save_temp(file: UploadFile) -> Path:
    """Save uploaded file to a temporary path in uploads."""
    suffix = Path(file.filename).suffix or ".jpg"
    tmp = UPLOAD_DIR / f"tmp_{uuid.uuid4().hex}{suffix}"
    with tmp.open("wb") as f:
        f.write(file.file.read())
    return tmp


def extract_styles(image_paths: List[Path]) -> List[str]:
    """Return concise style descriptors for each reference image."""
    styles = []
    for path in image_paths:
        # BLIP-2 caption
        caption = _replicate.run(
            "salesforce/blip2:2ef6d6db0544a5049d2b8670a601390f3465f3e88741cd26b9c7724d83eeaa5e",
            input={"image": open(path, "rb")},
        )
        if isinstance(caption, list):
            caption = caption[0]
        # Summarise with GPT-4 to a short style label
        chat = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Condense the image caption to a short style name."},
                {"role": "user", "content": caption},
            ],
        )
        styles.append(chat.choices[0].message.content.strip())
    return styles


def segment_image(base_image: Path) -> List[Path]:
    """Run SAM on the image and return mask file paths."""
    result = _replicate.run(
        "facebookresearch/segment-anything:6bcc945c97e7b98bfcd8a56c8d0dafebde28aa5d8e7b3df8a54de9d0f006c09c",
        input={"image": open(base_image, "rb"), "model_type": "vit_h"},
    )
    masks: List[Path] = []
    for i, url in enumerate(result):
        mask_data = replicate.files.download(url)
        mask_path = UPLOAD_DIR / f"mask_{uuid.uuid4().hex}_{i}.png"
        with open(mask_path, "wb") as f:
            f.write(mask_data.getbuffer())
        masks.append(mask_path)
    return masks


def generate_design_rules(styles: List[str]) -> str:
    """Use GPT-4 to create design rules based on extracted styles."""
    prompt = "\n".join(f"- {s}" for s in styles)
    chat = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert interior designer."},
            {
                "role": "user",
                "content": f"Create concise design guidelines combining these styles:\n{prompt}"
            },
        ],
    )
    return chat.choices[0].message.content.strip()


def prepare_controlnet_inputs(masks: List[Path], layout_edits: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Prepare payload for ControlNet using selected masks and layout edits."""
    # Combine masks by stacking them. For a minimal example just pick first mask.
    control_image = masks[0]
    if layout_edits:
        # apply simple crop or resize to reflect edits
        img = Image.open(control_image)
        if edit := layout_edits.get("crop"):
            x, y, w, h = edit
            img = img.crop((x, y, x + w, y + h))
        img.save(control_image)
    return {"control_image": open(control_image, "rb")}


def compose_render(
    base_image: Path,
    controlnet_payload: Dict[str, Any],
    prompt: str,
    negative_prompt: str | None = None,
) -> Path:
    """Run ControlNet+SD pipeline to produce final render and save it."""
    sd_input = {
        "image": open(base_image, "rb"),
        "prompt": prompt,
        **controlnet_payload,
    }
    if negative_prompt:
        sd_input["negative_prompt"] = negative_prompt

    result = _replicate.run(
        "lllyasviel/control_v11p_sd15_canny:0b0e1b11830c80558b65fb7d884fd252916f1bdd0a4f2c5444c9481cbdae36e2",
        input=sd_input,
    )
    if isinstance(result, list):
        result = result[0]
    output_data = replicate.files.download(result)
    out_path = UPLOAD_DIR / f"render_{uuid.uuid4().hex}.png"
    with open(out_path, "wb") as f:
        f.write(output_data.getbuffer())
    return out_path


app = FastAPI()


@app.post("/api/v2/preprocess")
async def preprocess(photo: UploadFile = File(...)):
    photo_path = _save_temp(photo)
    masks = segment_image(photo_path)
    return {
        "jobId": photo_path.stem,
        "maskURIs": [f"/uploads/{p.name}" for p in masks],
        "original": f"/uploads/{photo_path.name}",
    }


@app.post("/api/v2/architectural-analysis")
async def arch_analysis(
    jobId: str = Form(...),
    styleImages: List[UploadFile] = File([]),
):
    image_paths = [_save_temp(img) for img in styleImages]
    styles = extract_styles(image_paths)
    rules = generate_design_rules(styles)
    return {"jobId": jobId, "styles": styles, "designRules": rules}


@app.post("/api/v2/transform-image")
async def transform(
    jobId: str = Form(...),
    prompt: str = Form(...),
    negativePrompt: str | None = Form(None),
    maskPaths: List[str] = Form([]),
):
    masks = [UPLOAD_DIR / Path(p).name for p in maskPaths if p]
    base_path = UPLOAD_DIR / f"{jobId}.jpg"
    control_payload = prepare_controlnet_inputs(masks, None)
    result = compose_render(base_path, control_payload, prompt, negativePrompt)
    return {"resultURI": f"/uploads/{result.name}"}


def create_app():
    return app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
