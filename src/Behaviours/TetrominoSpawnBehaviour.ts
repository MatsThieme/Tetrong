import { TetrominoMatrix } from 'Prefabs/Tetromino/TetrominoMatrix';
import { Behaviour, Scene, Stopwatch, Vector2 } from 'SE';
import { Difficulty } from './Tetris/Difficulty';
import { Storage } from './Tetris/Storage';
import { Tetris } from './Tetris/Tetris';

export class TetrominoSpawnBehaviour extends Behaviour {
    sw!: Stopwatch;
    spawnInterval = 1200 / Difficulty[Storage.gameMode];
    tetris!: Tetris;

    start() {
        this.sw = new Stopwatch();

        TetrominoMatrix.init();

        this.tetris = new Tetris(new Vector2(Math.ceil(7 / Difficulty[Storage.gameMode]), 8), 0.9);
    }

    async earlyUpdate() {
        if (this.sw.milliseconds >= this.spawnInterval) {
            await this.tetris.instantiateNextTetromino();

            if (this.tetris.matrixFull) {
                Storage.highScore = Storage.lastScore = this.tetris.score;
                Scene.sceneManager.load('Main Menu Scene');
            }

            this.sw = new Stopwatch();
        }
    }
}