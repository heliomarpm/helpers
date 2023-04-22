enum eOS {
    Windows = "win32",
    Linux = "linux",
    MacOS = "darwin",
}

enum eArchitecture {
    x86 = "ia32",
    x64 = "x64",
    Arm = "arm",
    Arm64 = "arm64",
}

const Is = {
    /**
     * Verifies that it's running on the Windows OS.
     * 
     * @returns boolean
     */
    get windows(): boolean { return process.platform === eOS.Windows },
    /**
     * Verifies that it's running on the Linux OS.
     * 
     * @returns boolean
     */
    get linux(): boolean { return process.platform === eOS.Linux },
    /**
     * Verifies that it's running on the Mac OS.
     * 
     * @returns boolean
     */
    get macOs(): boolean { return process.platform === eOS.MacOS },
    /**
     * Check if the processor architecture is ia32.
     * 
     * @returns boolean
     */
    get arch_x86(): boolean { return process.arch === eArchitecture.x86 },
    /**
     * Check if the processor architecture is x64.
     * 
     * @returns boolean
     */
    get arch_x64(): boolean { return process.arch === eArchitecture.x64 },
    /**
     * Check if the processor architecture is arm.
     * 
     * @returns boolean
     */
    get arch_Arm(): boolean { return process.arch === eArchitecture.Arm },
    /**
     * Check if the processor architecture is arm64.
     * 
     * @returns boolean
     */
    get arch_Arm64(): boolean { return process.arch === eArchitecture.Arm64 },
    /**
     * Check if you are running in developer mode 
     * (i.e.) Environment 'ELECTRON_IS_DEV' or electron.app.isPackage == false
     * @returns boolean
     */
    // get dev(): boolean { 
    //     try {
    //         if ('ELECTRON_IS_DEV' in process.env)
    //             return Number.parseInt(process.env["ELECTRON_IS_DEV"]!, 10) === 1;
    //         else {
    //             const { app } = require('electron');
    //             return !app.isPackaged;
    //         }

    //     } catch (error: unknown) {
    //         throw new TypeError("Not running in an Electron App");
    //         // return false;
    //     }
    // },

    /**
     * Determines if a given value is numeric.
     *
     * @param value - The value to check for numeric type.
     * @returns `true` if the input value is numeric, `false` otherwise.
     */
    numeric(value: string | number): boolean {
        return !isNaN(parseFloat(value as string)) && isFinite(value as number);
    },
}

export { Is }