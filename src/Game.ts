import { TextStyle } from 'pixi.js';
import { LoadingScreenScene } from 'Scenes/LoadingScreenScene';
import { MainMenuScene } from 'Scenes/MainMenuScene';
import { MainScene } from 'Scenes/MainScene';
import { Assets, Client, Color, SceneManager, Shape, UIFonts } from 'SE';

export class Game {
    async initialize(sceneManager: SceneManager): Promise<void> {
        sceneManager.add('Loading Screen Scene', LoadingScreenScene);
        sceneManager.add('Main Menu Scene', MainMenuScene);
        sceneManager.add('Main Scene', MainScene);

        if (Client.isMobile) Client.requestFullscreen(document.body);

        await sceneManager.load('Loading Screen Scene');

        Assets.set('platform', Shape.createSprite('Rect', Color.orange));

        await Assets.loadFromAssetDB();


        UIFonts.add('Red-Normal', new TextStyle({
            fontFamily: 'Verdana, Tahoma, sans-serif',
            fontSize: 7,
            fill: Color.red.rgbString,
            stroke: Color.black.rgbString,
            strokeThickness: 0.3
        }));

        UIFonts.add('Red-Large', new TextStyle({
            fontFamily: 'Verdana, Tahoma, sans-serif',
            fontSize: 15,
            fill: Color.red.rgbString,
            stroke: Color.black.rgbString,
            strokeThickness: 0.3
        }));


        await sceneManager.load('Main Menu Scene');
    }
}