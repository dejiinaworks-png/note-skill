#!/usr/bin/env python3
"""
Venv wrapper for nanobanana2 — runs scripts inside a managed virtual environment.

Usage:
    python scripts/run.py generate.py --prompt "..." --output out.png
"""

import os
import sys
import subprocess
from pathlib import Path

SKILL_ROOT = Path(__file__).parent.parent.absolute()
VENV_DIR = SKILL_ROOT / ".venv"
SCRIPTS_DIR = SKILL_ROOT / "scripts"


def setup_venv():
    if VENV_DIR.exists():
        return True
    print("[nanobanana2] Creating virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", str(VENV_DIR)], check=True)
    return True


def install_deps():
    marker = VENV_DIR / ".installed"
    if marker.exists():
        return True
    req = SKILL_ROOT / "requirements.txt"
    if not req.exists():
        return True
    pip = VENV_DIR / "Scripts" / "pip.exe" if sys.platform == "win32" else VENV_DIR / "bin" / "pip"
    print("[nanobanana2] Installing dependencies...")
    subprocess.run([str(pip), "install", "--upgrade", "pip"], check=True, capture_output=True)
    subprocess.run([str(pip), "install", "-r", str(req)], check=True)
    marker.write_text("ok")
    print("[nanobanana2] Dependencies ready.")
    return True


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/run.py <script.py> [args...]")
        for s in SCRIPTS_DIR.glob("*.py"):
            if s.name != "run.py":
                print(f"  {s.name}")
        sys.exit(1)

    setup_venv()
    install_deps()

    python = VENV_DIR / "Scripts" / "python.exe" if sys.platform == "win32" else VENV_DIR / "bin" / "python"
    script = SCRIPTS_DIR / sys.argv[1]

    if not script.exists():
        print(f"[nanobanana2] Script not found: {script}")
        sys.exit(1)

    result = subprocess.run(
        [str(python), str(script)] + sys.argv[2:],
        cwd=SKILL_ROOT,
        env={**os.environ, "PYTHONPATH": str(SKILL_ROOT)},
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
