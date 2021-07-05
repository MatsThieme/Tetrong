import { Difficulty } from 'Behaviours/Tetris/Difficulty';
import { Storage } from 'Behaviours/Tetris/Storage';
import { BallPrefab } from 'Prefabs/BallPrefab';
import { BottomBoundaryPrefab } from 'Prefabs/BottomBoundaryPrefab';
import { CameraPrefab } from 'Prefabs/CameraPrefab';
import { PlatformPrefab } from 'Prefabs/PlatformPrefab';
import { TopBoundaryPrefab } from 'Prefabs/TopBoundaryPrefab';
import { FPSDisplayPrefab } from 'Prefabs/UI/FPSDisplayPrefab';
import { ScoreDisplayPrefab } from 'Prefabs/UI/ScoreDisplayPrefab';
import { Client, Input, InputDeviceType, Instantiate, Interval, Scene } from 'SE';

export async function MainScene(scene: Scene) {
    scene.physics.gravity.y *= 2;

    scene.physics.gravity.y *= Difficulty[Storage.gameMode];
    scene.physics.positionIterations = Math.ceil(scene.physics.positionIterations * Difficulty[Storage.gameMode]);
    scene.physics.velocityIterations = Math.ceil(scene.physics.velocityIterations * Difficulty[Storage.gameMode]);


    if (Client.isMobile) Input.devices = InputDeviceType.Touch;
    else Input.devices = InputDeviceType.Mouse;

    new Interval(async i => {
        const fps = await scene.framedata.measureFps(250);

        if (fps < Client.monitorRefreshRate * 0.95 && scene.cameraManager.renderScale > 0.65) {
            scene.cameraManager.renderScale -= 0.1;
        } else {
            i.clear();
        }

        console.log(scene.cameraManager.renderScale);
    }, 300);


    await scene.ui.addMenu('FPS Display', FPSDisplayPrefab);
    await scene.ui.addMenu('Score Display', ScoreDisplayPrefab);

    await Instantiate('Camera', CameraPrefab);

    await Instantiate('Platform 1', PlatformPrefab);
    await Instantiate('Platform 2', PlatformPrefab);

    await Instantiate('Ball', BallPrefab);

    await Instantiate('TopBoundary', TopBoundaryPrefab);
    await Instantiate('BottomBoundary', BottomBoundaryPrefab);
}