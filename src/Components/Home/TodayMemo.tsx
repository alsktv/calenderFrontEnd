import { Modal, ModalContent , Text  , Button, useDisclosure, Box, VStack } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { APIGetUserMemo } from "../../api";
import { useEffect, useState } from "react";
import AddTodayMemo from "./AddTodayMemo";
import PutTodayMemo from "./PutTodayMemo";

interface IProp {
  isOpen:boolean
  onClose: () => void
}

interface IUserMemo {
  description: string,
  date:string,
  pk:number,
}


export default function FTodayMemo({isOpen,onClose}:IProp){
  ////////////////////////////////////////////////////////////////////////////
  //1. 프로그램에 필요한 변수들
  ////////////////////////////////////////////////////////////////////////////


  //1.1 ->  params값을 가져오는 것
  let { year , month , day ,userPk } = useParams();

  //1.2 ->  특정 날짜의 메모를 저장하는 변수 , 리스트의 길이는 반드시 1이다.
  const [todayMemo , setTodayMemo] = useState<IUserMemo[]>()


    ////////////////////////////////////////////////////////////////////////////
  //2. 모달창에 필요한 변수들
  ////////////////////////////////////////////////////////////////////////////



  //2.1 -> 메모추가 버튼 눌렀을 시 시행되는 모달창에 필요한 변수들
  const {isOpen:addMemoIsOpen , onClose:addMemoOnClose , onOpen:addMemoOnOpen} =useDisclosure()

    //2.2 -> 메모수정 버튼 눌렀을 시 시행되는 모달창에 필요한 변수들
    const {isOpen:putMemoIsOpen , onClose:putMemoOnClose , onOpen:putMemoOnOpen} =useDisclosure()

  ////////////////////////////////////////////////////////////////////////////
  //3. 프로그램에 필요한 함수들
  ////////////////////////////////////////////////////////////////////////////

// 3.1 -> 특정 날짜의 메모가 있는지를 확인하는 함수
  const IsTodaymemos = () => {
    if(todayMemo?.length !== 0){
      return true
    }else{
      return false
    }
  }

  //3.2 -> 메모를 수정시 수정사항이 바로 적용될 수 있게 상태를 바꾸는 함수.
  const subOnChange = () => {
    mutation.mutate(Number(userPk))
  }

  // 3 -> AddTodayMemo에 보낼 함수. 즉시 변경사항이 적용되게 만들어준다.
  const subOnClick = () => {
    mutation.mutate(Number(userPk))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement> , index:number) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      if(index === 0){
        putMemoOnOpen()
      }else{
        addMemoOnOpen()
      }
    }
  };

  
    ////////////////////////////////////////////////////////////////////////////
  //4.mutation변수들
  ////////////////////////////////////////////////////////////////////////////

  //4.1 -> 특정 날짜의 메모를 가져오는 mutation변수
  // padstart를 이용하여 자리수 고정 + 빈자리 특정 문자로 채우기 가능하다.
  const mutation = useMutation(APIGetUserMemo,{
    onSuccess:(data)=>{
      const userMemos: IUserMemo[] = data.data.dateUserMemos
      const newMemos = userMemos.filter(item =>item.date === `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}` )
      setTodayMemo(newMemos)
    }
  })

    ////////////////////////////////////////////////////////////////////////////
  //5.useEffect함수들
  ////////////////////////////////////////////////////////////////////////////
  
  //5.1 -> 처음 시작될 때 시행하는 함수.
  useEffect(()=>{
    mutation.mutate(Number(userPk))
  },[userPk,year,month,day])

  
  return(
    
    <Modal isOpen = {isOpen} onClose={onClose}>
      <ModalContent top={200}>
         <Text> {year } /  {month} / {day}  메모 </Text>
         {IsTodaymemos()
         ?
         <VStack onKeyDown={(event) => {handleKeyDown(event,0)}}>
         {todayMemo ? <Text>{todayMemo[0]?.description}</Text> :<Text></Text>}
         <Button w={"20%"} onClick={putMemoOnOpen}> 메모 수정</Button>
         <PutTodayMemo isOpen = {putMemoIsOpen} onClose={putMemoOnClose} subOnChange = {subOnChange}/>
         </VStack>
         :
         <Box onKeyDown={(event) => {handleKeyDown(event , 1)}}>
          <Button w={"20%"} onClick={addMemoOnOpen}> 메모 추가</Button> 
          <AddTodayMemo isOpen={addMemoIsOpen} onClose={addMemoOnClose} subOnClick = {subOnClick}/>
      
          
        </Box>
           
         }
         
      </ModalContent>
    </Modal>
  )
}