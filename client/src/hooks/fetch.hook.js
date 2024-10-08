

    import axios from "axios"
    import { getUsername } from "../helper/helper";

import { useEffect, useState } from "react";

    axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;



    export default function useFetch(query){

      const [getData,setData]=  useState({isLoading:false,apiData:undefined,status:null,serverError:null})


      useEffect(()=>{



        const fetchData = async ()=>{
            try {


                setData((prev) => ({ ...prev, isLoading: true }));

               const { username } = !query ? await getUsername() : "";
                const response =!query?await axios.get(`/api/user/${username}`): await axios.get(`/api/${query}`)
                
              
                

                if(response.status===200) {

                     setData((prev) => ({ ...prev, isLoading: false , apiData:response.data,status:response.status }));
                     
                     
                     
                    }
                    
                    setData((prev) => ({ ...prev, isLoading: false  }));


            } catch (error) {
                
                setData(prev=> ({...prev,isLoading:false,}))
                setData(prev=> ({...prev,serverError:error,}))
            }




        }
        fetchData()

      },[query])

      return [getData,setData];

    }
