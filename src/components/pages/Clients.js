import React, { useEffect, useRef, useState } from "react";
import useValidation from "../comman/useValidation";
import folderImge from "../comman/images/folder1.jpg";
import {
  AddClientByadmin,
  deleteClientfunction,
  getAllUserswithFilter,
  getClientByID,
  UpdateClient,
} from "../../api/api";
import Header from "../comman/Header";
import SideBar from "../comman/SideBar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// const ref = useRef();

const Clients = () => {
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");
  const [modelshow, setModelshow] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clienttype, setClientType] = useState("");

  const [Modelclassvalue, setModelclassvalue] = useState("");
  const [apicall, setapicall] = useState(false);
  const ref = useRef();

  // for target model className------
  useEffect(() => {
    setModelclassvalue(ref.current.className);
  }, [Modelclassvalue]);

  // model input field input field intialstate---------
  const initialFormState = {
    admin_id: admin_id,
    type: "",
    name: "",
    email: "",
    phone_no: "",
    address: "",
    company_name: "",
    company_address: "",
  };

  const [showCompany, setShowCompany] = useState(false);
  const [modelClass, setModelclass] = useState(false);
  const [getClientsData, setGetClientsData] = useState([]);

  const [emailError, setEmailError] = useState(false);
  // validation fuction come from use validation custom hook
  const validators = {
    type: [
      (value) =>
        value === null || value === ""
          ? "Type is  required"
          : /[^A-Za-z 0-9]/g.test(value)
          ? "Cannot use special character "
          : null,
    ],
    name: [
      (value) =>
        value === null || value === ""
          ? "Name is required"
          : /[^A-Za-z 0-9]/g.test(value)
          ? "Cannot use special character "
          : null,
    ],
    email: [
      (value) =>
        value === null || value === ""
          ? "Email address is required"
          : !/^\S+@\S+\.\S+$/.test(value)
          ? "Invalid email address"
          : null,
    ],
    phone_no: [
      (value) =>
        value === null || value === ""
          ? "Phone number is required"
          : // : /^(\+\d{1,3}[- ]?)?\d{10}$/g.test(value)
          // ? "Invalid Mobile number "
          value.length > 10 || value.length < 10
          ? "Contect number should be 10 digit"
          : null,
    ],
    address: [
      (value) =>
        value === null || value === "" ? "Address is required" : null,
    ],

    // company_name: [
    //   (value) =>
    //     value === null || value === ""
    //       ? "Company Name is required"
    //       : /[^A-Za-z 0-9]/g.test(value)
    //       ? "Cannot use special character "
    //       : null,
    // ],
    // company_address: [
    //   (value) =>
    //     value === null || value === ""
    //       ? "Company Address is required"
    //       : /[^A-Za-z 0-9]/g.test(value)
    //       ? "Cannot use special character "
    //       : null,
    // ],
  };

  // useValidation custom validation
  const {
    state,
    setState,
    onInputChange,
    errors,
    setErrors,
    validate,
  } = useValidation(initialFormState, validators);

  //useEffect use for model client type show company and individual
  useEffect(() => {
    if (state.type === "individual") {
      setShowCompany(true);
    } else {
      setShowCompany(false);
    }
  }, [state.type]);

  // function add client when submit button click
  const onClientAdd = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await AddClientByadmin(state);

      if (response.message === "already added by this admin") {
        setEmailError(true);
      }

      if (response.message === "Client added successfully") {
        Swal.fire({
          title: "Success",
          text: "Client added succuesfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function() {
          setModelclass(true);
          setState(state);
          setapicall(true);
        });
      }
    }
    setapicall(false);
    setModelclass(false);
  };

  // function update client when Update  button click
  const onClientUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await UpdateClient(state);

      if (response.message === "updated Client successfully") {
        Swal.fire({
          title: "Success",
          text: "Update succuesfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function() {
          setModelclass(true);
          setState(state);
          setapicall(true);
        });
      }
    }

    setapicall(false);
    setModelclass(false);
  };

  // useEffcet use for get client  api fucntion call
  useEffect(() => {
    getClients();
  }, [apicall, clientName, clienttype]);

  // funtion for get list of client
  const getClients = async () => {
    const response = await getAllUserswithFilter(
      admin_id,
      clientName,
      clienttype
    );

    setGetClientsData(response);
    setapicall(false);
  };

  const clientNameOnChange = (e) => {
    setClientName(e.target.value);
    setapicall(true);
  };

  const clienttypeOnChange = (e) => {
    setClientType(e.target.value);
    setapicall(true);
  };

  // funtion for update model open and get data from api based on client id
  const onUpdateModelClick = async (id) => {
    setModelshow(true);
    const response = await getClientByID(id);

    setState(response[0]);
  };

  // funtion for close model and reset input feild
  const onCloseModel = () => {
    setState(initialFormState);
    setErrors({});
    setEmailError(false);
  };

  // funtion for open  model and reset input feild
  const onModelOpen = async () => {
    setModelshow(false);
    setState(initialFormState);
    setEmailError(false);
  };

  // function for clicking client and send id and name on gallary
  const onClientClick = (id, name, email) => {
    localStorage.setItem("client_name", name);
    localStorage.setItem("client_email", email);
    navigate(`/gallary?client_id=${id}`);
  };

  // funtion for open delete sweet alert
  const onDeleteModelClick = (name, id) => {
    Swal.fire({
      title: "Warning",
      text: `You want to delete ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteClientfunction(id);
        if (response.message === "delete clients successfully") {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          setapicall(true);
        }
      }
    });
    setapicall(false);
  };

  return (
    <>
      <div className="theme-red ">
        <Header />
        <SideBar />
        <section className="content">
          <div className="container-fluid">
            <div className="block-header">
              <h2>Clients Details</h2>
              <div className=" text-right">
                <button
                  className="btn btn-success"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={() => onModelOpen()}
                >
                  ADD CLIENTS
                </button>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="card">
                  <div className="body">
                    <div className="row clearfix">
                      <div className="col-sm-3">
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              onChange={(e) => clientNameOnChange(e)}
                              placeholder="Search Client Name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-3" style={{ marginTop: "10px" }}>
                        <select
                          className="form-control "
                          value={clienttype}
                          name="type"
                          onChange={(e) => clienttypeOnChange(e)}
                        >
                          <option value={""} className="text-center">
                            -- Please select client type --
                          </option>
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                          <option value="">all</option>
                        </select>
                      </div>
                    </div>

                    <div className="row clearfix">
                      {getClientsData.length === 0 ? (
                        <h1 className="text-center">No record Found</h1>
                      ) : (
                        getClientsData.map((item) => {
                          return (
                            <>
                              <div className="col-sm-2">
                                <div className="card deshbord_user_card ">
                                  <div className="header">
                                    {item.type === "individual" ? (
                                      <span
                                        class="badge btn btn-success"
                                        style={{ marginRight: "150px" }}
                                      >
                                        <i class="material-icons">person</i>
                                      </span>
                                    ) : item.type === "company" ? (
                                      <span
                                        class="badge btn btn-danger"
                                        style={{ marginRight: "150px" }}
                                      >
                                        <i class="material-icons">
                                          account_balance
                                        </i>
                                      </span>
                                    ) : null}

                                    <img
                                      src={folderImge}
                                      alt={folderImge}
                                      height="100px"
                                      onClick={() =>
                                        onClientClick(
                                          item.id,
                                          item.name,
                                          item.email
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                    <h2>{item.name}</h2>
                                    <div className="profile_edit_delete">
                                      <i
                                        class="material-icons text-primary"
                                        data-toggle="modal"
                                        data-target="#exampleModal"
                                        onClick={() =>
                                          onUpdateModelClick(item.id)
                                        }
                                      >
                                        edit
                                      </i>
                                      <i
                                        class="material-icons text-danger"
                                        onClick={() =>
                                          onDeleteModelClick(item.name, item.id)
                                        }
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </div>
                                  <div className="body">
                                    Phone:- {item.phone_no}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        ref={ref}
        className={
          Modelclassvalue === "modal fade"
            ? "modal fade"
            : modelClass === true
            ? "modal fade"
            : "modal fade in"
        }
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="back_drop"></div>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {modelshow === true ? "Update Client" : " Add Client"}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => onCloseModel()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="body">
                <form
                  className="form-horizontal"
                  onSubmit={
                    modelshow === true
                      ? (e) => {
                          onClientUpdate(e);
                        }
                      : (e) => {
                          onClientAdd(e);
                        }
                  }
                >
                  <div className="row clearfix">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                      <label htmlFor="password_2">Type</label>{" "}
                      <small className="text-danger">*</small>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                      <select
                        className="form-control "
                        value={state.type}
                        name="type"
                        onChange={onInputChange}
                      >
                        <option value="">-- Please select type --</option>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                      </select>
                      {errors.type
                        ? (errors.type || []).map((error, i) => {
                            return (
                              <small className="text-danger" key={i}>
                                {error}
                              </small>
                            );
                          })
                        : null}
                    </div>
                  </div>
                  <div className="row clearfix">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                      <label htmlFor="name">Name</label>
                      <small className="text-danger">*</small>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <div className="form-line">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            maxLength={30}
                            value={state.name}
                            onChange={onInputChange}
                            className="form-control"
                            placeholder="Enter your name"
                          />
                        </div>
                        {errors.name
                          ? (errors.name || []).map((error, i) => {
                              return (
                                <small className="text-danger" key={i}>
                                  {error}
                                </small>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="row clearfix">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                      <label htmlFor="email">Email</label>
                      <small className="text-danger">*</small>
                    </div>
                    <div
                      className="col-lg-10 col-md-10 col-sm-12 col-xs-12
                    "
                    >
                      <div className="form-group">
                        <div className="form-line">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={state.email}
                            onChange={onInputChange}
                            className="form-control"
                            placeholder="Enter your email address"
                          />
                        </div>
                        {errors.email
                          ? (errors.email || []).map((error, i) => {
                              return (
                                <small className="text-danger" key={i}>
                                  {error}
                                </small>
                              );
                            })
                          : null}
                        {emailError === true ? (
                          <small className="text-danger">
                            Client already registerd by this admin
                          </small>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="row clearfix">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                      <label htmlFor="name">
                        Phone No. <small className="text-danger">*</small>
                      </label>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <div className="form-line">
                          <input
                            type="number"
                            id="phone_no"
                            name="phone_no"
                            maxLength={10}
                            value={state.phone_no}
                            onChange={onInputChange}
                            className="form-control"
                            placeholder="Enter your phone no"
                          />
                        </div>
                        {errors.phone_no
                          ? (errors.phone_no || []).map((error, i) => {
                              return (
                                <small className="text-danger" key={i}>
                                  {error}
                                </small>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="row clearfix">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                      <label htmlFor="name">
                        Address <small className="text-danger">*</small>
                      </label>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <div className="form-line">
                          <textarea
                            rows="4"
                            className="form-control no-resize"
                            placeholder="Please type what you want..."
                            name="address"
                            value={state.address}
                            onChange={onInputChange}
                          ></textarea>
                        </div>
                        {errors.address
                          ? (errors.address || []).map((error, i) => {
                              return (
                                <small className="text-danger" key={i}>
                                  {error}
                                </small>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </div>

                  {showCompany === false ? (
                    <div>
                      <div className="row clearfix">
                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                          <label htmlFor="name">Company Name. </label>
                        </div>
                        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <div className="form-line">
                              <input
                                type="text"
                                id="company_name"
                                maxLength={30}
                                name="company_name"
                                value={state.company_name}
                                onChange={onInputChange}
                                className="form-control"
                                placeholder="Enter your company name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row clearfix">
                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 form-control-label">
                          <label htmlFor="name">Company Address </label>
                        </div>
                        <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                          <div className="form-group">
                            <div className="form-line">
                              <textarea
                                rows="4"
                                className="form-control no-resize"
                                placeholder="Please type what you want..."
                                name="company_address"
                                value={state.company_address}
                                onChange={onInputChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="row clearfix">
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        id="closeButton1"
                        onClick={() => onCloseModel()}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {modelshow === true ? "Update" : " Add "}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;
