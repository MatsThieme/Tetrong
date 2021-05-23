import { LoadingScreenScene } from 'Scenes/LoadingScreenScene';
import { MainScene } from 'Scenes/MainScene';
import { Assets, Color, SceneManager, Shape } from 'SE';

export class Game {
    public constructor(private readonly sceneManager = new SceneManager()) {
        this.initialize(this.sceneManager);
    }
    private async initialize(sceneManager: SceneManager): Promise<void> {
        sceneManager.add('Loading Screen Scene', LoadingScreenScene);
        sceneManager.add('Main Scene', MainScene);

        // load scene
        await sceneManager.load('Loading Screen Scene');


        Assets.set(Shape.createSprite('Rect', Color.orange), 'platform');

        await Assets.loadFromAssetDB();

        // await new Timeout(1000);

        await sceneManager.load('Main Scene');
    }
}