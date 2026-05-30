@echo off
title Buscador CEP PRO - Luiz Henrique
echo ========================================
echo   BUSCADOR DE CEP PRO - INSTALANDO
echo   Dev: Luiz Henrique - Campo Grande RJ
echo ========================================
echo.

REM Verifica se Node existe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado.
    echo.
    echo Baixe e instale primeiro: https://nodejs.org
    echo Depois rode este arquivo de novo.
    echo.
    pause
    exit
)

echo Node.js OK! Iniciando programa...
echo.
node busca-cep-pro.js

echo.
echo Programa finalizado. Arquivo salvo na pasta.
pause