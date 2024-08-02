import { Box, Button, Input, Modal, ModalContent, Text, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { APIPostUserMemo, APIPutUserMemo } from "../../api";

interface IProp {
  isOpen:boolean
  onClose: () => void
  subOnClick : () => void
}


export default function AddTodayMemo ({isOpen , onClose ,subOnClick }:IProp) {
  /////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수들 저장
  /////////////////////////////////////////////////////////////////////////////
  

  //1.1 -> 사용자가 메모를 추가하기 위해 적은 값을 저장하는 변수
  const [writeMemo , setWriteMemo] = useState<string>()

  //1.2 -> params값 저장하기
  const {year, month , day , userPk} = useParams()



    /////////////////////////////////////////////////////////////////////////////
  //프로그램에 필요한 함수들 저장
  /////////////////////////////////////////////////////////////////////////////


  //1. keydown을 다루는 함수 만들기
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      onClickAddButton();
    }
  };



  /////////////////////////////////////////////////////////////////////////////
  //2.뮤테이션 변수들
  /////////////////////////////////////////////////////////////////////////////

   const PostTodayMemoMutation = useMutation(APIPostUserMemo,{
    onSuccess:(date)=>{    
      onClose()
      subOnClick()
    }
   })



  ///////////////////////////////////////////////////////////////////////////
  //3.이벤트 핸들러 함수들
  ///////////////////////////////////////////////////////////////////////////

  //3.1 -> 메모 내용을 입력하는 Input에서 사용하는 onChange함수
  const onChangeMemo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
   setWriteMemo(event.target.value)
  }

  //2.2 -> 메모내용을 최종적으로 추가하고 싶을 때 누르면 put요청 처리됨.
  const onClickAddButton = () =>{
    if(writeMemo){
      PostTodayMemoMutation.mutate({pk:Number(userPk) , description: writeMemo , date:`${year}-${month}-${day}`})
    } else{
      alert("you didn't write memo")
    }
 
  }

  
  return(
    <Modal isOpen = {isOpen} onClose={onClose}>
      <ModalContent left={200}>
        <VStack onKeyDown={handleKeyDown}>
          <Text>{year}/{month}/{day}</Text>
          <Text>메모:<Textarea value={writeMemo} placeholder="메모를 입력해주세요" onChange={onChangeMemo}/></Text>
          <Button onClick={onClickAddButton} > 추가</Button>
        </VStack>

        
      </ModalContent>
  </Modal>
  )
}