const utils = {
    /** 
     * This function takes a string parameter property that represents the property by which the array of objects will be sorted.
     * The function returns another function that will be used to sort the array of objects.
     * 
     * If the property starts with a hyphen (-), the function will sort the array in descending order. 
     * Otherwise, it will sort in ascending order.
     * 
     * @param property The name of the property to sort by. Use a minus sign prefix to sort in descending order.
     * @returns `Function` A function that can be passed to the sort() method of an array to sort it by the specified property.
     * @example
     * 
     * ```javascript
     *   myArray = [
     *     {name: 'A', age: 18, univerty: 'lorem ipsum dolor sit amet'}
     *     {name: 'C', age: 22, univerty: 'lorem ipsum dolor sit amet'}
     *     {name: 'B', age: 16, univerty: 'lorem ipsum dolor sit amet'}
     *   ]
     *   myArray.sort(Helper.dynamicSort('age'));  // Sorts ascending by age
     *   myArray.sort(Helper.dynamicSort('-age')); // Sorts descending by age
     * ```
     */
    dynamicSort(property: string): any {
        var sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a: any, b: any): any {
            if (sortOrder == -1) {
                //descending order
                return b[property].localeCompare(a[property]);
            } else {
                //ascending order
                return a[property].localeCompare(b[property]);
            }
        }
    },

    /**
     * Sorts a list of objects based on a property key, in ascending or descending order.
     * 
     * @param key The property key used for sorting.
     * @param order The sort order: "asc" for ascending (default) or "desc" for descending.
     * @returns The sorted list of objects.
     * @example
     * ```js
     *  const data = [
     *      { id: 1, name: "Alice" },
     *      { id: 2, name: "Bob" },
     *      { id: 3, name: "Charlie" },
     *  ];
     * 
     *  const sortedData = data.sort(sortBy(data, "name", "desc"));
     *  // sortedData: [
     *  // { id: 3, name: "Charlie" },
     *  // { id: 2, name: "Bob" },
     *  // { id: 1, name: "Alice" },
     *  // ];
     * ```
     */
    sortBy<T>(list: T[], key: keyof T, orderBy: "asc" | "desc" = "asc"): T[] { 
        const order = orderBy === 'asc' ? 1 : -1;
  
        return list.sort((a, b) => {
          const aValue = a[key];
          const bValue = b[key];
          
          if (aValue === bValue) {
            return 0;
          }
          
          return aValue > bValue ? order : -order;
        });
    },

    /**
     * Pads a number with leading zeros to match the number of digits in a given maximum value.
     * 
     * @param num The number to be padded with leading zeros.
     * @param max The maximum value for which the number of digits will be used to determine the padding length
     * 
     * @returns `string` the input number padded with leading zeros to match the number of digits in the maximum value.
     * 
     * @example
     * ```js
     *  console.log(zeroPad(2, 9)); // "2"
     *  console.log(zeroPad(2, 10)); // "02"
     * ```
     */
    zeroPad(num: number, max: number): string {
        return num.toString().padStart(Math.floor(Math.log10(max) + 1), '0');
    },
    
}

export default utils;