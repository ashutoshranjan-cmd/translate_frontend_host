/// <reference types="vite/client" />


type LangType = "ja"|"hi"|"es"|"fr"
type WordType = {
    word:string,
    meaning:string,
    options:string[],
}
interface StateType {
    loading : boolean,
    darkMode:boolean,
    result: string[],
    words:WordType[],
    error?:string,
    login:boolean,
    otpVal:string
}

type FetchedDataType = {
    data:{
        translations:{
            translatedText:string
        }[]
    }
}
