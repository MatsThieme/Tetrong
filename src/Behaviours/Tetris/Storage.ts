import { Scene, UIText } from 'SE';

export class Storage {
    private static setVar(name: string, val: string | number): void {
        localStorage.setItem(name, '' + val);
    }
    private static getVar(name: string): string | undefined {
        return localStorage.getItem(name)!;
    }

    public static get highScore(): number {
        return Number(Storage.getVar(Storage.gameMode + 'HighScore')) || 0;
    }
    public static set highScore(val: number) {
        if (val > Storage.highScore) Storage.setVar(Storage.gameMode + 'HighScore', val);
    }

    public static get lastScore(): number {
        return Number(Storage.getVar(Storage.gameMode + 'LastScore')) || 0;
    }
    public static set lastScore(val: number) {
        Storage.setVar(Storage.gameMode + 'LastScore', val);
    }

    public static updateScoreDisplay(score: number): void {
        Scene.currentScene.ui.menu('Score Display')!.getUIElement<UIText>('Score')!.text = 'Score: ' + score;
    }

    public static get gameMode(): 'Easy' | 'Medium' | 'Hard' | 'Insane' {
        return <'Easy' | 'Medium' | 'Hard' | 'Insane' | undefined>Storage.getVar('gameMode') || 'Easy';
    }
    public static set gameMode(val: 'Easy' | 'Medium' | 'Hard' | 'Insane') {
        Storage.setVar('gameMode', val);
    }
}