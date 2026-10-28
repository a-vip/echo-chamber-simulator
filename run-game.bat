@echo off
title The Echo Chamber Simulator (Real-Time Feed Rot)
color 0e
echo ======================================================================
echo    THE ECHO CHAMBER SIMULATOR - DESKTOP LAUNCHER
echo ======================================================================
echo Launching local algorithmic server...
python "%~dp0launcher.py"
if %ERRORLEVEL% NEQ 0 (
    echo Python not found, launching index.html directly in default browser...
    start "" "%~dp0index.html"
)
pause

