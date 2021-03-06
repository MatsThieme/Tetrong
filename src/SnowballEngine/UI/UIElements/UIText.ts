import { TextStyleAlign } from '@pixi/text';
import { BitmapText } from '@pixi/text-bitmap';
import { Client } from 'SnowballEngine/Client';
import { Scene } from 'SnowballEngine/Scene';
import { Color } from 'Utility/Color';
import { UIElementType } from '../UIElementType';
import { UIFonts } from '../UIFonts';
import { UIMenu } from '../UIMenu';
import { UIElement } from './UIElement';

/** @category UI */
export class UIText extends UIElement {
    protected readonly _bitmapText: BitmapText;

    private readonly _resizeListener: () => void;
    private _lines: number;

    public constructor(menu: UIMenu, name: string, type: UIElementType = UIElementType.Text) {
        super(menu, name, type);

        this._bitmapText = new BitmapText('', { fontName: menu.font || Scene.currentScene.ui.font });

        this._lines = 0;

        this.container.addChild(this._bitmapText);

        this._resizeListener = (() => this._bitmapText.updateText()).bind(this);

        window.addEventListener('resize', this._resizeListener);
    }

    public get font(): UIFont {
        return <UIFont>this._bitmapText.fontName;
    }
    public set font(val: UIFont) {
        this._bitmapText.fontName = val;
        this._bitmapText.updateText();
    }

    public get text(): string {
        return this._bitmapText.text;
    }
    public set text(val: string) {
        this._bitmapText.text = val;

        this._lines = Array.from(val.matchAll(/\n/g)).length + 1;
    }

    public get tint(): Color {
        const color = new Color();

        color.rgb = this._bitmapText.tint;

        return color;
    }
    public set tint(val: Color) {
        this._bitmapText.tint = val.rgb;
    }

    /**
     * 
     * Multiline text align.
     * 
     */
    public get textAlign(): TextStyleAlign {
        return <TextStyleAlign>this._bitmapText.align;
    }
    public set textAlign(val: TextStyleAlign) {
        this._bitmapText.align = val;
    }

    public override update(): void {
        if (!this.active) return;

        this._bitmapText.scale.set(Client.resolution.y / Client.resolution.x, 1);

        this._bitmapText.position.copyFrom(this._scaledPadding);

        const style = UIFonts.getStyle(<UIFont>this._bitmapText.fontName)!;
        const fontSize = <number>style.fontSize;

        const ratio = this._bitmapText.width / this._bitmapText.height;

        this._bitmapText.height = fontSize * this._lines + fontSize * 0.11;
        this._bitmapText.width = ratio * fontSize * this._lines * (1 + 0.2 / this._lines);

        super.update();
    }

    public override destroy(): void {
        window.removeEventListener('resize', this._resizeListener);

        super.destroy();
    }
}