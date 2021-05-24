import { PlatformMoveBehaviour } from 'Behaviours/PlatformMoveBehaviour';
import { TetrominoSpawnBehaviour } from 'Behaviours/TetrominoSpawnBehaviour';
import { AudioListener, Camera, GameObject, Vector2 } from 'SE';

export function CameraPrefab(gameObject: GameObject) {
    gameObject.addComponent(Camera, camera => {
        camera.size = new Vector2(16, 9);
        camera.fitAspectRatio = true;
        console.log(camera.size)
    });

    gameObject.addComponent(PlatformMoveBehaviour);
    gameObject.addComponent(TetrominoSpawnBehaviour);

    gameObject.addComponent(AudioListener);
}