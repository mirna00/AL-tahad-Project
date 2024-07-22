import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import useAbility from "./../permission/useAbility";
import { localStorageServices } from "../api/tokenService";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';

// const LOGIN_URL = 'http://91.144.20.117:7109/api/auth/login';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    wedth:"100vh",
    backgroundColor: '#282828',
    backgroundImage: 'url("/path/to/your/logo.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    backgroundSize: '150px',
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    width: '300px',
  },
  button: {
    marginTop: theme.spacing(2),
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

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  useEffect(() => {
    localStorageServices.getUser();
    setErrMsg("");
  }, [mobile_number, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    const response = await axios
      .post("http://91.144.20.117:7109/api/auth/login", {
        mobile_number: mobile_number,
        password: password,
      })
      .then((res) => {
        const { success, message, data } = res.data;
        const { user, token } = data;
        localStorageServices.setToken(token);
        localStorageServices.setUser(user);
        console.log("sss");
        navigate(`${roleNavigation[user.role].link}`);
      })
      .catch((err) => {
        // const { success, message, data } = err.data;
        // setErrMsg(message);
        // errRef.current.focus();
      });
  };

  return (
    <div className={classes.root}>
      {success ? (
        <div>
          <h1>You are logged in!</h1>
        </div>
      ) : (
        <div className={classes.form}>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              label="الرقم"
              type="text"
              autoComplete="off"
              onChange={(e) => setmobile_number(e.target.value)}
              value={mobile_number}
              required
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              Sign In
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;

const roleNavigation = {
  
 "Admin": { link: "/dashboard/الإدارة" },
 "Travel Trips Employee":{link: "/dashboard/السفر"},
 "University trips Employee": { link: "/dashboard/الجامعات" },
 "Shipment Employee":{ link: "/dashboard/الشحن" }
};
