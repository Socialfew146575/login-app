import React, { useState } from "react";

import { Link ,useNavigate} from "react-router-dom";

import avatar from "../assets/profile.png";

import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css"

import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";

import { profileValidate } from "../helper/validate";

import convertToBase64 from "../helper/convert";

import { updateUser } from "../helper/helper";

const Profile = () => {

  const navigate=useNavigate();

  
  
 const [{ isLoading, apiData, serverError }] = useFetch();




  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.user?.firstName || "",
      lastName: apiData?.user?.lastName || "",

      email: apiData?.user?.email || "",

      mobile: apiData?.user?.mobile || "",
      address: apiData?.user?.address || "",
    },
    enableReinitialize:true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.user?.profile|| "" });
      
      let updatePromise = updateUser(values);

      toast.promise(updatePromise,{

         loading: "Updating...",
        success: <b>Updated Successfully...</b>,
        error: <b>Could Not Update</b>,


      })




    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);

    setFile(base64);
  };

  function userLogout(){

    localStorage.removeItem('token')
    navigate('/')

  }

  return (
    <div className="container mx-auto h-screen">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div
          className={`${styles.glass} ${extend.glass}`}
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
            <h4 className="text-5xl font-bold ">Profile</h4>

            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details.
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  className={`${styles.profile_img} ${extend.profile_img}`}
                  src={apiData?.user?.profile || file || avatar}
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
              <div className="name flex w-full gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First Name"
                />{" "}
                <input
                  {...formik.getFieldProps("lastName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last Name"
                />{" "}
              </div>
              <div className="name flex w-full gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Mobile No."
                />{" "}
                <input
                  {...formik.getFieldProps("email")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="email"
                  placeholder="Email"
                />{" "}
              </div>{" "}
            
                <input
                  {...formik.getFieldProps("address")}
                  className={`${styles.textbox} `}
                  type="text"
                  placeholder="Address"
                />{" "}
                
                <button className={styles.btn} type="submit">
                  Update
                </button>
             
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
               <button className="text-red-500" onClick={userLogout}>Logout</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
