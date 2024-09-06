import React, { useState } from "react";

import { Link,useNavigate } from "react-router-dom";

import avatar from "../assets/profile.png";

import styles from "../styles/Username.module.css";

import toast, { Toaster,Toast } from "react-hot-toast";
import { useFormik } from "formik";

import { registerValidate } from "../helper/validate";

import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";

const Register = () => {

  const navigate= useNavigate();

  const [ file, setFile ] = useState();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values =  Object.assign(values, { profile: file || "" });

     const registerPromise=  registerUser(values)
  


      toast.promise(registerPromise,{

        loading:"Creating...",
        success:<b>Register Successfully...!</b>,
        error: <b>Could not register</b>


      })

      registerPromise.then(()=> navigate('/'))

    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);

    setFile(base64);
  };

  return (
    <div className="container mx-auto h-screen">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div
          className={styles.glass}
          style={{
            width: "45%",
            height: "max-content",
            paddingRight: 50,
            paddingBottom: 10,
            paddingTop: 25,
            paddingLeft: 50,
          }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold ">Register</h4>

            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  className={styles.profile_img}
                  src={file || avatar}
                  alt="avatar"
                />
              </label>

              <input
                type="file"
                name="profile"
                id="profile"
                onChange={onUpload}
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="email"
                placeholder="Email"
              />{" "}
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />{" "}
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered?{" "}
                <Link className="text-red-500" to="/">
                  Login now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
