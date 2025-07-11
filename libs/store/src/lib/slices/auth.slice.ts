import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import{ User, WSO2Token} from '@cookers/models'

interface AuthState {
    wso2Token: WSO2Token;
    user: User;
}

const initialState: AuthState = {
    wso2Token: {
        access_token: '',
        expires_in: 0,
        refresh_token: '',
        scope: '',
        token_type: '',
    },
    user: {
        id: 0,
        originator: '',
        name: '',
        isDriver: false,
        groupDesc: '',
        firstLetter: '',
        empId:0
    }
};

const authSlice = createSlice({
    name: 'wso2',
    initialState,
    reducers: {
        setWso2Token(state, action: PayloadAction<WSO2Token>) {
            state.wso2Token = action.payload;
        },
        setUserDetails(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
});

export const { setWso2Token,setUserDetails} = authSlice.actions;
export default authSlice.reducer;
