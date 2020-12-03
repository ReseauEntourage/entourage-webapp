/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'googlemaps';

/**
 * Override default behavior because of these issues
 * https://github.com/microsoft/TypeScript/issues/26255
 * https://github.com/microsoft/TypeScript/issues/36275
 */

interface Array<T> {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: any, fromIndex?: number): boolean;
}

interface ReadonlyArray<T> {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: any, fromIndex?: number): boolean;
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}
