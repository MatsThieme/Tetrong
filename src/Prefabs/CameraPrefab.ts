import { PlatformMoveBehaviour } from 'Behaviours/PlatformMoveBehaviour';
import { TetrominoSpawnBehaviour } from 'Behaviours/TetrominoSpawnBehaviour';
import { AudioListener, Camera, Client, GameObject } from 'SE';

export function CameraPrefab(gameObject: GameObject) {
    gameObject.addComponent(Camera, camera => {
        camera.size = Client.aspectRatio;
    });

    gameObject.addComponent(PlatformMoveBehaviour);
    gameObject.addComponent(TetrominoSpawnBehaviour);

    gameObject.addComponent(AudioListener);
}