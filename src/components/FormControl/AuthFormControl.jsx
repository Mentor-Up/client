/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { FormControl, styled } from '@mui/material';
import PropTypes from "prop-types";
/*
    ==========================
    =    STYLED COMPONENTS   =
    ==========================
*/
const StyledAuthFormControl = styled(FormControl)(()=>({
    //Display
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    gap:"10px",
    //Spacing
    padding: "5px"
}));

const AuthFormControl = ({children}) => {
    return (
       <StyledAuthFormControl>
            {children}
       </StyledAuthFormControl> 
    );
}

export default AuthFormControl;

AuthFormControl.propTypes = {
    children: PropTypes.node.isRequired
};