/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography } from "@mui/material";
import { Class, CloudDownloadRounded } from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from "../../../hooks/useAuth";
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./Cohorts.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AuthFormControl from "../../../components/FormControl/AuthFormControl";
import AppButton from "../../../components/Button/AppButton";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import CohortsActions from "./Actions/CohortsActions";
import Loader from "../../../components/Loader/Loader";
import AddCohort from "./Actions/AddCohort";

const Cohorts = () => {
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
    {
      field: "cohort",
      headerName: "Cohort",
      minWidth: 200,
      maxWidth: 200,
      flex: 1,
    },
    {
      field: "class",
      headerName: "Class",
      minWidth: 200,
      maxWidth: 200,
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Start date",
      type: "date",
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "End date",
      type: "date",
      minWidth: 150,
      maxWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 400,
      maxWidth: 400,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <CohortsActions
          params={params}
          onHandleCohorts={setCohorts}
        ></CohortsActions>
      ),
    },
  ];
  // Dialog states
  const [openNewCohortDialog, setOpenNewCohortDialog] = useState(false);
  /*
    ==========================
    =         HOOKS          =
    ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCohorts = async () => {
      try {
        const response = await axiosPrivate.get("/cohort", {
          signal: controller.signal,
        });
        console.log(response);
        const formattedCohorts = response.data.cohorts.map((cohort) => {
          return {
            id: cohort._id,
            cohort: cohort.name,
            class: cohort.type,
            startDate: new Date(cohort.start),
            endDate: new Date(cohort.end),
          };
        });
        console.log(formattedCohorts);
        isMounted && setCohorts(formattedCohorts);
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          //User is required to validate auth again
          navigate("/login", { state: { from: location }, replace: true });
          setAuth({
            userId: "",
            userName: "",
            userEmail: "",
            role: [],
            loggedIn: false,
            avatarUrl: "",
            isActive: undefined,
            accessToken: "",
          });
        } else {
          console.error(error);
        }
      }
    };

    fetchCohorts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#1A1A2E",
          color: "#FFFFFF",
          borderRadius: "10px",
          padding: 2,
          height: "auto",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            backgroundColor: "#C84B31",
            borderRadius: 2,
            padding: 1,
            margin: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {" "}
          COHORTS MANAGEMENT{" "}
        </Typography>
        <div className={styles.formContainer}>
          <AuthFormControl width="50%">
            <AppButton
              text={"Add new cohort"}
              type="button"
              width="100%"
              handlerFunction={() => setOpenNewCohortDialog(true)}
            >
              <Class fontSize="large"></Class>
            </AppButton>
            <AppButton
              text={"Add cohort from Slack"}
              type="button"
              width="100%"
              handlerFunction={() => {}}
            >
              <CloudDownloadRounded fontSize="large"></CloudDownloadRounded>
            </AppButton>
          </AuthFormControl>
        </div>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Box>
        ) : (
          <AppDataGrid
            columns={columns}
            rows={cohorts}
            fieldToBeSorted={"class"}
            sortType={"asc"}
          />
        )}
        {openNewCohortDialog ? (
          <AddCohort
            open={openNewCohortDialog}
            handleOpen={setOpenNewCohortDialog}
            onRegisterCohort={setCohorts}
          ></AddCohort>
        ) : null}
      </Paper>
    </Container>
  );
};

export default Cohorts;
