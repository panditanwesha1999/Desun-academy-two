@echo off
cd /d "%~dp0site"
echo Open http://localhost:8000 in your browser. Press Ctrl+C to stop.
start "" http://localhost:8000/
python -m http.server 8000
