#!/usr/bin/env python3
"""
CLI & Helper Script for running Fish Audio S2 Pro F16 GGUF via s2.cpp
"""

import argparse
import os
import subprocess
import sys


def download_models(model_dir: str = "."):
    """Download s2-pro-f16.gguf and tokenizer.json using huggingface_hub."""
    try:
        from huggingface_hub import hf_hub_download
    except ImportError:
        print("[!] huggingface_hub is required. Install it using: pip install huggingface_hub hf_transfer")
        sys.exit(1)

    os.environ.setdefault("HF_HUB_ENABLE_HF_TRANSFER", "1")
    repo_id = "rodrigomt/s2-pro-gguf"

    print(f"[*] Downloading tokenizer.json to {model_dir}...")
    hf_hub_download(repo_id=repo_id, filename="tokenizer.json", local_dir=model_dir)

    print(f"[*] Downloading s2-pro-f16.gguf (~9.9 GB) to {model_dir}...")
    hf_hub_download(repo_id=repo_id, filename="s2-pro-f16.gguf", local_dir=model_dir)
    print("[+] Download complete!")


def run_s2(
    binary_path: str,
    model_path: str,
    tokenizer_path: str,
    text: str,
    output_wav: str,
    cuda_device: int = 0,
    gpu_layers: int = -1,
    prompt_audio: str = None,
    prompt_text: str = None,
    temperature: float = 0.7,
    top_p: float = 0.8,
    codec_cpu: bool = False,
):
    """Execute s2 binary with specified parameters."""
    if not os.path.isfile(binary_path):
        print(f"[!] Error: binary '{binary_path}' not found. Did you build s2.cpp?")
        sys.exit(1)

    cmd = [
        binary_path,
        "--model", model_path,
        "--tokenizer", tokenizer_path,
        "--cuda", str(cuda_device),
        "--gpu-layers", str(gpu_layers),
        "--temperature", str(temperature),
        "--top-p", str(top_p),
        "--text", text,
        "--output", output_wav,
    ]

    if codec_cpu:
        cmd.append("--codec-cpu")

    if prompt_audio and prompt_text:
        cmd.extend(["--prompt-audio", prompt_audio, "--prompt-text", prompt_text])

    print(f"[*] Running command: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"[!] s2 inference failed with return code {result.returncode}")
        sys.exit(result.returncode)
    print(f"[+] Synthesis finished successfully! Output saved to: {output_wav}")


def main():
    parser = argparse.ArgumentParser(description="Run S2 Pro F16 GGUF TTS")
    parser.add_argument("--download", action="store_true", help="Download model and tokenizer")
    parser.add_argument("--bin", default="./build/s2", help="Path to s2 binary (default: ./build/s2)")
    parser.add_argument("--model", default="s2-pro-f16.gguf", help="Path to s2-pro-f16.gguf")
    parser.add_argument("--tokenizer", default="tokenizer.json", help="Path to tokenizer.json")
    parser.add_argument("--text", default="Halo, ini adalah pengujian suara S2 Pro F16.", help="Text to synthesize")
    parser.add_argument("--output", default="output.wav", help="Output WAV filename")
    parser.add_argument("--cuda", type=int, default=0, help="CUDA device index (-1 for CPU)")
    parser.add_argument("--gpu-layers", "-ngl", type=int, default=-1, help="Number of GPU layers (-1 for all)")
    parser.add_argument("--prompt-audio", default=None, help="Reference audio for voice cloning")
    parser.add_argument("--prompt-text", default=None, help="Reference transcript for voice cloning")
    parser.add_argument("--temp", type=float, default=0.7, help="Sampling temperature")
    parser.add_argument("--top-p", type=float, default=0.8, help="Top-p sampling")
    parser.add_argument("--codec-cpu", action="store_true", help="Run codec on CPU (saves VRAM)")

    args = parser.parse_args()

    if args.download:
        download_models(model_dir=os.path.dirname(args.model) or ".")
        return

    run_s2(
        binary_path=args.bin,
        model_path=args.model,
        tokenizer_path=args.tokenizer,
        text=args.text,
        output_wav=args.output,
        cuda_device=args.cuda,
        gpu_layers=args.gpu_layers,
        prompt_audio=args.prompt_audio,
        prompt_text=args.prompt_text,
        temperature=args.temp,
        top_p=args.top_p,
        codec_cpu=args.codec_cpu,
    )


if __name__ == "__main__":
    main()
