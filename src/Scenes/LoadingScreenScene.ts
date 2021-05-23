import { LoadingScreenPrefab } from 'Prefabs/UI/LoadingScreenPrefab';
import { Scene } from 'SE';

export async function LoadingScreenScene(scene: Scene) {
    await scene.ui.addMenu('Loadingscreen', LoadingScreenPrefab);
}