import projectConfig from 'Config';
import { AudioListener } from 'GameObject/Components/AudioListener';
import { Input } from 'Input/Input';
import { Common } from 'matter-js';
import * as PIXI from 'pixi.js';
import { Ticker } from 'pixi.js';
import * as poly_decomp from 'poly-decomp';
import { UIFonts } from 'UI/UIFonts';
import { Game } from '../Game';
import { Client } from './Client';
import { Debug } from './Debug';

window.AudioContext = window.AudioContext || (<any>window).webkitAudioContext; // support safari

PIXI.utils.skipHello(); // don't show PIXIs hello in console
Ticker.system.autoStart = false;
if (projectConfig.build.debugMode) (<any>window).PIXI = PIXI; // for the chrome pixijs developer tools

Common.setDecomp(poly_decomp);


Debug.init(); // add global error handlers

Client.init();

Input.start(); // listen for user input

UIFonts.init(); // create default fonts

AudioListener.start(); // create audio context


if (window.cordova) document.addEventListener('deviceready', () => new Game());
else new Game();
