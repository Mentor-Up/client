/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {Avatar, Box, Button, Container, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, SwipeableDrawer, Toolbar, Tooltip, Typography, styled, useTheme } from '@mui/material'
import { CalendarMonth, MenuRounded } from '@mui/icons-material';
import MuiAppBar from '@mui/material/AppBar'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from "./NavigationBar.module.css";
import NavigationBarButton from '../NavigationBar/NavigationBarButton';

const drawerWidth = "auto";

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...((open || !open) && {
        width: `calc(100% - ${drawerWidth}px)`,
        zIndex: theme.zIndex.drawer+1, // add this line to increate appBar z-index
        marginTop: "0px",
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
}));
/*
    ==========================
    =      AUX VARIABLES     =
    ==========================
*/
const pages = ["Option1", "Option2", "Option3"];
const settings = ["Option1", "Option2", "Sign out"];

const NavigationBar = ({auth, onExpireAuth}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    //1. State used for nav-bar hamburguer menu position:
    const [anchorNav, setAnchorNav] = useState(false);
    //2. State used for user settings position:
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    const theme = useTheme();
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
    //1. Handler for opening the nav-bar hamburguer menu.
    const handleDrawerToggling = (open, event) => {
        //If the user moves the selected list item using the tab key or enters a list item using enter key: do not close the drawer.
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) 
        {
            return;
        }
        setAnchorNav(open);
    }
    //2. Handler for opening the user settings menu.
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }
    //3. Handler for closing the user settings menu.
    const handleCloseUserMenu = (event, setting) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) 
        {
            return;
        }
        if(setting === "Sign out"){
            setAnchorElUser(null);
            onExpireAuth(false);
        }
        else{
            setAnchorElUser(null);
        }
    }

    /*
        ==========================
        =    COMPONENT RENDER    =
        ==========================
    */
    return (
        <>
            <AppBar position="fixed" sx={{bgcolor:"#1A1A2E"}} open={anchorNav}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{display:"flex", justifyContent: auth ? "space-between" : {xs: "center", md: "space-between"}}}>
                        {
                            auth && (
                                <Box sx={{display: {xs: "flex", md:"none"}}}>
                                    <IconButton
                                        size="large"
                                        aria-label="Menu options for current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={(event)=>anchorNav ? handleDrawerToggling(false, event) : handleDrawerToggling(true, event)}
                                        color="inherit"
                                    >
                                        <MenuRounded/>
                                    </IconButton>
                                </Box>
                            )
                        }
                        <Box sx={{display: {xs: "flex", md:"flex"}, justifySelf:"center"}}>
                            <Link to="/" className={styles.mentorUpLogoLink} > 
                                <img className={styles.mentorUpLogo} src='/images/logo.png'/>                    
                            </Link>
                        </Box>
                        {
                            auth && (
                                <>
                                    <Box sx={{flexGrow:1, display:{xs:"none", md:"flex"}, justifyContent:"flex-start"}}>
                                        {
                                            pages.map((page) => {
                                                return(
                                                    <NavigationBarButton key={page} text={page} onDrawerToggling={(event)=>handleDrawerToggling(false, event)}/>
                                                );
                                            })
                                        }
                                    </Box>
                                    <Box sx={{flexGrow: 0}}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{p:0}}>
                                                <Avatar alt="User profile picture" src="/images/user.png"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={
                                                {
                                                    mt: "45px", 
                                                    "& .MuiMenu-paper": {
                                                        bgcolor: "#16213E", 
                                                        color: "white", 
                                                        "& .MuiMenuItem-root:hover":{
                                                            bgcolor:"#C84B31"
                                                        },
                                                    },
                                                    "& .MuiList-root": {
                                                        py: "0px"
                                                    }
                                                }
                                            }
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{vertical: "top", horizontal: "right"}}
                                            keepMounted
                                            transformOrigin={{vertical:"top", horizontal: "right"}}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            {
                                                settings.map((setting)=>{
                                                    return(
                                                        <MenuItem key={setting} onClick={(event)=>handleCloseUserMenu(event, setting)}>
                                                            <Typography textAlign="center">
                                                                {setting}
                                                            </Typography>
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </Menu>
                                    </Box>
                                </>
                            )
                        }
                    </Toolbar>
                </Container>
            </AppBar>
            <SwipeableDrawer
                sx={
                    {
                        display:{xs:"float", md:"none"}, 
                        width: drawerWidth, 
                        flexShrink: 0, 
                        "& .MuiDrawer-paper": {width: drawerWidth, boxSizing: "border-box"},
                    }}
                anchor="top"
                open={anchorNav}
                onClose={(event)=>handleDrawerToggling(false, event)}
                onOpen={(event)=>handleDrawerToggling(true, event)}
            >
                <DrawerHeader/>
                <Box
                    role="presentation"
                    onClick={(event)=>handleDrawerToggling(false, event)}
                    onKeyDown={(event)=>handleDrawerToggling(false, event)}
                    sx={{bgcolor: "#16213E"}}
                >
                    <List
                        sx={{
                            // hover states
                            '& .MuiListItemButton-root:hover': {
                              bgcolor: '#C84B31',
                              '&, & .MuiListItemIcon-root': {
                                color: '#ECDBBA',
                              },
                            },
                            '& .MuiListItemButton-root:focus':{
                                bgcolor: '#C84B31'
                            },
                            paddingBottom:"0px"
                          }}
                    >
                        {
                            pages.map((page)=>{
                                return(
                                    <ListItem key={page} disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <CalendarMonth sx={{color:"#FFFFFF"}}/>
                                            </ListItemIcon>
                                            <ListItemText sx={{color:"#FFFFFF"}} primary={page}/>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Box>
            </SwipeableDrawer>
        </>
    )
}

export default NavigationBar