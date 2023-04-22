import is from "./is";

const to = {
    /**
     * Converts a JSON object to a Record<string, T> type.
     * 
     * @param jsonObject The JSON object to convert.
     * @returns A new Record<string, T> object with the same key-value pairs as the original JSON object.
     * @template T The type defined by the input JSON object.
     * @example
     * 
     * ```js
     *  import { to } from '@heliomarpm/helpers';
     *  import jsonLanguages from './languages.json';
     * 
     *  const languages: Record<string, string> = to.dictionary<string>(jsonLanguages);
     *  let jsonLocale: Record<string, string>
     *  jsonLocale = require(`locales/${navigator.language}`);	
     * ```
     */
    dictionary<T>(jsonObject: { [key: string]: T }): Record<string, T> {
        return { ...jsonObject } as Record<string, T>;
    },

    /**
     * Converts a value to a boolean, following these rules:
     *   - Numeric values are considered `true` except for the string '0'.
     *   - Strings that match the regular expression `/^true$/i` are considered `true`.
     *   - All other values are considered `false`.
     *
     * @param value - The value to be converted to a boolean.
     * @returns `boolean` The boolean representation of the input value.
     */
    boolean(value: number | string): boolean {
        return is.numeric(value) ? !/^0$/i.test(value as string) : /^true$/i.test(value as string);
    }
}

export default to;