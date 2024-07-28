import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../css/log.css";

import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/login", { username, password })
      .then((result) => {
        console.log(result);

        if (result.data.message === "nousername") {
          toast.error("Login Failed. No user.", { autoClose: 5000 });
        } else if (result.data.message === "caseusername") {
          toast.error("Login Failed. No user existed.");
        } else if (result.data.message === "nopassword") {
          toast.error("Login Failed. No Password");
        } else if (result.data.message === "casepassword") {
          toast.error("Login Failed. Incorrect Password");
        } else if (result.data.message === "loginok") {
          toast.success("Login successful!", { autoClose: 5000 });
          setTimeout(() => {
            navigate("/");
          },1000);
       
        } else {
          toast.error("Login Failed. No record existed.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="mainx">
        <div className="formx">
          <Form onSubmit={handleSubmit}>
            <h4>Login Now</h4>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              {/* <Form.Label>Username</Form.Label> */}
              <br />
              <input
                type="text"
                name="name"
                placeholder="Enter Username"
                autoComplete="off"
                defaultValue={""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="formBasicPassword">
              {/* <Form.Label>Password</Form.Label> */}
              <br />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                autoComplete="off"
                defaultValue={""}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Form>

          <Button variant="primary" type="login">
            <a href="/">Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;