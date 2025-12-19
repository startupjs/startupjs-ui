// the actual component code is intentionally moved out to input.js/input.expo.js
// so that it can be platform-specific (startupjs adds a priority extension .expo.js
// which will be loaded first by the bundler if the project is on Expo).
export { default } from './input'
