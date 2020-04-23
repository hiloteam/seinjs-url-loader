/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/31/2019, 2:34:39 PM
 * @Description:
 */
import {loader} from 'webpack';
import * as mime from 'mime';
import * as path from 'path';

import {getOptions} from './options';
import {checkFileWithRules, readFileBuffer, getMd5, emitFile, getCommonDir} from './utils';

let optionsLogged = false;

async function SeinJSUrlLoader(this: loader.LoaderContext, source: string | Buffer) {
  this.cacheable();
  const callback = this.async();
  const context = this;

  try {
    const options = getOptions(context);
    const {resourcePath} = context;
    const fileName = path.basename(resourcePath, path.extname(resourcePath));

    if (!optionsLogged) {
      console.log(`seinjs-url-loader: ${fileName}`);
      optionsLogged = true;
    }

    let rootDir = (context.rootContext || (context as any).options.context) + '/';
    let srcDir = path.dirname(resourcePath);
    const commonDir = getCommonDir([srcDir, rootDir]) + '/';
    const tmp = path.parse(srcDir.replace(commonDir, ''));
    const distDir = tmp.dir;
    const md5 = getMd5(source);
    const filePath = path.join(distDir, fileName + '-' + md5 + path.extname(resourcePath));
    let content = await readFileBuffer(resourcePath);
    
    let result = '';
    if (options.process.enabled) {
      for (let index = 0; index < options.process.processors.length; index += 1) {
        const processor = options.process.processors[index];
        if (checkFileWithRules(filePath, [processor.test])) {
          content = await processor.process({data: content, filePath});
        }
      }
    }

    if (options.base64.enabled && !checkFileWithRules(resourcePath, options.base64.excludes)) {
      const mimetype = mime.getType(filePath);

      if (content.length < options.base64.threshold) {
        result = `"data:${mimetype || ''};base64,${content.toString('base64')}"`;

        console.log(resourcePath, '->', 'base64');
      }
    }

    if (!result) {
      let {resourcePath} = this;

      const fp = await emitFile(this, options, {data: new Uint8Array(content).buffer as Buffer, distPath: filePath, filePath: resourcePath});
      result = `"${fp}"`;

      console.log(resourcePath, '->', result);
    }

    callback(null, `module.exports = ${result}`);
  } catch (error) {
    callback(error);
  }
}

export = SeinJSUrlLoader;
