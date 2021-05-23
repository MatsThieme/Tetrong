import { TextStyleFill, TextStyleFontVariant, TextStyleFontWeight, TextStyleLineJoin, TextStyleTextBaseline, TEXT_GRADIENT } from "@pixi/text";
import { Angle } from 'Utility/Angle';
import { Vector2 } from 'Utility/Vector2';

declare global {
    type Constructor<T> = new (...args: any[]) => T;
    type AbstractConstructor<T> = abstract new (...args: any[]) => T;

    type ImmutableObject<T> = { readonly [P in keyof T]: T[P] };
    type ImmutableObjectDeep<T> = { readonly [P in keyof T]: ImmutableObjectDeep<T[P]> };
    type Mutable<T> = { -readonly [P in keyof T]: T[P]; };
    type MutableDeep<T> = { -readonly [P in keyof T]: MutableDeep<T[P]>; };


    /** @internal */
    interface Worker extends EventTarget, AbstractWorker {
        isBusy: boolean;
        id: number;
        finished: number;
        onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
        postMessage(message: any, transfer: Transferable[]): void;
        postMessage(message: any, options?: PostMessageOptions): void;
        terminate(): void;
        addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }



    interface IVector2 {
        x: number;
        y: number;
    }

    interface IAngle {
        radian: number;
        degree: number;
    }


    interface Transformable {
        position: Vector2;
        rotation: Angle;
        scale: Vector2;
        parent?: ITransformable,
        readonly id: number
    }

    interface ITransformable {
        position: IVector2;
        rotation: IAngle;
        scale: IVector2;
        parent?: ITransformable,
        readonly id: number
    }



    interface BitmapTextStyle {
        dropShadow?: boolean;
        dropShadowAngle?: number;
        dropShadowBlur?: number;
        dropShadowColor?: string | number;
        dropShadowDistance?: number;
        fill?: TextStyleFill;
        fillGradientType?: TEXT_GRADIENT;
        fillGradientStops?: number[];
        fontFamily?: string | string[];
        fontSize?: number | string;
        fontVariant?: TextStyleFontVariant;
        fontWeight?: TextStyleFontWeight;
        letterSpacing?: number;
        lineJoin?: TextStyleLineJoin;
        miterLimit?: number;
        stroke?: string | number;
        strokeThickness?: number;
        textBaseline?: TextStyleTextBaseline;
    }
}