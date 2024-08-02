import { Box, Button, Input, Modal, ModalContent, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import {  APIPutUserMemo ,APIGetUserMemo } from "../../api";

interface IProp {
  isOpen:boolean
  onClose: () => void
  subOnChange: () => void
}

interface IUserMemo {
  description: string,
  date:string,
  pk:number,
}


export default function PutTodayMemo ({isOpen , onClose , subOnChange }:IProp) {
  /////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수들 저장
  /////////////////////////////////////////////////////////////////////////////
  

  //1.1 -> 사용자가 메모를 추가하기 위해 적은 값을 저장하는 변수
  const [writeMemo , setWriteMemo] = useState<IUserMemo[]>()

  //1.2 -> params값 저장하기
  const {year, month , day , userPk} = useParams()



    /////////////////////////////////////////////////////////////////////////////
  //프로그램에 필요한 함수들 저장
  /////////////////////////////////////////////////////////////////////////////


   //1. keydown에 필요한 함수
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
   const PutTodayMemoMutation = useMutation(APIPutUserMemo,{
    onSuccess:()=>{
      onClose()
      subOnChange()
    }
   })

     //2.1 -> put요청 처리하는 뮤테이션 변수
     const mutation = useMutation(APIGetUserMemo,{
      onSuccess:(data)=>{
        const userMemos: IUserMemo[] = data.data.dateUserMemos
        const newMemos = userMemos.filter(item =>item.date === `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}` )
        setWriteMemo(newMemos)
      }
    })



  ///////////////////////////////////////////////////////////////////////////
  //3.이벤트 핸들러 함수들
  ///////////////////////////////////////////////////////////////////////////

  //3.1 -> 메모 내용을 입력하는 Input에서 사용하는 onChange함수
  const onChangeMemo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(writeMemo){
      const memo = [writeMemo[0]]
      memo[0].description = event.target.value
      setWriteMemo(memo)
    }
  }

  //2.2 -> 메모내용을 최종적으로 추가하고 싶을 때 누르면 put요청 처리됨.
  const onClickPutButton = () =>{
    if(writeMemo){
      PutTodayMemoMutation.mutate({pk:Number(userPk) , description: writeMemo[0].description, date:String(writeMemo[0].date)})
      
    } else{
      alert("you didn't write memo")
    }
    
  }


  //////////////////////////////////////////////////////////////////////////////

  useEffect(()=>{
    mutation.mutate(Number(userPk))
  },[])

  
  return(
    <Modal isOpen = {isOpen} onClose={onClose}>
      <ModalContent left={200}>
        <VStack onKeyDown={handleKeyDown}>
          <Text>{year}/{month}/{day}</Text>
          {writeMemo ?      <Text>메모:<Textarea value={writeMemo[0].description} onChange={onChangeMemo}/></Text> :null}
          <Button onClick={onClickPutButton}> 입력</Button>
        </VStack>

        
      </ModalContent>
  </Modal>
  )
}