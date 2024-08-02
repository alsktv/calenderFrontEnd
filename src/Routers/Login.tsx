import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { APIJwtLogin } from "../api";
import { useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


export default function Login(){
 // input 안에 값을 가져오기 위해 만든 useState값
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()

  const [userPk , setUserPk] = useState<string>()

  //input안의 값을 바꾸기 위한 onChange함수들
   const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername (event.target.value)
   }
   const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword (event.target.value)
   }

   const navigation = useNavigate()

   interface IDecode{
    pk:string
   }

   //mutation함수 정의
  const mutation = useMutation(APIJwtLogin,{
    onSuccess: (data) => {
      try{
        const decode = jwtDecode<IDecode>(data.token)   // jwtDecode에도 type이 필요하구나
        const pk = decode["pk"]
        localStorage.setItem("jwt" , data.token)
        navigation(`/${pk}`)
        //console.log(decode)
        }catch(error){
          console.log(error)
        }
        
        
      }
    }
  )

  //로그인 버튼 눌렀을 시 작동하는 함수
  const onClickButton = () => {
    if(username && password){
      mutation.mutate({username:username , password:password})
    } else{
      console.log("Didn't username or password.")
    }
     
  }


  //keydown에 관한 함수들
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement> , index:number) => {
    
    if(event.key === "Enter"){
      event.preventDefault()
      onClickButton()
    }else if(event.key === "ArrowUp"){
      console.log("work")
      const newIndex = index === 0 ?1 : 0
      inputRefs.current[newIndex].focus()
    }else if(event.key === "ArrowDown"){
      const newIndex = index === 1 ?0 : 1
      inputRefs.current[newIndex].focus()
    }
  }

  //useRef변수들

  const inputRefs = useRef<HTMLInputElement[]>([]);
  


  //Input에 들어가는 정보를 저장한 리스트
  const itemList = [{text:"username" , value:username , function:onChangeUsername},{text:"password" , value:password , function:onChangePassword}]


  return (
     <Box w={"30%"}>
      <VStack>
      {itemList.map((item , index) => (
        <Input placeholder={item.text}
         required value={item.value} 
         onChange={item.function} 
         onKeyDown={(event) => {handleKeyDown(event,index)}} 
         ref={(el) => {if(el){
          (inputRefs.current[index] = el)
        }}} ></Input>
      ))}
        <Button  onClick={onClickButton}> 로그인 </Button>
      </VStack>
     </Box>
  )
}