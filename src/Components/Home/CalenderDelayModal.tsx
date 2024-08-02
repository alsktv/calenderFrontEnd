import { Box, Button, Modal, ModalContent  , Text, HStack  } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { APIDeleteDelaySchedule, APIGetDelaySchedules } from "../../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IProp {
  isOpen:boolean
  onClose: () => void
}

interface ISchedule {
  pk:number
  description: string
  date: string
}

export default function FCalenderDelayModal({isOpen,onClose}:IProp){

  //////////////////////////////////////////////////////////////////////////////
  //프로그램에 필요한 변수들
  ////////////////////////////////////////////////////////////////////////////
  

  const {userPk} = useParams()
  
  //delaySchedule을 저장하는 변수
  const [delaySchedule , setDelaySchedule] = useState<ISchedule[]>()

  ///////////////////////////////////////////////////////////////////////////////
  //프로그램에 필요한 함수들
  ///////////////////////////////////////////////////////////////////////////


  //1 -> Date 타입의 값을 문자열로 바꾸는 함수
  const formatDate = (dateString:Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear()
    const month= date.getMonth()
    const day = date.getDay()
    const hour = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day}   /   ${hour}:${minutes}`
 };

  ///////////////////////////////////////////////////////////////////////////////
  //이벤트 핸들러 함수
  ///////////////////////////////////////////////////////////////////////////

//1 -> 삭제버튼을 눌렀을 시 작동하는 함수
 const onClickDeleteButton = (pk:number) =>{
  deleteMutation.mutate(pk)
 }

  //////////////////////////////////////////////////////////////////////////////
  //뮤테이션 함수들
  ////////////////////////////////////////////////////////////////////////////

  //1 -> delaySchedule을 가져오는 뮤테이션 함수
  const getMutation = useMutation(APIGetDelaySchedules,{
    onSuccess:(data) => {
      setDelaySchedule(data.data.delaySchedules)

    }
  })

    //2 -> delaySchedule을 삭제하는 뮤테이션 함수
    const deleteMutation = useMutation(APIDeleteDelaySchedule,{
      onSuccess:(data) => {
          getMutation.mutate(Number(userPk))
          console.log("work")
      }
    })


    //////////////////////////////////////////////////////////////////////////////
  //useEffect함수들
  ////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    getMutation.mutate(Number(userPk))
  },[])

  return(
    
    <Modal isOpen = {isOpen} onClose={onClose}>
      <ModalContent left={200}>
         {delaySchedule ? delaySchedule.map((item)=>(
          <Box>
            <HStack>
             <Button onClick = {() => {onClickDeleteButton(item.pk)}}>X</Button>
             <Text> {item.description} / {formatDate(new Date(item.date))}</Text>
           </HStack>
          </Box>
    
         )) : <Text> 밀린 일정이 없습니다.</Text>}
      </ModalContent>
    </Modal>
  )
}