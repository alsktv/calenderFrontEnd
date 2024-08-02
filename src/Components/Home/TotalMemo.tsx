import {  Box, Button, Center, Text, useDisclosure,  } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { APIGetTotalMemo } from "../../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PutTotalMemo from "./PutTotalMemo";

//전체 메모를 보여주는 컴포넌트
export default function FTotalMemo(){

  ///////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수들
  ///////////////////////////////////////////////////////////////////////////////


  //1.1 -> totalMemo를 저장하는 변수
   const [totalMemo , setTotalMemo] = useState<string>()

   //1.2 -> useParams
   const {year , month , day , userPk} = useParams()



  ///////////////////////////////////////////////////////////////////////////////
  //2.프로그램에 필요한 함수들
  ///////////////////////////////////////////////////////////////////////////////


  const subOnChange = () => {
    getTotalMemoMutation.mutate(Number(userPk))
  }



  ///////////////////////////////////////////////////////////////////////////////
  //3.뮤테이션 함수들
  ///////////////////////////////////////////////////////////////////////////////


  //3.1 -> 특정 유저의 totalMemo를 가져오는 뮤테이션 변수
   const getTotalMemoMutation = useMutation(APIGetTotalMemo , 
    {
      onSuccess:(data) => {
       setTotalMemo(data.data.totalMemo.description)
      }
    }
   )


  ///////////////////////////////////////////////////////////////////////////////
  //4. useEffect함수들
  ///////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////////////////////
  //5. 모달창에 필요한 변수들
  ///////////////////////////////////////////////////////////////////////////////

  const {isOpen:PutTotalMemoIsOpen , onClose:PutTotalMemoOnClose , onOpen:PutTotalMemoOnOpen} =useDisclosure()

//4.1 -> getMutation을 시행하는 함수
  useEffect(()=>{
    getTotalMemoMutation.mutate(Number(userPk))
  },[year,month,day])


  return(
     <Box maxW='sm' borderWidth='3px' borderRadius='lg' overflow='hidden' w={250}>
      <Text textAlign={"center"} color={"blue"}> 메모장 </Text>
       <Text> {totalMemo}</Text>
       <Button onClick={PutTotalMemoOnOpen} > 수정</Button>
       <PutTotalMemo isOpen={PutTotalMemoIsOpen} onClose={PutTotalMemoOnClose} subOnChange={subOnChange}/>
     </Box>
  )
}