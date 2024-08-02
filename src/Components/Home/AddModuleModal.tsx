import {  Box, Button, HStack, Modal, ModalContent , Text, useDisclosure, VStack  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { APIDeleteScheduleModule, APIGetSchedule, APIGetScheduleModule } from "../../api";
import FAddScheduleByModule from "./AddScheduleByModuleModal";
import FAddModuleModal from "./AddModule";

interface IProp {
  isOpen:boolean
  onClose: () => void
}

interface IModule {
  pk:number
  description:string
}




  

export default function FCalenderAddModal({isOpen,onClose}:IProp){

    /////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수들 저장
  /////////////////////////////////////////////////////////////////////////////
  

  //1.1 -> 특정 유저의 일정 모듈의 정보를 저장하는 변수
  const [module, setModule] = useState<IModule[]>([])

  //1.2 -> params값 저장하기
  const {year, month , day , userPk} = useParams()

  //1.3 -> 모달창에 보낼 description을 저장하는 변수
  const [Itemdescription,setItemDescription] = useState("")

  const [status, setStatus] = useState("")



  /////////////////////////////////////////////////////////////////////////////
  //2.뮤테이션 변수들
  /////////////////////////////////////////////////////////////////////////////
  

  //2.1 -> 일정모듈을 get요청을 통해 가져오는 함수
  const getModuleMutation = useMutation(APIGetScheduleModule,{
    onSuccess:(data) => {
      setModule(data.data.scheduleModules)
    }
  })

  //2.2 -> 스케쥴을 가져오는 뮤테이션 함수
  const getScheduleMutation = useMutation(APIGetSchedule,{
    onSuccess:(data) => {
      
    }
  })

  //2.3 -> 스케쥴 모델을 삭제하는 뮤테이션 함수
  const deleteScheduleModule = useMutation(APIDeleteScheduleModule,{
   onSuccess:(data) => {
    if(data.data.deleteScheduleModule.status === "ok"){
       getModuleMutation.mutate(Number(userPk))
    }
   }
  })


  ////////////////////////////////////////////////////////////////////////////////
  // 프로그램에 필요한 함수들
  ///////////////////////////////////////////////////////////////////////////////

  //모달창 컴포넌트에 보낼때 사용하는 함수. 이것으로 인해 변경된 값을 즉시 화면에 나타낼 수 있음
  const subonClickButton = () => {
    getScheduleMutation.mutate(Number(userPk))
  }

  const subonClickAddButton = () => {
    getModuleMutation.mutate(Number(userPk))
  }

  // keydown을 위한 함수
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      addonOpen()
    }
  };




  ///////////////////////////////////////////////////////////////////////////
  //3.이벤트 핸들러 함수들
  ///////////////////////////////////////////////////////////////////////////


  //3.1 ->  모델을 나타내는 모달창에서 +버튼 누를 시 동작하는 함수
  const onClickAddButton = (index:number, description:string) => {
   plusonOpen()
   setItemDescription(description)
  }

    //3.2 ->  모델을 나타내는 모달창에서 X버튼 누를 시 동작하는 함수
    const onClickDeleteButton = (pk:number) => {
      deleteScheduleModule.mutate(pk)
     }




  /////////////////////////////////////////////////////////////////////////////
  //4.모달창을 다루기 위한 변수
  ////////////////////////////////////////////////////////////////////////////

  //4.1 -> +버튼 눌렀을 때 나오는 모달창을 다루는 변수
  const {isOpen:plusIsOpen , onOpen:plusonOpen , onClose:plusonClose} = useDisclosure()

  //
  const {isOpen:addIsOpen , onOpen:addonOpen , onClose:addonClose} = useDisclosure()



    ///////////////////////////////////////////////////////////////////////////
  //5.useEffect 함수들
  ///////////////////////////////////////////////////////////////////////////
  useEffect(()=>{
    getModuleMutation.mutate(Number(userPk))
  },[year,month,day,userPk])


  return(
    
    <Modal isOpen = {isOpen} onClose={onClose}>
      <ModalContent left={200} onKeyDown={handleKeyDown}>
        <VStack align="stretch" spacing={4} >
          {module ?   module?.map((item:IModule,index)=>(
          <Box key={item.pk} textAlign={"center"} display={"flex"}>
            <HStack justify="space-between" w={"60%"} alignItems={"center"}>
              <Button onClick={() => {onClickDeleteButton(item.pk)}}>X</Button>
              <Text>{item.description}</Text>
              <Button onClick={()=>{onClickAddButton(index , item.description)}}>+</Button>
              <FAddScheduleByModule isOpen={plusIsOpen} onClose={plusonClose} description = {Itemdescription} onClickButton={subonClickButton}/>
            </HStack>
          </Box>
         )): null}
   
        </VStack>
         <Button onClick={addonOpen}>모듈 추가</Button>
         <FAddModuleModal isOpen={addIsOpen} onClose={addonClose} onClickButton={subonClickAddButton}/>
      </ModalContent>
    </Modal>
  )
}