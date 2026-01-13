@echo off
echo ==========================================
echo   SUDOKU DEPLOYMENT SCRIPT
echo ==========================================

:: 1. Build the React application
echo [1/4] Building the project...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo Build failed! Exiting...
    exit /b %ERRORLEVEL%
)

:: 2. Move into the build folder
cd build

:: 3. Initialize a temporary Git repo and commit
echo [2/4] Packaging build files...
git init
git checkout -b gh-pages
git add -A
git commit -m "Auto-deploy via batch script"

:: 4. Force push to the gh-pages branch
echo [3/4] Pushing to GitHub...
git push -f https://github.com/dcostap/sudoku.git gh-pages

:: 5. Cleanup and return to root
cd ..
echo ==========================================
echo [4/4] SUCCESS! 
echo Your site is updating at: https://sudoku.dariocosta.dev
echo ==========================================
pause