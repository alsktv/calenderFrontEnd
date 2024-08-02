import {  Button, Input, Modal, ModalContent , Text, VStack  } from "@chakra-ui/react";
import { useState , useRef} from "react";
import {  useMutation} from "react-query";
import { APIPostSchedule } from "../../api";
import { useParams } from "react-router-dom";

interface IMySchedule {
  pk: number , 
  description: string,
  date: Date,
  isChecked: boolean,
}

interface IProp {
  isOpen:boolean
  onClose: () => void
  onClickButton : (data:IMySchedule[]) => void
}

export default function FAddScheduleModal({isOpen,onClose,onClickButton}:IProp) {

  const {year,month,day } = useParams()


  const mutation = useMutation(APIPostSchedule,{
    onSuccess:(data)=>{
      onClickButton(data)
    }
  })

  //유저에게 입력받는 값을 저장하기 위해 만든 변수들
  const [description , setDescription] = useState<string>() 
  const [hours , setHours] = useState<string>()
  const [minutes , setMinutes] = useState<string>()

  
  //onChange를 처리하기 위해 만든 함수들
  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }
  const onChangeHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setHours(event.target.value);
  }
  const onChangeMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(event.target.value);
  }

   //사용자가 입력버튼을 눌렀을 시 작동하는 함수
  const onClickInputButton = () => {
    if(description && hours && minutes ){
      if(typeof description === "string" && typeof Number(hours) === "number" && typeof Number(minutes) === "number" ){
        if(Number(hours) < 24 && Number(hours) >= 0 && Number(minutes) < 60 && Number(minutes) >= 0){
          mutation.mutate({"description" : description , "date":`${year}-${month}-${day}T${hours}:${minutes}:00+09:00`})
        }
      }

    }
    
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      onClickInputButton()
    } else if(event.key === "ArrowUp") {   // 업버튼을 눌렀을 시 작동됨
      event.preventDefault()
      const setIndex = index === 0 ? 0 : index -1 
      inputRefs.current[setIndex]?.focus()
    } else if(event.key === "ArrowDown") {   // 업버튼을 눌렀을 시 작동됨
      event.preventDefault()
      const setIndex = index === 2 ? 2 : index + 1 
      inputRefs.current[setIndex]?.focus()
    }
  };

  //인풋창을 만드는대 필요한 리스트
  const itemText = [{text:"내용" , function:onChangeDescription , value: description},{text:"시" , function:onChangeHours ,  value: hours},{text:"분" , function:  onChangeMinutes , value:minutes }]

  const inputRefs = useRef<HTMLInputElement[]>([]);

  return (
  <Modal isOpen = {isOpen} onClose={onClose}>
    <ModalContent left={200} >
       <VStack>
        {itemText.map((item , index) => (
  <Text>{item.text}:
  <Input placeholder={item.text}
         value={item.value}
        onChange={item.function} 
        ref={(el) => {if(el){
    (inputRefs.current[index] = el)
  }}} 
  onKeyDown={(event) => {handleKeyDown(event,index)}}></Input></Text>
        ))}
         <Button onClick={onClickInputButton}>입력</Button>
       </VStack>
    </ModalContent>
  </Modal>
  );
}