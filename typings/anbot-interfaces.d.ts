declare module anbot {

    export interface IFileInfo {
        path?:string;
        name?:string;
        ext?:string;
        type?:string;
        mime?:string;
        children?: IFileInfo[];
    }
}