import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState: StateType = {
    loading: false,
    darkMode:false,
    words: [],
    result: [],
    login:false
}
const rootSlice = createSlice({
    name: "root",
    initialState,
    reducers: {
        getWordsRequest: (state) => {
            state.loading = true;
        },
        getWordsSuccess: (state, action: PayloadAction<WordType[]>) => {
            state.loading = false;
            state.words = action.payload;
        },
        getWordsFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        saveResult: (state, action: PayloadAction<string[]>) => {
            state.loading = false;
            state.result = action.payload;
        },
        clearState: (state) => {
            state.loading = false;
            state.result = [];
            state.words = [];
            state.error = undefined;
        },
        dark :(state,action:PayloadAction<boolean>)=>{
            state.darkMode = action.payload
        },
        getLogin:(state,action:PayloadAction<boolean>)=>{
            state.login = action.payload
        }
        

    },
})
export const {getWordsSuccess,getWordsRequest,getWordsFail,clearState,saveResult,dark,getLogin} = rootSlice.actions;
export default rootSlice.reducer;