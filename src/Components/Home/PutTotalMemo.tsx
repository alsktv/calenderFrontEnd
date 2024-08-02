import { Box, Button, Input, Modal, ModalContent, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import {  APIPutUserMemo ,APIGetUserMemo, APIPutTotalMemo, APIGetTotalMemo } from "../../api";

interface IProp {
  isOpen:boolean
  onClose: () => void
  subOnChange: () => void
}

interface ITotalMemo {
  description: string,
  pk:number,
}


export default function PutTotalMemo ({isOpen , onClose , subOnChange }:IProp) {
  /////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수들 저장
  /////////////////////////////////////////////////////////////////////////////
  

  //1.1 -> 사용자가 메모를 추가하기 위해 적은 값을 저장하는 변수
  const [writeMemo , setWriteMemo] = useState<ITotalMemo>()

  //1.2 -> params값 저장하기
  const {year, month , day , userPk} = useParams()



    /////////////////////////////////////////////////////////////////////////////
  //프로그램에 필요한 함수들 저장
  /////////////////////////////////////////////////////////////////////////////

  //1. 엔터키를 눌렀을 때 입력될 수 있게 만드는 함수. keydown에 등록하기 위해 만든 함수
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      onClickPutButton();
    }
  };


  /////////////////////////////////////////////////////////////////////////////
  //2.뮤테이션 변수들
  /////////////////////////////////////////////////////////////////////////////
   

  //2.1 -> put요청 처리하는 뮤테이션 변수
   const PutTotalMemoMutation = useMutation(APIPutTotalMemo,{
    onSuccess:()=>{
      onClose()
      subOnChange()
    }
   })

     //2.1 -> put요청 처리하는 뮤테이션 변수
     const mutation = useMutation(APIGetTotalMemo,{
      onSuccess:(data)=>{
        const totalMemo: ITotalMemo = data.data.totalMemo
        setWriteMemo(totalMemo)
      }
    })



  ///////////////////////////////////////////////////////////////////////////
  //3.이벤트 핸들러 함수들
  ///////////////////////////////////////////////////////////////////////////

  //3.1 -> 메모 내용을 입력하는 Input에서 사용하는 onChange함수
  const onChangeMemo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(writeMemo){
      const memo = {...writeMemo}
      memo.description = event.target.value
      setWriteMemo(memo)
    }
  }

  //2.2 -> 메모내용을 최종적으로 추가하고 싶을 때 누르면 put요청 처리됨.
  const onClickPutButton = () =>{
    if(writeMemo){
      PutTotalMemoMutation.mutate({pk:Number(userPk) , description: writeMemo.description})
      
    } else{
      alert("you didn't write memo")
    }
    
  }


  //////////////////////////////////////////////////////////////////////////////

  useEffect(()=>{
    mutation.mutate(Number(userPk))
  },[])

  
  return(
    <Modal isOpen = {isOpen} onClose={onClose} >
      <ModalContent left={200} onKeyDown={handleKeyDown}>
        <VStack>
          {writeMemo ?      <Text>전체메모:<Textarea value={writeMemo.description} onChange={onChangeMemo}/></Text> :null}
          <Button onClick={onClickPutButton}> 입력</Button>
        </VStack>

        
      </ModalContent>
  </Modal>
  )
}