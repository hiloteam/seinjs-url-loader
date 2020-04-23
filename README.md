# seinjs-url-loader

```shell
npm i seinjs-atlas-loader --save
```

Webpack config:

```js
{
  test: /\.(ong|igp|mp3|mp4|woff)$/,
  use: [
    {
      loader: 'seinjs-url-loader',
      options: {
        // Prefix for all assets, defaults to 'output.publicPath'
        publicPath?: string;
        base64?: {
          // Enable base64
          enabled: boolean;
          // Default to 1000
          threshold?: number;
          // Rules for excluding unnecessary files
          excludes?: (RegExp | ((path: string) => boolean))[],
        };
        // for preProcessing your resources
        process?: {
          // Enable process
          enabled: boolean;
          // You custom processors
          processors: {
            test?: RegExp | ((path: string) => boolean),
            process(options: {data: Buffer | string, filePath: string}): Promise<Buffer>;
          }[];
        };
        // for publishing your resource to cdn
        publish?: {
          // Enable publish
          enabled: boolean;
          // Rules for excluding unnecessary files
          excludes?: (RegExp | ((path: string) => boolean))[];
          // You custom publisher
          publisher: {
            publish(options: {data: Buffer | string, filePath: string, distPath: string}): Promise<string>;
          };
        };
      }
    }
  ]
}
```

Load file:

````
import someImage from "path/to/file.png";
 
````
