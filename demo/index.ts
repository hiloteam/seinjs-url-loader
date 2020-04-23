/**
 * @File   : index.tsx
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-6-8 15:52:44
 * @Description:
 */
import './base.scss';
import * as Sein from 'seinjs';
import 'seinjs-audio';

const paradise = require('./assets/paradise.png');
const yoku = require('./assets/yoku.jpg');
const point = require('./assets/point.png');
const clock = require('./assets/clock.mp3');

// console.log(paradise, yoku, point, clock);

async function main() {
  const engine = new Sein.Engine();
  const game = new Sein.Game(
    'game',
    {
      canvas: document.getElementById('container') as HTMLCanvasElement,
      clearColor: new Sein.Color(0, .6, .9, 1),
      width: window.innerWidth,
      height: window.innerHeight
    }
  );
  engine.addGame(game);

  game.addWorld('main', Sein.GameModeActor, Sein.LevelScriptActor);

  await game.start();

  const camera = game.world.addActor('camera', Sein.PerspectiveCameraActor, {
    aspect: window.innerWidth / window.innerHeight,
    fov: 60,
    far: 1000,
    near: .01,
    position: new Sein.Vector3(-10, 0, 10)
  });
  camera.lookAt(new Sein.Vector3(0, 0, 0));

  const paradiseImg = await game.resource.load<'Image'>({url: paradise, type: 'Image', name: 'paradise.png'});
  const yokuImg = await game.resource.load<'Image'>({url: yoku, type: 'Image', name: 'yoku.jpg'});
  const pointImg = await game.resource.load<'Image'>({url: point, type: 'Image', name: 'point.png'});
  // console.log(paradiseImg, yokuImg, pointImg);
}

main();

function testDecorator() {
  return function(target, propKey: string) {
    console.log(target, propKey);
  }
}

class Test {
  @testDecorator()
  public a: number = 1;
}

const test1 = new Test();
const test2 = new Test();
