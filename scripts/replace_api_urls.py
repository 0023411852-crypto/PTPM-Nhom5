from pathlib import Path

root = Path(__file__).resolve().parents[1] / "cloud-service-frontend" / "src"
old = "http://localhost:5154"
changed = []

for path in root.rglob("*"):
    if path.suffix not in {".ts", ".tsx"}:
        continue
    text = path.read_text(encoding="utf-8")
    if old not in text:
        continue
    updated = text.replace(old, "")
    path.write_text(updated, encoding="utf-8")
    changed.append(str(path.relative_to(root)))

print(f"Updated {len(changed)} files")
for item in changed:
    print(item)
