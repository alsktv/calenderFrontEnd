import {Box, Button, HStack, useDisclosure} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import FCalenderDelayModal from './CalenderDelayModal';
import FCalenderAddModal from './AddModuleModal';

export default function FTopBar() {

  const {userPk} = useParams()
 //url이동을 위해 만든 변수
  const navigate = useNavigate()
  //현재 시간 가져오는 변수
  const date = new Date()
  //모달창을 다루기 위한 변수들
  const {isOpen:delayIsOpen , onClose:delayOnClose , onOpen:delayOnOpen} = useDisclosure()
  const {isOpen:addIsOpen , onClose:addOnClose , onOpen:addOnOpen} = useDisclosure()

  // 변수 이름은 소문자로, 함수 이름은 대문자로, export함수는 앞에 F붙인 뒤 대문자로 , 날짜를 클릭 시 그 날짜의 url로 이동하게 해주는 함수
  const OnClickToday = () =>{
   navigate(`/${userPk}/${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()}`)
  }

  return(
   <Box>
     <HStack>
       <Button onClick={OnClickToday}> 오늘 일정 </Button>
       <Button onClick={delayOnOpen}> 미룬 일정</Button>
       <FCalenderDelayModal isOpen={delayIsOpen} onClose={delayOnClose}/>
       <Button onClick={addOnOpen}> + </Button>
       <FCalenderAddModal  isOpen={addIsOpen} onClose={addOnClose} />
     </HStack>
   </Box>
  )
}