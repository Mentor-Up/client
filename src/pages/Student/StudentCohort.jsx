// Line  136  {new Date(session.start).toLocaleDateString()} ==> change to date and time for example 8/23 8:00 PM
import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AppButton from "../../components/Button/AppButton";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { CancelOutlined, CheckCircleOutlineRounded } from "@mui/icons-material";

const StudentCohort = () => {
  const { state } = useLocation();
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState();
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const cohortId = state._id;
  const navigate = useNavigate();

  const getCurrentWeek = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/week/${cohortId}/current`);
    console.log(data);

    setCurrentWeek(data.currentWeek);
    setLoading(false);
  };

  const handleConfirmStatus = async (sessionID) => {
    setLoading(true);
    const { data } = await axiosPrivate.patch(
      `/session/${sessionID}/student/updateStatus`,
      {
        status: true,
      }
    );
    setLoading(false);
    setConfirm(true);
    // setCurrentWeek((prevWeeks) => [...prevWeeks, {
    // }]);
  };

  const handleCancelStatus = async (sessionID) => {
    setLoading(true);
    const { data } = await axiosPrivate.patch(
      `/session/${sessionID}/student/updateStatus`,
      {
        status: false,
      }
    );
    setLoading(false);
    // setCurrentWeek((prevWeeks) => [...prevWeeks, {

    // }]);
  };

  const handleClick = (sessionId) => {
    navigate(`/student/session/${sessionId}`);
  };

  useEffect(() => {
    getCurrentWeek();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "transparent",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            backgroundColor: "#C84B31",
            borderRadius: 2,
            padding: 2,
            margin: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {state.name}
        </Typography>
      </Box>
      <Typography
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
        {currentWeek?.name}
      </Typography>
      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", paddingBlock: 2 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {currentWeek?.sessions?.length > 0 ? (
            currentWeek?.sessions.map((session) => (
              <Card
                key={session._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1px",
                }}
              >
                <Box>
                  <CardContent>
                    <Typography
                      onClick={() => handleClick(session._id)}
                      variant="h5"
                    >{`${session.type} session`}</Typography>
                    <Typography variant="subtitle1">
                      {new Date(session.start).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
                <Box>
                  <CardContent>
                    <Typography>{`Host: ${session.creator.name}`}</Typography>
                    <Typography>
                      {`${session.participant.length}`} student confirmed to
                      join
                    </Typography>
                    <Typography></Typography>
                  </CardContent>
                </Box>
                <CardActions>
                  {
                    session.participant.includes(auth.userId) ?
                    (
                      <>
                        <AppButton
                          text={"Yes"}
                          type="button"
                          width="auto"
                          color={"#609966"}
                          handlerFunction={() => handleConfirmStatus(session._id)}
                        >
                          <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                        </AppButton>
                        <AppButton
                          text={"No"}
                          type="button"
                          width="auto"
                          color={"white"}
                          textColor={"#1A1A2E"}
                          handlerFunction={() => handleCancelStatus(session._id)}
                        >
                          <CancelOutlined></CancelOutlined>
                        </AppButton>
                      </>
                    )
                    :
                    (
                      <>
                        <AppButton
                          text={"Yes"}
                          type="button"
                          width="auto"
                          color={"white"}
                          textColor={"#1A1A2E"}
                          handlerFunction={() => handleConfirmStatus(session._id)}
                        >
                          <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                        </AppButton>
                        <AppButton
                          text={"No"}
                          type="button"
                          width="auto"
                          color="#CD1818"
                          handlerFunction={() => handleCancelStatus(session._id)}
                        >
                          <CancelOutlined></CancelOutlined>
                        </AppButton>
                      </>
                    )
                  }
                  
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: "#f2f2f2",
                padding: 2,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              No sessions scheduled for this week
            </Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default StudentCohort;
