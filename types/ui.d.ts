declare class UIApi {
    /** Adds a style to the DOM */
    addStyle(id: string, style: string): void;
    /** Remove all styles with a given id */
    removeStyles(id: string): void;
}
declare class ScopedUIApi {
    /** Adds a style to the DOM */
    addStyle(style: string): void;
}
export { UIApi, ScopedUIApi };
