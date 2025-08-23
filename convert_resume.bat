@echo off
echo Converting resume.md to resume.docx...
pandoc resume.md -o resume.docx
echo Conversion complete!
pause