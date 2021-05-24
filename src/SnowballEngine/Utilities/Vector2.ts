import { Debug } from 'SnowballEngine/Debug';
import { Angle } from './Angle';
import { random } from './Helpers';

/** @category Utility */
export class Vector2 implements IVector2 {
    public x: number;
    public y: number;

    public constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public set(x: number, y?: number): Vector2 {
        this.x = x;
        this.y = y || x;
        return this;
    }

    /**
     * 
     * Returns sum of passed vectors.
     * 
     */
    public static add(...vectors: IVector2[]): Vector2 {
        return vectors.reduce((a: Vector2, b: IVector2) => { a.x += b.x; a.y += b.y; return a; }, new Vector2());
    }

    /**
     * 
     * Add vectors to this.
     * 
     * Returns this for chainability.
     *
     */
    public add(...vectors: IVector2[]): Vector2 {
        for (const v of vectors) {
            this.x += v.x;
            this.y += v.y;
        }


        return this;
    }


    /**
     * 
     * Subtract vectors from v.
     * 
     */
    public static sub(v: IVector2, ov: IVector2, ...vectors: IVector2[]): Vector2 {
        if (vectors.length) return vectors.reduce((a: Vector2, b: IVector2) => { a.x -= b.x; a.y -= b.y; return a; }, new Vector2(v.x - ov.x, v.y - ov.y));
        else return new Vector2(v.x - ov.x, v.y - ov.y);
    }

    /**
     *
     * Subtract vectors from this.
     * 
     * Returns this for chainability.
     *
     */
    public sub(...vectors: IVector2[]): Vector2 {
        for (const v of vectors) {
            this.x -= v.x;
            this.y -= v.y;
        }

        return this;
    }

    /**
     * 
     * Divide vector by factor.
     * 
     */
    public static divide(vector: IVector2 | number, factor: IVector2 | number): Vector2 {
        if (typeof vector === 'number') vector = new Vector2(vector, vector);
        if (typeof factor === 'number') return new Vector2(vector.x / factor, vector.y / factor);
        else return new Vector2(vector.x / factor.x, vector.y / factor.y);
    }

    /**
     *
     * Calculate dot product of two vectors.
     * 
     */
    public static dot(v: IVector2, ov: IVector2): number {
        return v.x * ov.x + v.y * ov.y;
    }

    /**
     *
     * Calculate cross product of v1 and v2.
     *
     */
    public static cross(v1: IVector2, v2: IVector2): number {
        return v1.x * v2.y - v1.y * v2.x;
    }

    /**
     *
     * Calculate cross product of s and v.
     *
     */
    public static cross1(s: number, v: IVector2): Vector2 {
        return new Vector2(-s * v.y, s * v.x);
    }

    /**
     *
     * Calculate cross product of v and s.
     *
     */
    public static cross2(v: IVector2, s: number): Vector2 {
        return new Vector2(s * v.y, -s * v.x);
    }

    /**
     * 
     * Returns the average of passed vectors.
     * 
     */
    public static average(vectors: IVector2[]): Vector2 {
        return Vector2.divide(Vector2.add(...vectors), vectors.length);
    }

