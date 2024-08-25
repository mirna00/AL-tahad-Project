import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import useAbility from "./../permission/useAbility";
import { localStorageServices } from "../api/tokenService";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid, Box, Typography } from "@material-ui/core";
// import background from "../assets/background/background.png"
import back from "../assets/background/back.png"
import "../Auth/Login.css";


// const LOGIN_URL = 'http://91.144.20.117:7109/api/auth/login';
const useStyles = makeStyles((theme) => ({

 

  rightSide: {
    width: "50%",
marginTop:"15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
    fontFamily: '"Poppins", sans-serif',
  },

  textfield: {
    marginBottom: "20px",
    background: "#eeee",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const Login = () => {
  const classes = useStyles();

  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const can = useAbility();
  const { setUser } = useAuth();
  const [mobile_number, setmobile_number] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});



  useEffect(() => {
    localStorageServices.getUser();
    setErrMsg("");
  }, [mobile_number, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({}); // Clear previous validation errors

    // Basic validation


    try {
      const res = await axios.post("http://161.35.27.202/api/auth/login", {
        mobile_number,
        password,
      });
      const { success, message, data } = res.data;
      const { user, token } = data;
      localStorageServices.setToken(token);
      localStorageServices.setUser(user);
      navigate(`${roleNavigation[user.role].link}`);
    } catch (err) {
      const { message } = err.response.data; // Adjust based on your error response structure
      setErrMsg(message);
      console.log(err.response.data)
    }
  };
 

  return (
    <Box className={classes.root} style={{
      backgroundImage: `url(${back})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    minHeight: '100vh',
  }}>
     
      <Box className={classes.rightSide}>
        <Grid item>
          <h1 style={{ textAlign: "center", marginBottom: "20px" ,fontSize:'40px',fontFamily:'bold' }}>
            {" "}
            تسجيل الدخول
          </h1>
          {errMsg && <Typography color="error">{errMsg}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.textfield}
              fullWidth
              variant="filled"
              label="الرقم"
              type="text"
              autoComplete="off"
              onChange={(e) => setmobile_number(e.target.value)}
              value={mobile_number}
              required
            />
             
          
            <TextField
            className={classes.textfield}
              fullWidth
              variant="filled"
              label="كلمة المرور"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
              
            />
            
            <input
              type="submit"
              value="تسجيل الدخول"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#f93e3ee8",
                border: "none",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
            />
          </form>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;

const roleNavigation = {
  Admin: { link: "/dashboard/الإدارة" },
  "Travel Trips Employee": { link: "/dashboard/السفر" },
  "University trips Employee": { link: "/dashboard/الجامعات" },
  "Shipment Employee": { link: "/dashboard/الشحن" },
};
