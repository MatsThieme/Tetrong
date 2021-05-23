import { TetrominoMatrix } from 'Prefabs/Tetromino/TetrominoMatrix';
import { Behaviour, Stopwatch, Vector2 } from 'SE';
import { Tetris } from './Tetris/Tetris';

export class TetrominoSpawnBehaviour extends Behaviour {
    sw!: Stopwatch;
    spawnInterval = 2000;
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

            this.sw = new Stopwatch();
        }
    }
}