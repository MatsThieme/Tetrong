import { SaveScore } from 'Behaviours/Tetris/SaveScore';
import { AlignH, AlignV, Color, Scene, Shape, UIButton, UIMenu, UIText } from 'SE';

export function MainMenuPrefab(menu: UIMenu) {
    menu.active = true;

    menu.addUIElement('Play button', UIButton, button => {
        button.alignH = AlignH.Center;
        button.alignV = AlignV.Center;

        button.position.x = button.position.y = 50;

        button.text = 'Play';


        button.font = 'Default-Normal';

        button.onInput = () => {
            Scene.sceneManager.load('Main Scene');
        };
    });

    menu.addUIElement('Tetrong', UIText, text => {
        text.alignH = AlignH.Center;
        text.alignV = AlignV.Center;

        text.position.x = 50;
        text.position.y = 20;

        text.text = 'Tetrong';

        text.font = 'Red-Large';
    });

    menu.addUIElement('Last Score', UIText, text => {
        text.alignH = AlignH.Center;
        text.alignV = AlignV.Center;

        text.position.x = 50;
        text.position.y = 57;

        text.text = 'Last Score: ' + SaveScore.lastScore;

        text.font = 'Default-Small';
    });

    menu.addUIElement('High Score', UIText, text => {
        text.alignH = AlignH.Center;
        text.alignV = AlignV.Center;

        text.position.x = 50;
        text.position.y = 60;

        text.text = 'Highest Score: ' + SaveScore.highScore;

        text.font = 'Default-Small';
    });

    menu.background = Shape.createSprite('Rect', Color.white);
}