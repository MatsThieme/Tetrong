import { Storage } from 'Behaviours/Tetris/Storage';
import { TetrominoBehaviour } from 'Behaviours/TetrominoBehaviour';
import { TetrominoMatrix } from 'Prefabs/Tetromino/TetrominoMatrix';
import { clamp, ComponentType, Instantiate, PolygonCollider, Vector2 } from 'SE';

export class Tetris {
    private _matrix: Uint32Array[];
    private _width: number;
    private _height: number;

    private _nextID: number;
    private _scale: number;


    public score: number;
    public readonly matrixFull: boolean;

    public constructor(size: Vector2, scale: number = 0.7) {
        this._matrix = [];

        for (let y = 0; y < size.y; y++) {
            this._matrix[y] = new Uint32Array(size.x);
        }

        this._width = size.x;
        this._height = size.y;
        this._nextID = 1;
        this._scale = scale;

        this.score = 0;
        this.matrixFull = false;
    }

    public async instantiateNextTetromino(): Promise<void> {
        if (this.matrixFull) return;

        const bestfit = this.getBestFit();

        if (bestfit.score === -1) {
            (<Mutable<Tetris>>this).matrixFull = true;
            return;
        }

        this.addToMatrix(bestfit.tetrominoIndex, bestfit.x, bestfit.y, this._nextID);


        const prefab = TetrominoMatrix.matrices[bestfit.tetrominoIndex].getPrefab();

        await Instantiate('Tetromino ' + this._nextID, prefab, go => {
            go.transform.scale.scale(this._scale);

            const c = go.getComponent<PolygonCollider>(ComponentType.PolygonCollider)!;
            go.transform.position.x = (bestfit.x - this._width / 2 + c.body!.position.x - c.bounds!.min.x) * this._scale;


            const bh = go.getComponent<TetrominoBehaviour>(ComponentType.Behaviour)!;
            bh.id = this._nextID;
            bh.tetris = this;
        });


        this._nextID++;
    }

