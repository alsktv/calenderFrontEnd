import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router'
import theme from './thema';
import {QueryClient , QueryClientProvider} from "react-query"

const client = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={client}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);