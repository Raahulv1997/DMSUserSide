import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordFunction } from "../../api/api";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();
  const [emailToken, setEmailToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [PasswordError, setPasswordError] = useState(false);
  const [getLinkLoader, setGetLinkLoader] = useState(false);

  // useEffect for get email token value from perameter ------------------
  useEffect(() => {
    if (
      searchparams.get("token") === null ||
      searchparams.get("token") === "" ||
      searchparams.get("token") === undefined
    ) {
      setEmailToken("");
    } else {
      setEmailToken(searchparams.get("token"));
    }
  }, [emailToken]);

  //onchange funtion for set password value and hide error----------
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };
  //onchange funtion for  set confirm password--value and hide error-----------
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(false);
  };

  //onclick submit button for reset password----------------
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (password === "") {
      setPasswordError("password is black");
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, one letter, one number, and one special character (@$!%*#?&)"
      );
    } else if (confirmpassword === "") {
      setPasswordError("confirmpassword is black");
    } else if (!passwordRegex.test(confirmpassword)) {
      setPasswordError(
        "Confirm Password must contain at least 8 characters, one letter, one number, and one special character (@$!%*#?&)"
      );
    } else if (password !== confirmpassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setGetLinkLoader(true);
      const response = await ResetPasswordFunction(password, emailToken);
      setGetLinkLoader(false);
      if (response.message === "updated password successfully") {
        Swal.fire({
          title: "Success",
          text: "password changed successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function() {
          navigate("/");
        });
      }
    }

    // Submit the form
    // Your logic for form submission goes here
  };

  return (
    <>
      <div className="fp-page">
        <div className="fp-box">
          <div className="logo">
            <Link to="">
              <b>DMS</b>
            </Link>
            <small>Document Management System</small>
          </div>
          <div className="card">
            <div className="body">
              <form id="forgot_password" onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      maxLength={"20"}
                      name="password"
                      placeholder="New password"
                      onChange={handlePasswordChange}
                      autoFocus
                    />
                  </div>
                  {PasswordError === "password is black" ? (
                    <small className="text-danger">
                      Password is required!!!
                    </small>
                  ) : null}
                  {PasswordError ===
                  "Password must contain at least 8 characters, one letter, one number, and one special character (@$!%*#?&)" ? (
                    <small className="text-danger">
                      Password must contain at least 5 characters, one letter,
                      one number, and one special character (@$!%*#?&)!!!
                    </small>
                  ) : null}
                </div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      name="Confirm new password"
                      maxLength={"20"}
                      placeholder="Confirm new password"
                      onChange={handleConfirmPasswordChange}
                      autoFocus
                    />
                  </div>
                  {PasswordError === "confirmpassword is black" ? (
                    <small className="text-danger">
                      Confirm Password is required!!!
                    </small>
                  ) : null}
                  {PasswordError ===
                  "Confirm Password must contain at least 8 characters, one letter, one number, and one special character (@$!%*#?&)" ? (
                    <small className="text-danger">
                      Confirm Password must contain at least 5 characters, one
                      letter, one number, and one special character (@$!%*#?&)
                    </small>
                  ) : null}
                  {PasswordError === "Passwords do not match" ? (
                    <small className="text-danger">
                      Passwords do not match!!!!
                    </small>
                  ) : null}
                </div>
                <button
                  className="btn btn-block btn-lg bg-pink waves-effect"
                  type="submit"
                >
                  {" "}
                  <div
                    className={
                      getLinkLoader === true
                        ? "get_link_spinner loader_btn"
                        : "loader_btn"
                    }
                  >
                    <div className="preloader pl-size-xs">
                      <div className="spinner-layer pl-red-grey">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>
                    </div>

                    <span className="get_link_btn">RESET MY PASSWORD</span>
                  </div>
                </button>

                <div className="row m-t-20 m-b--5 align-center">
                  <Link to="/">Sign In!</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
