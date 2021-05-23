import { BallPrefab } from 'Prefabs/BallPrefab';
import { BottomBoundaryPrefab } from 'Prefabs/BottomBoundaryPrefab';
import { CameraPrefab } from 'Prefabs/CameraPrefab';
import { FPSDisplayPrefab } from 'Prefabs/FPSDisplayPrefab';
import { PlatformPrefab } from 'Prefabs/PlatformPrefab';
import { TopBoundaryPrefab } from 'Prefabs/TopBoundaryPrefab';
import { Instantiate, Scene } from 'SE';

export async function MainScene(scene: Scene) {
    await scene.ui.addMenu('FPS Display', FPSDisplayPrefab);

    await Instantiate('Camera', CameraPrefab);

    await Instantiate('Platform 1', PlatformPrefab);
    await Instantiate('Platform 2', PlatformPrefab);

    await Instantiate('Ball', BallPrefab);

    await Instantiate('TopBoundary', TopBoundaryPrefab);
    await Instantiate('BottomBoundary', BottomBoundaryPrefab);
}