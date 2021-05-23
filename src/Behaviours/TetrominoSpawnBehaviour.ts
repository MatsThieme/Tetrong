import { TetrominoMatrix } from 'Prefabs/Tetromino/TetrominoMatrix';
import { Behaviour, Scene, Stopwatch, Vector2 } from 'SE';
import { SaveScore } from './Tetris/SaveScore';
import { Tetris } from './Tetris/Tetris';

export class TetrominoSpawnBehaviour extends Behaviour {
    sw!: Stopwatch;
    spawnInterval = 1500;
    counter = 0;
    tetris!: Tetris;

    start() {
        this.sw = new Stopwatch();

        TetrominoMatrix.init();

        this.tetris = new Tetris(new Vector2(7, 10), 0.75);
    }

    async earlyUpdate() {
        if (this.sw.milliseconds >= this.spawnInterval) {
            await this.tetris.instantiateNextTetromino();

            if (this.tetris.matrixFull) {
                SaveScore.highScore = SaveScore.lastScore = this.tetris.score;
                Scene.sceneManager.load('Main Menu Scene');
            }

            this.sw = new Stopwatch();
        }
    }
}