    /**
     * 
     * Rotate this vector around rotatePoint to angle.
     * 
     * Returns this for chainability.
     *
     */
    public rotateAroundBy(rotatePoint: IVector2, angle: Angle): Vector2 {
        const s = Math.sin(-angle.radian);
        const c = Math.cos(-angle.radian);

        this.x -= rotatePoint.x;
        this.y -= rotatePoint.y;

        const x = this.x * c - this.y * s + rotatePoint.x;
        const y = this.x * s + this.y * c + rotatePoint.y;

        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * 
     * Returns angle to other vector.
     * 
     */
    public angleTo(rotatePoint: IVector2, other: Vector2): Angle {
        const r1 = this.clone.sub(rotatePoint);
        const r2 = other.clone.sub(rotatePoint);

        return new Angle(Math.atan2(-Vector2.cross(r1, r2), Vector2.dot(r1, r2)));
    }

    /**
     *
     * Returns a clone of this.
     * 
     */
    public get clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     *
     * Returns the sum of this components.
     * 
     */
    public get sum(): number {
        return this.x + this.y;
    }

    /**
     *
     * Returns the squared magnitude of this.
     * 
     */
    public get magnitudeSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    /**
     *
     * Returns the magnitude of this.
     * 
     */
    public get magnitude(): number {
        return Math.sqrt(this.magnitudeSquared);
    }

    /**
     * 
     * Scale this with scalar.
     * 
     * Returns this for chainability.
     *
     */
    public scale(scalar: IVector2 | number): Vector2 {

        if (typeof scalar === 'number') {
            this.x *= scalar;
            this.y *= scalar;
        } else {
            this.x *= scalar.x;
            this.y *= scalar.y;
        }

        return this;
    }


    public static scale(vec: Vector2 | number, scalar: IVector2 | number, ...scalars: (number | IVector2)[]): Vector2 {
        if (typeof vec === 'number') vec = new Vector2(vec, vec);

        vec.scale(scalar);

        for (const s of scalars) {
            vec.scale(s);
        }

        return vec;
    }

    /**
     *
     * Returns a clone of this with a magnitude of 1.
     * 
     */
    public get normalized(): Vector2 {
        return this.clone.normalize();
    }

    /**
     *
     * Sets magnitude of this to 1.
     * 
     * Returns this for chainability.
     * 
     */
    public normalize(): Vector2 {
        this.setLength(1);

        return this;
    }

    /**
     *
     * Sets this.x to 1 while keeping the ratio.
     * 
     * Returns this for chainability.
     * 
     */
    public normalizeX(): Vector2 {
        if (this.y !== 0 && this.x !== 0) this.y /= this.x;
        this.x = 1;

        return this;
    }

    /**
     *
     * Sets this.y to 1 while keeping the ratio.
     * 
     * Returns this for chainability.
     * 
     */
    public normalizeY(): Vector2 {
        if (this.x !== 0 && this.y !== 0) this.x /= this.y;
        this.y = 1;

        return this;
    }

    /**
     * 
     * Set magnitude of this to length.
     * 
     * Returns this for chainability.
     *
     */
    public setLength(length: number): Vector2 {
        if (this.x === 0 && this.y === 0) Debug.warn('vec.setLength x==0 && y==0');

        const mag = this.magnitude;
        if (this.x !== 0) this.x /= mag;
        if (this.y !== 0) this.y /= mag;
        this.scale(length);

        return this;
    }

    /**
     * 
     * Returns a string containing rounded components of this.
     * 
     */
    public toString(precision = 3): string {
        precision = 10 ** precision;
        return `x: ${Math.round(this.x * precision) / precision}, y: ${Math.round(this.y * precision) / precision}`;
    }

    /**
     * 
     * Returns distance from this to other.
     * 
     */
    public distance(other: IVector2): number {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    /**
     * 
     * Returns distance from v1 to v2.
     * 
     */
    public static distance(v1: IVector2, v2: IVector2): number {
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }

    /**
     *
     * Returns a vector perpendicular clockwise to this.
     * 
     */
    public get perpendicularClockwise(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    /**
     *
     * Returns a vector perpendicular counter clockwise to this.
     *
     */
    public get perpendicularCounterClockwise(): Vector2 {
        return new Vector2(-this.y, this.x);
    }

    /**
     *
     * Returns unit vector pointing up.
     * 
     */
    public static get up(): Vector2 {
        return new Vector2(0, 1);
    }

    /**
     *
     * Returns unit vector pointing down.
     *
     */
    public static get down(): Vector2 {
        return new Vector2(0, -1);
    }

    /**
     *
     * Returns unit vector pointing right.
     *
     */
    public static get right(): Vector2 {
        return new Vector2(1, 0);
    }

    /**
     *
     * Returns unit vector pointing left.
     *
     */
    public static get left(): Vector2 {
        return new Vector2(-1, 0);
    }

    /**
     * 
     * Returns an empty vector.
     * 
     */
    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    /**
     * 
     * Rounds this components.
     * 
     * Returns this for chainability.
     *
     */
    public round(): Vector2 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    /**
     * 
     * Floors this components.
     * 
     * Returns this for chainability.
     *
     */
    public floor(): Vector2 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    /**
     * 
     * Scales this by -1.
     * 
     * Returns this for chainability.
     * 
     */
    public flip(): Vector2 {
        this.scale(-1);
        return this;
    }

    /**
     *
     * Returns flipped clone of this.
     *
     */
    public get flipped(): Vector2 {
        return this.clone.flip();
    }

    /**
     * 
     * Returns true if this and other are equal, false otherwise.
     * 
     */
    public equal(other: IVector2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * 
     * Returns -1 if distance(p1, this) < distance(p2, this) || 0 if distance(p1, this) == distance(p2, this) || 1 if distance(p1, this) > distance(p2, this).
     * 
     */
    public lowestDist(p1: IVector2, p2: IVector2): -1 | 0 | 1 {
        const first = (this.x - p1.x) ** 2 + (this.y - p1.y) ** 2;
        const second = (this.x - p2.x) ** 2 + (this.y - p2.y) ** 2;

        return first === second ? 0 : first < second ? -1 : 1;
    }

    /**
     * 
     * Set copy others components values to this.
     * 
     * Returns this for chainability.
     *
     */
    public copy(other: IVector2): Vector2 {
        this.x = other.x;
        this.y = other.y;

        return this;
    }

    public get values(): number[] {
        return [this.x, this.y];
    }

    public static lerp(a: IVector2, b: IVector2, t: number): Vector2 {
        return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }

    public static from(vec: IVector2): Vector2 {
        return new Vector2(vec.x, vec.y);
    }

    public static get random(): Vector2 {
        const range = Math.random() * 2 ** 10;
        return new Vector2(random(-range, range), random(-range, range));
    }

    public static removeDuplicates(vs: Vector2[]): Vector2[] {
        const v: Vector2[] = [];

        for (const vec of vs) {
            if (v.findIndex(x => x.equal(vec)) === -1) v.push(vec);
        }

        return v;
    }

    public static equal(v1: IVector2, v2: IVector2): boolean {
        return v1.x === v2.x && v1.y === v2.y;
    }
}