#!/usr/bin/env python3
"""Fix corrupted Jupyter notebooks by restoring proper JSON format."""

import json
import os
import re
import glob

def fix_notebook(filepath):
    """Fix a corrupted notebook by restoring \\n escape sequences."""
    print(f"Processing: {os.path.basename(filepath)}...", end=" ", flush=True)

    try:
        # Read raw content
        with open(filepath, 'rb') as f:
            raw = f.read()

        # Remove BOM if present
        if raw.startswith(b'\xef\xbb\xbf'):
            raw = raw[3:]

        content = raw.decode('utf-8')

        # The issue: actual newlines inside JSON strings need to be \\n
        # Strategy: Parse line by line and fix strings that span multiple lines

        # Remove extra blank lines that were inserted
        lines = content.split('\n')

        # Filter out empty lines that shouldn't be there (between JSON elements)
        fixed_lines = []
        prev_empty = False
        for line in lines:
            stripped = line.strip()
            if stripped == '':
                if prev_empty:
                    continue  # Skip consecutive empty lines
                prev_empty = True
            else:
                prev_empty = False
            fixed_lines.append(line)

        # Now rebuild, converting newlines inside strings to \\n
        content = '\n'.join(fixed_lines)

        # Fix strings that have actual newlines - they should have \\n
        # Pattern: inside "source": [...] arrays, fix the strings

        # Try to parse - if it works, great!
        try:
            nb = json.loads(content)
            cell_count = len(nb.get('cells', []))
            # Already valid, just save cleaned version
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(nb, f, indent=1, ensure_ascii=False)
            print(f"✅ Fixed ({cell_count} cells)")
            return True
        except json.JSONDecodeError:
            pass

        # More aggressive fix: rebuild the JSON structure
        # Find all string values and escape newlines properly

        # Use regex to find strings and fix them
        def fix_string_content(match):
            s = match.group(0)
            # Replace actual newlines with \\n (but not already escaped ones)
            inner = s[1:-1]  # Remove quotes
            inner = inner.replace('\n', '\\n')
            inner = inner.replace('\r', '\\r')
            inner = inner.replace('\t', '\\t')
            return '"' + inner + '"'

        # This is tricky - let's try a different approach
        # Read the file and manually rebuild valid JSON

        # Fix approach: process character by character
        # 1. Convert actual newlines in strings to \n
        # 2. Remove invalid escape sequences like \X where X is not valid
        result = []
        in_string = False
        i = 0

        while i < len(content):
            c = content[i]

            # Handle escape sequences
            if c == '\\' and in_string and i + 1 < len(content):
                next_c = content[i + 1]
                # Valid JSON escapes: " \ / b f n r t u
                if next_c in '"\\\/bfnrtu':
                    result.append(c)
                    result.append(next_c)
                    i += 2
                    continue
                else:
                    # Invalid escape - skip the backslash, keep the character
                    # e.g., \{ becomes {, \T becomes T
                    i += 1  # Skip backslash
                    continue

            if c == '"':
                in_string = not in_string
                result.append(c)
                i += 1
                continue

            if in_string and c == '\n':
                result.append('\\n')
                i += 1
                continue

            if in_string and c == '\r':
                result.append('\\r')
                i += 1
                continue

            if in_string and c == '\t':
                result.append('\\t')
                i += 1
                continue

            result.append(c)
            i += 1

        fixed_content = ''.join(result)

        # Validate
        try:
            nb = json.loads(fixed_content)
            cell_count = len(nb.get('cells', []))
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(nb, f, indent=1, ensure_ascii=False)
            print(f"✅ Fixed ({cell_count} cells)")
            return True
        except json.JSONDecodeError as e:
            print(f"❌ JSON Error: {str(e)[:60]}")
            return False

    except Exception as e:
        print(f"❌ Error: {str(e)[:60]}")
        return False

def main():
    print("=== Fixing All Jupyter Notebooks ===\n")

    notebooks = sorted(glob.glob("*.ipynb"))

    if not notebooks:
        print("No notebooks found")
        return

    fixed_count = 0
    for notebook in notebooks:
        if fix_notebook(notebook):
            fixed_count += 1

    print(f"\n{'='*50}")
    print(f"RESULT: {fixed_count}/{len(notebooks)} notebooks fixed")
    print(f"{'='*50}")

    if fixed_count == len(notebooks):
        print("\n✅ All notebooks should now open in VS Code!")

if __name__ == "__main__":
    main()

