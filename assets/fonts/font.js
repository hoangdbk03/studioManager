import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    'BoldItalic': require('../../assets/fonts/Roboto-BoldItalic.ttf'),
    'Italic': require('../../assets/fonts/Roboto-Italic.ttf'),
    'Light': require('../../assets/fonts/Roboto-Light.ttf'),
    'LightItalic': require('../../assets/fonts/Roboto-LightItalic.ttf'),
    'Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'MediumItalic': require('../../assets/fonts/Roboto-MediumItalic.ttf'),
    'Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
    'Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
  });
};
export const Fonts = {
    'Bold': 'Bold',
    'BoldItalic': 'BoldItalic',
    'Italic': 'Italic',
    'Light': 'Light',
    'LightItalic': 'LightItalic',
    'Medium': 'Medium',
    'MediumItalic': 'MediumItalic',
    'Regular': 'Regular',
    'Thin': 'Thin',
  };