import { Score } from 'Behaviours/Tetris/SaveScore';
import { AlignH, AlignV, Color, Scene, Shape, UIButton, UIMenu, UIText } from 'SE';

export function MainMenuPrefab(menu: UIMenu) {
    menu.active = true;

    menu.addUIElement('Play button', UIButton, button => {
        button.alignH = AlignH.Center;
        button.alignV = AlignV.Center;

        button.position.x = button.position.y = 50;

        button.text = 'Play';


        button.font = 'Default-Large';

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
        text.position.y = 60;

        text.text = 'Last Score: ' + Score.lastScore;

        text.font = 'Default-Small';
    });

    menu.addUIElement('High Score', UIText, text => {
        text.alignH = AlignH.Center;
        text.alignV = AlignV.Center;

        text.position.x = 50;
        text.position.y = 63;

        text.text = 'Highest Score: ' + Score.highScore;

        text.font = 'Default-Small';
    });


    menu.addUIElement('SnowballEngine', UIButton, button => {
        button.alignH = AlignH.Right;
        button.alignV = AlignV.Bottom;

        button.position.x = button.position.y = 100;

        button.text = 'Made with SnowballEngine';


        button.font = 'Default-Normal';

        button.onInput = () => {
            window.open('https://github.com/MatsThieme/SnowballEngineTemplate');
        };
    });

    menu.background = Shape.createSprite('Rect', Color.white);
}