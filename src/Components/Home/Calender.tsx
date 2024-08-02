import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function FCalendar() {


  const [value, onChange] = useState<Value>(new Date());
  const [ selectData , setSelectData] = useState<Date>()
  const navigate = useNavigate()


  const onClickDay = (date:Date) =>{
    setSelectData(date)
    navigate(`${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()}`)
  }

  return (
    <div>
      <Calendar onChange={onChange} value={value}  onClickDay={onClickDay}/>
    </div>
  );
}