
@echo off
md .\release\wxgame\openData
xcopy /y .\rank\game.json  .\release\wxgame\
xcopy .\rank\openData  .\release\wxgame\openData\ /e

cd release/wxgame
"C:\Program Files\WinRAR\WinRAR.exe" a -e ../../pack.zip comp gameui prefab res test view fileconfig.json version.json MainScene.json
del fileconfig.json version.json MainScene.json
rd /s /q comp gameui prefab res test view
Pause
