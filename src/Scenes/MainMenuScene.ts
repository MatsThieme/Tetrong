import { MainMenuPrefab } from 'Prefabs/UI/MainMenuPrefab';
import { Scene } from 'SE';

export async function MainMenuScene(scene: Scene) {
    await scene.ui.addMenu('Main Menu', MainMenuPrefab);
}