import { BallPrefab } from 'Prefabs/BallPrefab';
import { BottomBoundaryPrefab } from 'Prefabs/BottomBoundaryPrefab';
import { CameraPrefab } from 'Prefabs/CameraPrefab';
import { PlatformPrefab } from 'Prefabs/PlatformPrefab';
import { TopBoundaryPrefab } from 'Prefabs/TopBoundaryPrefab';
import { FPSDisplayPrefab } from 'Prefabs/UI/FPSDisplayPrefab';
import { ScoreDisplayPrefab } from 'Prefabs/UI/ScoreDisplayPrefab';
import { Client, EventHandler, Input, InputDeviceType, Instantiate, Scene } from 'SE';

export async function MainScene(scene: Scene) {
    await scene.ui.addMenu('FPS Display', FPSDisplayPrefab);
    await scene.ui.addMenu('Score Display', ScoreDisplayPrefab);

    await Instantiate('Camera', CameraPrefab);

    await Instantiate('Platform 1', PlatformPrefab);
    await Instantiate('Platform 2', PlatformPrefab);

    await Instantiate('Ball', BallPrefab);

    await Instantiate('TopBoundary', TopBoundaryPrefab);
    await Instantiate('BottomBoundary', BottomBoundaryPrefab);


    if (Client.isMobile) {
        scene.cameraManager.renderScale = 0.8;
        Input.devices = InputDeviceType.Touch;
    } else Input.devices = InputDeviceType.Mouse;

    scene.physics.gravity.y *= 2;


    Input.addListener('Trigger', new EventHandler(e => {
        if (e.button?.click) {
            console.log('ay');
        }
    }));
}