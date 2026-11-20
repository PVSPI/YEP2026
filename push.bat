@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"
echo ===================================================
echo             YEP2026 - Quick Push to GitHub
echo ===================================================
echo.

git status --short
echo.

set "HAS_CHANGES="
for /f "delims=" %%i in ('git status --porcelain') do set "HAS_CHANGES=1"

for /f "delims=" %%i in ('git cherry origin/main 2^>nul') do set "HAS_UNPUSHED=1"

if not defined HAS_CHANGES (
    if not defined HAS_UNPUSHED (
        echo No changes or unpushed commits detected. Everything is up to date.
        echo.
        goto end
    ) else (
        echo You have unpushed commits ready to send.
    )
) else (
    set /p MSG="Enter commit message (Press Enter for 'Update files'): "
    if "!MSG!"=="" set MSG=Update files

    echo.
    echo Staging and committing changes...
    git add -A
    git commit -m "!MSG!"
)

echo.
echo Pulling latest updates from GitHub...
git pull --rebase origin main

echo.
echo Pushing changes to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo [ERROR] Push failed. If this is your first push, please complete GitHub authentication in the browser popup.
) else (
    echo.
    echo [SUCCESS] Changes pushed successfully to https://github.com/PVSPI/YEP2026
)

:end
echo.
echo ===================================================
pause
