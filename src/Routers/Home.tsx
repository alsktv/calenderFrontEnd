import {  Outlet, useNavigate,  useParams } from "react-router-dom";
import {Box ,HStack} from '@chakra-ui/react';
import { useEffect } from 'react';
import FCalendar from "../Components/Home/Calender";
import FTopBar from "../Components/Home/TopBar";
import FTotalMemo from "../Components/Home/TotalMemo";
import { jwtDecode } from "jwt-decode";

interface IToken {
  pk:number
}


export default function Home() {

  const {userPk} = useParams()

  const navigate = useNavigate()

  useEffect(()=>{
   const jwt = localStorage.getItem("jwt")
   if(jwt){
    const decode = jwtDecode<IToken>(jwt) 
    if(Number(userPk) !== decode["pk"]){
      console.log("You didn't have permission to acesses this account")
      navigate("/")
    }
   }else{
    console.log("You must login.")
    navigate("/")
   }

  },[])

  return(
    <HStack>
      <Box>
        <FTopBar />
        <FCalendar />
      </Box>
      <Outlet />
      <FTotalMemo />
    </HStack>

  )
}