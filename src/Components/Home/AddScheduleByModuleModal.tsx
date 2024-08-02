import {  Button, Input, Modal, ModalContent , Text, VStack  } from "@chakra-ui/react";
import { useRef, useState } from "react";
import {   useMutation } from "react-query";
import { APIPostSchedule } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

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
  description:string
}

export default function FAddScheduleByModule({isOpen,onClose,onClickButton,description}:IProp) {



  ///////////////////////////////////////////////////////////////////////////////////프로그램에 필요한 함수
  ////////////////////////////////////////////////////////////////////////////////


  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      //기본동작인 줄바꿈 동작을 막아주어야 함.
      event.preventDefault()
      onClickInputButton()
    } else if(event.key === "ArrowUp") {   // 업버튼을 눌렀을 시 작동됨
      event.preventDefault()
      console.log(inputRefs)
      const setIndex = 0
      inputRefs.current[setIndex]?.focus()
    } else if(event.key === "ArrowDown") {   // 업버튼을 눌렀을 시 작동됨
      event.preventDefault()
      const setIndex = 1
      inputRefs.current[setIndex]?.focus()
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////프로그램에 필요한 뮤테이션 함수
  ////////////////////////////////////////////////////////////////////////////////

  //1 -> 스케쥴을 추가하는 뮤테이션 함수
  const mutation = useMutation(APIPostSchedule,{
    onSuccess:(data)=>{
      onClickButton(data)
      onClose()
    }
  })

    ///////////////////////////////////////////////////////////////////////////////////프로그램에 필요한 변수
  ////////////////////////////////////////////////////////////////////////////////

  //1 -> params값들
  const {year,month,day,userPk } = useParams()

  
  //2 -> 유저에게 입력받는 값을 저장하기 위해 만든 변수들
  const [hours , setHours] = useState<string>()
  const [minutes , setMinutes] = useState<string>()

  //3 -> inputrefs변수. 키 조작할 때 필요한 변수임
  const inputRefs = useRef<HTMLInputElement[]>([]);

  //4 -> 
  const navigation = useNavigate()

 
  ///////////////////////////////////////////////////////////////////////////////////이벤트 핸들러 함수
  ////////////////////////////////////////////////////////////////////////////////


  //1 -> hours 값을 실시간으로 바꾸기 위해 만든 함수들
  const onChangeHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setHours(event.target.value);
  }

  //2 ->  minutes 값을 실시간으로 바꾸기 위해 만든 함수들
  const onChangeMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(event.target.value);
  }

  
   //3 -> 사용자가 입력버튼을 눌렀을 시 작동하는 함수
  const onClickInputButton = () => {
    if( hours && minutes ){
      if( typeof Number(hours) === "number" && typeof Number(minutes) === "number" ){
        if(Number(hours) < 24 && Number(hours) >= 0 && Number(minutes) < 60 && Number(minutes) >= 0){
       
          mutation.mutate({"description" : description , "date":`${year}-${month}-${day}T${hours}:${minutes}:00+09:00`})
        }
      }

    }
    
  }

    //(변수)4 ->  인풋창을 구성하는 요소를 딕셔너리로 만든 변수임
    const InputList = [{text:"시" , placeholder : "시 입력" , value: hours , onChange: onChangeHours} , {text:"분" , placeholder : "분 입력" , value: minutes , onChange: onChangeMinutes}]




  return (
  <Modal isOpen = {isOpen} onClose={onClose}>
    <ModalContent left={200}>
       <VStack>
        {InputList.map((item,index) => (
   <Text>{item.text}:
    <Input 
        onKeyDown={(event) => {handleKeyDown(event,index)}} 
        ref={(el) => {if(el) {(inputRefs.current[index] = el)}}} 
        placeholder={item.placeholder} 
        value={item.value}
        onChange={item.onChange}>
      </Input>
    </Text>
        ))}
         <Button onClick={onClickInputButton}>입력</Button>
       </VStack>
    </ModalContent>
  </Modal>
  );
}