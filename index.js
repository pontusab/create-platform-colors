const fs = require('fs');
const rimraf = require('rimraf');
const hexRgb = require('hex-rgb');
const builder = require('xmlbuilder');

const PROJECT_NAME = 'Example';

const ANDROID_PATH = './android';
const ANDROID_VALUES_PATH = `${PROJECT_NAME}/${ANDROID_PATH}/app/src/main/res/values`;
const ANDROID_VALUES_NIGHT_PATH = `${ANDROID_VALUES_PATH}-night`;
const ANDROID_COLORS_PATH = `${ANDROID_VALUES_PATH}/colors.xml`;
const ANDROID_COLORS_NIGHT_PATH = `${ANDROID_VALUES_NIGHT_PATH}/colors.xml`;

const IOS_PATH = `./ios/${PROJECT_NAME}`;
const IOS_ASSETS_FOLDER = 'Assets.xcassets';
const IOS_ASSETS_FOLDER_PATH = `./${PROJECT_NAME}/${IOS_PATH}/${IOS_ASSETS_FOLDER}`;

const WEB_OUTPUT = './web';
const WEB_CSS_FILE = `${WEB_OUTPUT}/colors.css`;

const sourceColors = fs.readFileSync(`./${PROJECT_NAME}/colors.json`);

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

console.log('Create Android colors');

if (!fs.existsSync(ANDROID_VALUES_PATH)) {
  fs.mkdirSync(ANDROID_VALUES_PATH);
}

if (!fs.existsSync(ANDROID_VALUES_NIGHT_PATH)) {
  fs.mkdirSync(ANDROID_VALUES_NIGHT_PATH);
}

rimraf.sync(ANDROID_COLORS_PATH);
rimraf.sync(ANDROID_COLORS_NIGHT_PATH);

// Light colors
const lightColors = Object.keys(colors)
  .map((colorset) => {
    const color = colors[colorset];

    if (typeof color === 'object') {
      if (color.light) {
        return {
          [colorset]: color.light,
        };
      }
    }

    if (typeof color === 'string') {
      return {
        [colorset]: color,
      };
    }
  })
  .filter(Boolean);

const xmlLightDocument = builder
  .create({
    resources: {
      '#text': lightColors.map((color) => {
        const name = Object.keys(color)[0];
        const value = color[name];

        return {
          color: { '@name': name, '#text': value },
        };
      }),
    },
  })
  .end({ pretty: true });

fs.writeFileSync(ANDROID_COLORS_PATH, xmlLightDocument, 'utf8');

const darkColors = Object.keys(colors)
  .map((colorset) => {
    const color = colors[colorset];

    if (typeof color === 'object') {
      if (color.dark) {
        return {
          [colorset]: color.dark,
        };
      }
    }

    if (typeof color === 'string') {
      return {
        [colorset]: color,
      };
    }
  })
  .filter(Boolean);

const xmlDarkDocument = builder
  .create({
    resources: {
      '#text': darkColors.map((color) => {
        const name = Object.keys(color)[0];
        const value = color[name];

        return {
          color: { '@name': name, '#text': value },
        };
      }),
    },
  })
  .end({ pretty: true });

fs.writeFileSync(ANDROID_COLORS_NIGHT_PATH, xmlDarkDocument, 'utf8');

// console.log('Create web colors');
// // WEB_CSS_FILE
// Object.keys(colors).map((colorset) => {
//   const color = colors[colorset];

//   fs.mkdirSync(colorsetPath);

//   if (typeof color === 'string') {
//     // const convertedColor = hexRgb(color);

//   }

//   if (typeof color === 'object') {
//     if (!color.light || !color.dark) {
//       console.log('You need to add lig/dark keys');
//     }

//     // const convertedLightColor = hexRgb(color.light);
//     // const convertedDarkColor = hexRgb(color.dark);

// // :root {
// //   --default: #ffffff;
// // }

// // [data-theme='dark'] {
// //   --default: #1c1c2b;
// // }
