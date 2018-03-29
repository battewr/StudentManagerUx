@echo off

echo ----------
echo Running ts-lint task....
echo ----------
call node_modules/.bin/tslint --project tsconfig.json
if errorlevel 1 goto FAIL

echo ----------
echo Running webpack task....
echo ----------
call node_modules/.bin/webpack --progress --colors --display-error-details --display-reasons
if errorlevel 1 goto FAIL
set exit_level=0
echo ----------
echo Build Successful.
echo ----------
goto DONE

:FAIL
echo ----------
echo Build Failed!
echo ----------
set exit_level=1

:DONE

exit /b exit_level