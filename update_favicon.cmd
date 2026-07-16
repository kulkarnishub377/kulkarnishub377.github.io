@echo off
set "SOURCE=C:\Users\127460\.gemini\antigravity-ide\brain\29d0b2af-9ef8-4789-b469-c8cfc5b23add\sk_logo_professional_1784180036373.png"
set "DEST=d:\SK_docs\projet\kulkarnishub377.github.io\favicon"

echo Updating favicons...
copy /Y "%SOURCE%" "%DEST%\favicon-16x16.png"
copy /Y "%SOURCE%" "%DEST%\favicon-32x32.png"
copy /Y "%SOURCE%" "%DEST%\android-chrome-192x192.png"
copy /Y "%SOURCE%" "%DEST%\android-chrome-512x512.png"
copy /Y "%SOURCE%" "%DEST%\apple-touch-icon.png"
copy /Y "%SOURCE%" "%DEST%\favicon.ico"

echo.
echo Favicons updated successfully!
pause