    public removeTetromino(id: number): void {
        const matrix: [boolean, boolean, boolean, boolean][] = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]];
        let left = -1;
        let top = -1;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                if (this._matrix[y][x] === id) {
                    if (left === -1) left = x;
                    if (top === -1) top = y;

                    matrix[y - top][x - left] = true;
                    this._matrix[y][x] = 0;
                }
            }
        }


        if (top === 0) return;


        this.updateTetrominos();

        this.score++;

        Storage.updateScoreDisplay(this.score);
    }

    /**
     * 
     * No tests, use only to set after checking if the tetromino fits
     * 
     */
    private addToMatrix(tetrominoIndex: number, x: number, y: number, id: number): void {
        const matrix = TetrominoMatrix.matrices[tetrominoIndex].optimizedMatrix;

        for (let y_ = 0; y_ < matrix.length; y_++) {
            for (let x_ = 0; x_ < matrix[0].length; x_++) {
                if (matrix[y_][x_]) this._matrix[y + y_][x + x_] = id;
            }
        }
    }

    private canMoveTetromino(id: number): boolean {
        if (id === 0) return false;

        let counter = 0;

        for (let y = this._height - 2; y >= 0; y--) {
            for (let x = 0; x < this._width; x++) {
                if (this._matrix[y][x] === id && y + 1 < this._height && (this._matrix[y + 1][x] === 0 || this._matrix[y + 1][x] === id) && ++counter === 4) return true;
            }
        }

        return false;
    }

    /**
     * 
     * move tetromino with id downwards y+1 
     * 
     */
    private moveTetromino(id: number): void {
        let positions: Vector2[] = [];

        for (let y = this._height - 2; y >= 0; y--) {
            for (let x = this._width - 1; x >= 0; x--) {
                if (this._matrix[y][x] == id) {
                    positions.push(new Vector2(x, y + 1));
                    this._matrix[y][x] = 0;
                }
            }
        }

        for (const v of positions) {
            this._matrix[v.y][v.x] = id;
        }
    }

    private updateTetrominos() {
        for (let y = this._height - 2; y >= 0; y--) {
            for (let x = this._width - 1; x >= 0; x--) {
                const id = this._matrix[y][x];
                while (this.canMoveTetromino(id)) this.moveTetromino(id);
            }
        }
    }

    private getBestFit(): { score: number, x: number, y: number, tetrominoIndex: number } {
        let bestTetromino: { score: number, x: number, y: number, tetrominoIndex: number } = <any>{ score: -1, x: -1, y: -1, tetrominoIndex: -1 };


        const bottomY = this.getEmptyFieldClosestToBottom()[1];

        if (bottomY === -1) return bestTetromino;

        const topY = clamp(0, this._height, this.getEmptyLineClosestToBottom() - 3);


        for (let tetrominoIndex = 0; tetrominoIndex < TetrominoMatrix.matrices.length; tetrominoIndex++) {
            for (let y = clamp(0, this._height - TetrominoMatrix.matrices[tetrominoIndex].height, bottomY); y >= topY; y--) {
                for (let x = 0; x < this._width; x++) {
                    if (this.testTetromino(tetrominoIndex, x, y)) {
                        const score = this.getScore(tetrominoIndex, x, y) + clamp(0, 0.999, Math.random());
                        if (score > bestTetromino.score) bestTetromino = { score, x, y, tetrominoIndex };
                    }
                }
            }
        }

        return bestTetromino;
    }

    private testTetromino(tetrominoIndex: number, x: number, y: number): boolean {
        if (this.isBlockedAbove(tetrominoIndex, x, y)) return false;

        const matrix = TetrominoMatrix.matrices[tetrominoIndex].optimizedMatrix;

        if (x + matrix[0].length - 1 >= this._width || y + matrix.length - 1 >= this._height) return false;


        for (let y_ = 0; y_ < matrix.length; y_++) { // 0 at offset+matrix
            for (let x_ = 0; x_ < matrix[0].length; x_++) {
                if (matrix[y_][x_] && this._matrix[y + y_][x + x_] !== 0) return false;
            }
        }

        for (let x_ = 0; x_ < matrix[0].length; x_++) { // no 0 inside matrix
            for (let y_ = matrix.length - 1; y_ > 0; y_--) {
                if (matrix[y_][x_]) break;

                if (matrix[y_ - 1][x_]) {
                    if (this._matrix[y_ + y][x_ + x] === 0) return false;
                    break;
                }
            }
        }

        for (let x_ = 0; x_ < matrix[0].length; x_++) { // no 0 below matrix
            if (y + matrix.length < this._height && this._matrix[y + matrix.length][x + x_] === 0) return false;
        }

        return true;
    }

    /**
     * 
     * Use only if matrix has space for the tetromino
     * @returns the sum of the y position of the tetromino in the tetris matrix
     * 
     */
    private getScore(tetrominoIndex: number, x: number, y: number): number {
        const matrix = TetrominoMatrix.matrices[tetrominoIndex].optimizedMatrix;

        let score = 0;

        for (let y_ = 0; y_ < matrix.length; y_++) {
            for (let x_ = 0; x_ < matrix[0].length; x_++) {
                if (matrix[y_][x_]) score += y + y_;
            }
        }

        if (tetrominoIndex < 3) score -= 0.5;

        return score;
    }

    private isBlockedAbove(tetrominoIndex: number, x: number, y: number): boolean {
        const matrix = TetrominoMatrix.matrices[tetrominoIndex].optimizedMatrix;

        const blub = new Array(matrix[0].length).fill(false);

        for (let y_ = y + matrix.length - 1; y_ >= 0; y_--) {
            for (let x_ = 0; x_ < matrix[0].length; x_++) {
                if (!blub[x_] && matrix[y_ - y][x_]) blub[x_] = true;
                if (blub[x_] && this._matrix[y_][x + x_] !== 0) return true;
            }
        }

        return false;
    }

    private lineIsEmpty(line: number): boolean {
        for (let x = 0; x < this._width; x++) {
            if (this._matrix[line][x] !== 0) return false;
        }

        return true;
    }

    /**
     * 
     * @returns index of the empty line thats closest to the bottom / the end of the array, if no empty line is found -1 is returned.
     * 
     */
    private getEmptyLineClosestToBottom(): number {
        for (let y = this._height - 1; y >= 0; y--) {
            if (this.lineIsEmpty(y)) return y;
        }

        return -1;
    }

    /**
     * 
     * @returns index of the empty field thats closest to the bottom left / the end of the array, if no empty line is found [-1, -1] is returned.
     * 
     */
    private getEmptyFieldClosestToBottom(): [number, number] {
        for (let y = this._matrix.length - 1; y >= 0; y--) {
            for (let x = 0; x < this._matrix[y].length; x++) {
                if (this._matrix[y][x] === 0) {
                    let isBlockedAbove = false;

                    for (let y_ = y; y_ >= 0; y_--) {
                        if (this._matrix[y_][x] !== 0) {
                            isBlockedAbove = true;
                            break;
                        }
                    }

                    if (!isBlockedAbove) return [x, y];
                }
            }
        }

        return [-1, -1];
    }
}