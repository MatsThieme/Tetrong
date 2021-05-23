import { Scene, UIText } from 'SE';

export class SaveScore {
    public static get highScore(): number {
        return Number(localStorage.getItem('highScore')) || 0;
    }
    public static set highScore(val: number) {
        if (val > SaveScore.highScore) localStorage.setItem('highScore', val + '');
    }

    public static get lastScore(): number {
        return Number(localStorage.getItem('lastScore')) || 0;
    }
    public static set lastScore(val: number) {
        localStorage.setItem('lastScore', val + '');
    }

    private static updateMainMenuScore(): void {

    }

    public static updateScoreDisplay(score: number): void {
        Scene.currentScene.ui.menu('Score Display')!.getUIElement<UIText>('Score')!.text = 'Score: ' + score;
    }
}