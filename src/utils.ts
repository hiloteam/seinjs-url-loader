/**
 * @File   : utils.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/31/2019, 4:50:01 PM
 * @Description:
 */
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import {loader} from 'webpack';

import {IOptions} from './options';

export async function emitFile(
  context: loader.LoaderContext,
  options: IOptions,
  params: {data: Buffer | string, distPath: string, filePath: string}
): Promise<string> {
  if (!options.publish.enabled || checkFileWithRules(params.filePath, options.publish.excludes)) {
    context.emitFile(params.distPath, params.data, null);

    return path.join(options.publicPath, params.distPath);
  }

  return await options.publish.publisher.publish(params);
}

export async function readFileBuffer(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, content: Buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(content);
      }
    })
  })
};

export function checkFileWithRules(
  filePath: string,
  rules: (RegExp | ((path: string) => boolean))[]
): boolean {
  for (let index = 0; index < rules.length; index += 1) {
    const rule = rules[index];
    
    if (rule instanceof RegExp) {
      rule.lastIndex = 0;
      if (rule.test(filePath)) {
        return true;
      }
    } else if (rule(filePath)) {
      return true;
    }
  }

  return false;
}

export function getMd5(buf: Buffer | string) {
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 5);
}

const splitStrings = (a, sep = '/') => a.map(i => i.split(sep));
const elAt = i => a => a[i];
const rotate = a => a[0].map((e, i) => a.map(elAt(i)));
const allElementsEqual = arr => arr.every(e => e === arr[0]);
export function getCommonDir(strs: string[], sep: string = '/') {
  return rotate(splitStrings(strs, sep))
      .filter(allElementsEqual).map(elAt(0)).join(sep)
}
