import { TetrominoBehaviour } from 'Behaviours/TetrominoBehaviour';
import { AlignH, AlignV, Angle, Assets, Color, GameObject, PolygonCollider, Rigidbody, Texture, Transform, Vector2 } from 'SE';

export class TetrominoMatrix {
    /**
     * 
     * all 7 tetrominos with 0, 90, 180 and 170 degree rotation
     * 
     */
    public static matrices: TetrominoMatrix[] = [];

    private _matrix: [boolean, boolean, boolean, boolean][];
    private _verticies: Vector2[];

    public readonly width: number;
    public readonly height: number;

    public readonly color: Color;

    private _prefab?: (gameObject: GameObject) => void;

    public readonly optimizedMatrix: boolean[][];

    public constructor(matrix: [boolean, boolean, boolean, boolean][], color = Color.white) {
        this._matrix = matrix;

        this.optimizedMatrix = [];

        this.normalize();

        this._verticies = PolygonCollider.sidesToVerticies(this.getSides());


        const size = this.size;
        this.width = size.x;
        this.height = size.y;
        this.color = color;
    }

    public get size(): Vector2 {
        let maxY = 0;
        let minY = 3;
        let maxX = 0;
        let minX = 3;

        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (this._matrix[y][x]) {
                    if (y > maxY) maxY = y;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (x < minX) minX = x;
                }
            }
        }

        return new Vector2(maxX - minX + 1, maxY - minY + 1);
    }

    private normalize(): void {
        for (let i = 0; i < this._matrix.length; i++) {
            if (this._matrix[i][0] || this._matrix[i][1] || this._matrix[i][2] || this._matrix[i][3]) {
                if (i) this._matrix.push(...this._matrix.splice(0, i));
                break;
            }
        }


        for (let x = 0; x < 4; x++) {
            if (this._matrix[0][x] || this._matrix[1][x] || this._matrix[2][x] || this._matrix[3][x]) {
                if (x) {
                    for (let y = 0; y < 4; y++) {
                        this._matrix[y].push(...this._matrix[y].splice(0, x));
                    }
                }

                break;
            }
        }

        const size = this.size;
        (<any>this).width = size.x;
        (<any>this).height = size.y;

        (<Mutable<TetrominoMatrix>>this).optimizedMatrix = this.truncateMatrix();
    }

    private truncateMatrix(): boolean[][] {
        const m: [boolean, boolean, boolean, boolean][] = [];

        for (const y of this._matrix) {
            m.push([...y]);
        }


        if (this.height !== 4) {
            m.splice(this.height);
        }

        if (this.width !== 4) {
            for (let y = 0; y < this.height; y++) {
                m[y].splice(this.width);
            }
        }


        return m;
    }

    /**
     * 
     * returns this
     * 
     */
    public rotate(degree: 90 | 180 | 270): TetrominoMatrix {
        if (degree === 180) {
            this._matrix.reverse();

            for (const y of this._matrix) {
                y.reverse();
            }
        } else {
            const m: boolean[][] = [];

            for (let i = 0; i < 4; i++) {
                m[i] = [this._matrix[3][i], this._matrix[2][i], this._matrix[1][i], this._matrix[0][i]];
            }

            this._matrix = <[boolean, boolean, boolean, boolean][]>m;

            if (degree === 270) return this.rotate(180);
        }

        this.normalize();

        this._verticies = PolygonCollider.sidesToVerticies(this.getSides());

        return this;
    }

    public get clone(): TetrominoMatrix {
        const m: [boolean, boolean, boolean, boolean][] = [];

        for (const y of this._matrix) {
            m.push([...y]);
        }

        return new TetrominoMatrix(m, this.color);
    }

    private getSides(): [Vector2, Vector2][] {
        this.normalize();

        const sides: [Vector2, Vector2][] = [];

        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (this._matrix[y][x]) {
                    const left = x > 0 && this._matrix[y][x - 1];
                    const right = x < 3 && this._matrix[y][x + 1];
                    const above = y > 0 && this._matrix[y - 1][x];
                    const below = y < 3 && this._matrix[y + 1][x];

                    const leftAbove = x > 0 && y > 0 && this._matrix[y - 1][x - 1];
                    const rightAbove = x < 3 && y > 0 && this._matrix[y - 1][x + 1];
                    const leftBelow = x > 0 && y < 3 && this._matrix[y + 1][x - 1];
                    const rightBelow = x < 3 && y < 3 && this._matrix[y + 1][x + 1];


                    if (!above) {
                        let xleft = x;
                        let xright = x + 1;

                        if (leftAbove && !rightAbove) {
                            xleft -= 0.05;
                            if (!right) xright -= 0.05;
                        } else if (!leftAbove && rightAbove) {
                            if (!left) xleft += 0.05;
                            xright += 0.05;
                        } else if (leftAbove && rightAbove) {
                            xleft -= 0.05;
                            xright += 0.05;
                        } else if (left || right) {
                            if (!left) xleft += 0.05;
                            if (!right) xright -= 0.05;
                        } else {
                            xleft += 0.05;
                            xright -= 0.05;
                        }

                        sides.push([new Vector2(xleft, -y), new Vector2(xright, -y)]);
                    }

                    if (!below) {
                        let xleft = x;
                        let xright = x + 1;

                        if (leftBelow && !rightBelow) {
                            xleft -= 0.05;
                            if (!right) xright -= 0.05;
                        } else if (!leftBelow && rightBelow) {
                            if (!left) xleft += 0.05;
                            xright += 0.05;
                        } else if (leftBelow && rightBelow) {
                            xleft -= 0.05;
                            xright += 0.05;
                        } else if (left || right) {
                            if (!left) xleft += 0.05;
                            if (!right) xright -= 0.05;
                        } else {
                            xleft += 0.05;
                            xright -= 0.05;
                        }

                        sides.push([new Vector2(xright, -(y + 1)), new Vector2(xleft, -(y + 1))]);
                    }

                    if (!left) {
                        sides.push([new Vector2(x + 0.05, -(y + 1)), new Vector2(x + 0.05, -y)]);
                    }

                    if (!right) {
                        sides.push([new Vector2(x + 0.95, -y), new Vector2(x + 0.95, -(y + 1))]);
                    }
                }
            }
        }

        return sides;
    }

    public getPrefab(): (gameObject: GameObject) => void {
        return this._prefab || (this._prefab = async (gameObject: GameObject): Promise<void> => {
            const c = await gameObject.addComponent(PolygonCollider, c => {
                c.verticies = this._verticies;
                c.mass = Infinity;
            });

            await gameObject.addComponent(Rigidbody, rb => {
                rb.collisionFilterMask = 0b1;
            });

            await gameObject.addComponent(TetrominoBehaviour);


            const t = Transform.createTransformable(Vector2.from(c.bounds!.min).sub(new Vector2(0.05, 0)), new Vector2(1, 1), new Angle());
            const localT = Transform.toLocal(t, gameObject.transform);


            this._matrix.reverse();

            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    if (this._matrix[y][x]) {
                        await gameObject.addComponent(Texture, texture => {
                            texture.asset = Assets.get('part');
                            texture.tint = this.color;
                            texture.position = new Vector2(x + localT.position.x, y + localT.position.y - (4 - this.height));
                            texture.alignH = AlignH.Left;
                            texture.alignV = AlignV.Bottom;
                        });
                    }
                }
            }

            this._matrix.reverse();

            gameObject.transform.position.y = 5 + this.height / 2;
        });
    }

    public static init(): void {
        const rect = new TetrominoMatrix([
            [true, true, false, false],
            [true, true, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.yellow);

        const l1 = new TetrominoMatrix([
            [true, false, false, false],
            [true, true, true, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.blue);

        const l2 = new TetrominoMatrix([
            [false, false, true, false],
            [true, true, true, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.darkorange);

        const long = new TetrominoMatrix([
            [true, true, true, true],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.aqua);

        const z1 = new TetrominoMatrix([
            [true, true, false, false],
            [false, true, true, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.red);

        const z2 = new TetrominoMatrix([
            [false, true, true, false],
            [true, true, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.lime);

        const thing3 = new TetrominoMatrix([
            [false, true, false, false],
            [true, true, true, false],
            [false, false, false, false],
            [false, false, false, false]
        ], Color.purple);

        this.matrices = [
            rect,
            long, long.clone.rotate(90),
            l1, l1.clone.rotate(90), l1.clone.rotate(180), l1.clone.rotate(270),
            l2, l2.clone.rotate(90), l2.clone.rotate(180), l2.clone.rotate(270),
            z1, z1.clone.rotate(90),
            z2, z2.clone.rotate(90),
            thing3, thing3.clone.rotate(90), thing3.clone.rotate(180), thing3.clone.rotate(270)
        ];
    }
}