from googletrans import Translator
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import torch
import sys

def midjourney_diffusion(prompt):

    translator = Translator()

    _prompt = translator.translate(prompt)

    model_id = "stabilityai/stable-diffusion-2-1"
    # model_id = "flax/midjourney-v4-diffusion"

    pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32)
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)

    imagePath = "cache/image.png"

    image = pipe(_prompt.text).images[0]
    image.save(imagePath)

    print('\n\n\n\n\n\n\n\nDOONEEEEE')

del sys.argv[0]
prompt = " ".join(sys.argv)

if __name__ == '__main__':
    midjourney_diffusion(prompt)
