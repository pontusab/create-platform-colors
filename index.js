const fs = require('fs');
const rimraf = require('rimraf');
const hexRgb = require('hex-rgb');

const ANDROID_PATH = './android';

const IOS_PROJECT_NAME = 'Example';
const IOS_PATH = `./ios/${IOS_PROJECT_NAME}`;
const IOS_ASSETS_FOLDER = 'Assets.xcassets';
const IOS_ASSETS_FOLDER_PATH = `./${IOS_PROJECT_NAME}/${IOS_PATH}/${IOS_ASSETS_FOLDER}`;

const sourceColors = fs.readFileSync(`./${IOS_PROJECT_NAME}/colors.json`);

const colors = JSON.parse(sourceColors);

rimraf.sync(IOS_ASSETS_FOLDER_PATH);

fs.mkdirSync(IOS_ASSETS_FOLDER_PATH);

console.log('Create ios colors');

Object.keys(colors).map((colorset) => {
  const colorsetPath = `${IOS_ASSETS_FOLDER_PATH}/${colorset}.colorset`;
  const color = colors[colorset];

  fs.mkdirSync(colorsetPath);

  if (typeof color === 'string') {
    const convertedColor = hexRgb(color);

    fs.writeFileSync(
      `${colorsetPath}/Contents.json`,
      JSON.stringify(
        {
          colors: [
            {
              color: {
                'color-space': 'srgb',
                components: convertedColor,
              },
              idiom: 'universal',
            },
            {
              appearances: [
                {
                  appearance: 'luminosity',
                  value: 'light',
                },
              ],
              color: {
                'color-space': 'srgb',
                components: convertedColor,
              },
              idiom: 'universal',
            },
            {
              appearances: [
                {
                  appearance: 'luminosity',
                  value: 'dark',
                },
              ],
              color: {
                'color-space': 'srgb',
                components: convertedColor,
              },
              idiom: 'universal',
            },
          ],
          info: {
            author: 'xcode',
            version: 1,
          },
        },
        null,
        2
      ),
      'utf8'
    );
  }

  if (typeof color === 'object') {
    if (!color.light || !color.dark) {
      console.log('You need to add lig/dark keys');
    }

    const convertedLightColor = hexRgb(color.light);
    const convertedDarkColor = hexRgb(color.dark);

    fs.writeFileSync(
      `${colorsetPath}/Contents.json`,
      JSON.stringify(
        {
          colors: [
            {
              color: {
                'color-space': 'srgb',
                components: convertedLightColor,
              },
              idiom: 'universal',
            },
            {
              appearances: [
                {
                  appearance: 'luminosity',
                  value: 'light',
                },
              ],
              color: {
                'color-space': 'srgb',
                components: convertedLightColor,
              },
              idiom: 'universal',
            },
            {
              appearances: [
                {
                  appearance: 'luminosity',
                  value: 'dark',
                },
              ],
              color: {
                'color-space': 'srgb',
                components: convertedDarkColor,
              },
              idiom: 'universal',
            },
          ],
          info: {
            author: 'xcode',
            version: 1,
          },
        },
        null,
        2
      ),
      'utf8'
    );
  }
});

// console.log('Create Android colors');
