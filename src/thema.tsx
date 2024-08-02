import {extendTheme , type ThemeConfig} from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode:false,
}

const theme  = extendTheme({config}) //extendTheme에는 config를 속성으로 가지는 object를 반환해주어야 한다.

export default theme