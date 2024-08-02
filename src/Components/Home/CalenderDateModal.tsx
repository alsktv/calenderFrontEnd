import {  useParams } from 'react-router-dom';
import { useMutation } from "react-query";
import { useEffect, useState } from "react";

import {  Box, Button, Checkbox, HStack, Text, VStack, useDisclosure  } from "@chakra-ui/react";

import FAddScheduleModal from "./AddScheduleModal";
import FTodayMemo from "./TodayMemo";
import { APIGetSchedule , APIDeleteSchedule , APIPutScheduleIschecked } from "../../api";

//가져오는 스케쥴 1개의 type임
interface IMySchedule {
  pk: number , 
  description: string,
  date: Date,
  isChecked: boolean,
}

export default function FCalenderDateModal(){

  //////////////////////////////////////////////////////////////////////////////
  //1.프로그램에 필요한 변수 정의
  ///////////////////////////////////////////////////////////////////////////////


  //1.1-> url의 params값 가져옴
  let { year , month , day , userPk } = useParams();

  //1.2-> 가져온 스케쥴들을 저장하는 변수
  const [schedules , setSchedules] = useState<IMySchedule[]>()

  //1.3-> checkbox를 제에하기 위해 필요한 리스트. 불리안 값을 가진 리스트를 저장한다. 백엔드에서is_checked값 정보 가져와서 저장한다.
  const [isChecked, setIsChecked] = useState(new Array(schedules?.length).fill(false));

  //1.4-> 월요일, 화요일 등의 요일을 저장하는 변수
  const [dayOfWeek, setDayOfWeek] = useState('');

  //1.5 -> 요일 리스트
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];




  ///////////////////////////////////////////////////////////////////////////////
  //2.모달창을 위한 변수들
  ///////////////////////////////////////////////////////////////////////////////



  //2.1-> 메모장 모달창을 다루기 위해 만든 변수, 컴포넌트에 전달하는대 사용
  const {isOpen:memoIsOpen , onClose:memoOnClose , onOpen:memoOnOpen} =useDisclosure()

  //2.2-> 일정추가 모달창을 다루기 위해 만든 변수, 컴포넌트에 전달하는대 사용
  const {isOpen:scheduleIsOpen , onClose:scheduleOnClose ,onOpen:scheduleOnOpen} = useDisclosure()



  ///////////////////////////////////////////////////////////////////////////////
  //3.프로그램에 필요한 함수들
  ///////////////////////////////////////////////////////////////////////////////



  //3.1-> Date type의 값을 화면에 나타내는 값으로 바꿔주는 함수(Date type의 값을 22:30같이 읽을 수 있는 시간으로 바꿈)
  const formatDate = (dateString:Date) => {
    const date = new Date(dateString);
    const hour = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minutes}`
 };

  //3.2-> schedules를 이용하여 isChecked리스트를 만들어 내는 함수. mutation의 콜백 함수에서 사용함.
  const makeCheckedList = (scheduleData:IMySchedule[]) =>{
    const list:boolean[] = []
    //is_checked값을 list변수에 집어넣는 문장
    for(let i=0 ; i<scheduleData.length ; i++){
      list.push(scheduleData[i]?.isChecked)
    }
    //리스트에 집어넣음으로써 체크박스에 반영되게 만듬.
    setIsChecked(list)
  }

  //3.3 -> 날짜를 바탕으로 요일을 가져오는 함수.
  const decideDate = () => {
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const dayIndex = date.getDay();
    setDayOfWeek(daysOfWeek[dayIndex]);
  };

    //3.4-> 일정을 바로 업데이트하기 위해 자식 컴포넌트에게 보내는 함수.
    const subOnClickButton = (data:IMySchedule[]) => {
      scheduleOnClose()
      mutation.mutate(Number(userPk))  //put처리된 값을 새롭개 가져오기 위해서 mutation실행해줌.
    } 

    //5 -> post 요청이 발생했을 시 시행되는 함수. post된 값을 즉시 반영하기 위해 사용한다.
    const handlePostSchedule = () => {
      console.log("work")
      mutation.mutate(Number(userPk)) 
    }
  


  /////////////////////////////////////////////////////////////////////////////////
  //4.뮤테이션 함수들
  /////////////////////////////////////////////////////////////////////////////////



  //4.1-> 스케쥴들을 가져오기 위한 mutation
  const mutation = useMutation(APIGetSchedule , {
    onSuccess: (data) =>{
      //유저가 선택 한 날짜의 일정만 가져오게 만듬
          const dateSchedule = data.data.user.mySchedule.filter(
            (item:IMySchedule) =>{
              const itemDate = new Date(item.date)
              return (
                       itemDate.getDate() === Number(day)
                &&   itemDate.getMonth() + 1 === Number(month)
           &&  itemDate.getFullYear() === Number(year)
              )
            } 
          )
         //시간순으로 리스트 정렬
          dateSchedule.sort((a:IMySchedule,b:IMySchedule)=>{
            const dateA = new Date(a.date);  
            const dateB = new Date(b.date);
          //23:48을 2348로 바꾸는 식으로 시간을 숫자로 바꾸어 비교함
            const timeA = dateA.getHours() * 100 + dateA.getMinutes();
            const timeB = dateB.getHours() * 100 + dateB.getMinutes();

            return timeA - timeB    
          })
              //dateSchedules에 가져온 값을 넣어서 저장. 그리고 리랜더링 실행.
       setSchedules(dateSchedule);
       //38줄에 있는 함수임, 체크리스트에 필요한 불리안 리스트를 저장함.
      makeCheckedList(dateSchedule) ;
            }
      }
  )

  //4.2-> 체크박스를 눌렀을 시 put요청을 보내기 위한 mutation
  const putIsCheckedMutation = useMutation(APIPutScheduleIschecked,{
    onSuccess:()=>{
      mutation.mutate(Number(userPk)) 
    }
  })

  //4.3-> X를 눌렀을 시 delete요청을 보내기 위한 mutation
  const deleteMutation = useMutation(APIDeleteSchedule,{
    onSuccess:(data)=>{
        mutation.mutate(Number(userPk)) //delete된 뒤 값을 최신화 하기 위해 적어줌
    }
  })



  ///////////////////////////////////////////////////////////////////////////////
  //5.이벤트 핸들러에 사용하는 함수
  ///////////////////////////////////////////////////////////////////////////////



  //5.1-> checkbox값이 바꿨을 때 실행되는 함수
  const onChangeCheckbox = (index:number,pk:number) => {
    //react useState값을 바꿀때는 ...(spread) 연산자를 이용하여 값을 복사한 뒤 바꾸어 줘야함. 그냥 원본을 바꾸면 랜더링이 되지 않음
    putIsCheckedMutation.mutate(pk)
    const newCheckedItems = [...isChecked]
    newCheckedItems[index] = !newCheckedItems[index];
    setIsChecked(newCheckedItems);
  };




  //5.3->  삭제 버튼 눌렀을 시 작동하는 함수. 백앤드에 delete요청을 보낸다.
  const onClickDelete = (pk:number)  => {
  deleteMutation.mutate(pk)
  }



  ///////////////////////////////////////////////////////////////////////////////
  //6.useEffect 함수들
  ///////////////////////////////////////////////////////////////////////////////



  //6.1-> url의 값이 바뀔때마다 날짜에 맞는 일정을 가져오기 위해 뮤테이션 실행함
  useEffect(()=>{
  mutation.mutate(Number(userPk))
  decideDate()
    },[year,month,day])



  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////  

  return(
     <Box maxW='sm' borderWidth='3px' borderRadius='lg' overflow='hidden' w={250}>

          <VStack align="start">
            <Text> {year } /  {month} / {day} ({dayOfWeek})  </Text>

            {schedules ?
             schedules.map((item,index)=>(
              <HStack>
                {/* onChange에 인수 넣어줄려면 익명함수 사용하기 */}
                <Checkbox isChecked={isChecked[index]} 
                 onChange={()=>{
                  onChangeCheckbox(index,item?.pk)
                }}/>
                <Text> {item.description}</Text>
                <Text color={"red"}> 시간: {formatDate(item.date)}</Text>
                <Button w={"3%"} rounded={"50%"} onClick={()=>{
                  onClickDelete(item?.pk)
                }}>X</Button>
              </HStack>
   
             ))  
             : <Text>일정이 없습니다.</Text>
            }
            <Button onClick={scheduleOnOpen}> 일정 추가 </Button>
            <FAddScheduleModal isOpen={scheduleIsOpen} onClose={scheduleOnClose} onClickButton = {subOnClickButton}/>
            <Button onClick={memoOnOpen}> 메모장 열기 </Button>
            <FTodayMemo isOpen={memoIsOpen} onClose={memoOnClose}/>
          </VStack>
     </Box>
  )
}