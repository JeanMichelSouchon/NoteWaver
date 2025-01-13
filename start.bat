@echo off
:: ------------------------------------------
:: Start Script for Docker Compose
:: ------------------------------------------

:: Function to clean the database folder
set DB_PATH=".\database\datas"

:: Help Section
if "%1"=="--help" (
    echo ========================================
    echo Usage: start.bat [OPTION]
    echo OPTIONS:
    echo   --clean         Clean the database folder only
    echo   --build         Start Docker Compose without cleaning
    echo   --clean-build   Clean the database folder and start Docker Compose
    echo   --help          Show this help message
    echo ========================================
    exit /b
)

:: Quick option handling
if "%1"=="--clean" goto clean_database_only
if "%1"=="--build" goto start_docker
if "%1"=="--clean-build" goto clean_and_build

:: Menu prompt if no parameter is provided
:menu
echo ========================================
echo What would you like to do?
echo.
echo [1] CLEAN ONLY  - Clean the database folder
echo.
echo [2] CLEAN AND BUILD - Clean the database folder and start Docker Compose
echo.
echo [3] BUILD ONLY - Start Docker Compose without cleaning
echo.
echo ========================================
echo.
set /p choice="Enter your choice ( 1 / 2 / 3 ) : "

if "%choice%" == "1" goto clean_database_only
if "%choice%" == "2" goto clean_and_build
if "%choice%" == "3" goto start_docker

:: Handle invalid choices
echo Invalid choice. Please select 1, 2, or 3.
goto menu

:: Clean the database folder only
:clean_database_only
echo Cleaning the database folder...
call :clean_database
goto end

:: Clean and build Docker
:clean_and_build
echo Cleaning the database folder...
call :clean_database
goto start_docker

:: Function to clean the database folder
:clean_database
if exist %DB_PATH% (
    echo Removing database folder...
    rmdir /s /q %DB_PATH%
    if exist %DB_PATH% (
        echo Failed to remove the database folder. Check permissions.
        exit /b
    )
    mkdir %DB_PATH%
    echo Database folder cleaned and recreated successfully!
) else (
    echo Database folder not found. Creating a new one...
    mkdir %DB_PATH%
)
exit /b

:: Start Docker Compose
:start_docker
echo ========================================
echo Starting Docker Compose...
echo ========================================
docker-compose up --build

:end
:: Keep the window open if necessary
pause
