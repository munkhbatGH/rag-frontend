"use client"

import { Logo } from "@/components/icons";
import { useUserStore } from "@/store/userStore";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import React from "react";
import Cookies from 'js-cookie';
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";

const SimpleInput = React.forwardRef<HTMLInputElement, any>(({ type, name, placeholder, isRequired, errorMessage, className }, ref) => (
  <div className="relative">
    <input
      ref={ref}
      type={type}
      name={name}
      placeholder={placeholder}
      required={isRequired}
      className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
    />
  </div>
));
SimpleInput.displayName = 'SimpleInput';

export default function LoginPage() {
  const router = useRouter()
  const { setToken, setUsername } = useUserStore();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setErrorText("");
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST', body: JSON.stringify(data)
      }
      const res = await fetch('http://localhost:8000/login', options);
      if (res?.ok) {
        const response = await res.json();
        setToken(response.access_token);
        setUsername(response.username);
        Cookies.set(process.env.NEXT_PUBLIC_TOKEN || 'rag-token', response.access_token, { expires: 7 }); // 1 Day = 24 Hrs = 24*60*60 = 86400
        router.push("/admin");
      } else {
        // const error = await res.json();
        setErrorText("Login failed");
        addToast({
          title: "Login Failed",
          description: "Invalid username or password",
          color: "danger",
        });
      }
    } catch (error: any) {
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-10 w-auto text-center flex justify-center items-center">
          <Logo size={150}/>
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Системд тавтай морил</h2>
      </div>
        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              <Code color="primary" className="w-72">
                Хэрэглэгчийн нэр: user1 <br /><br />
                Нууц үг: 1234
              </Code>
            </span>
          </Snippet>
        </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        <form className="w-full space-y-6" onSubmit={onSubmit}>
          <SimpleInput 
            ref={usernameRef} 
            type="text" 
            name="username" 
            placeholder="Хэрэглэгчийн нэр" 
            className="w-full text-white" 
            isRequired 
            errorMessage="Please enter a valid username" 
          />
          <SimpleInput 
            ref={passwordRef} 
            type="password" 
            name="password" 
            placeholder="Нууц үг" 
            className="w-full text-white" 
            isRequired 
            errorMessage="Please enter a valid password" 
          />

          {errorText && (
            <p className="text-red-500 text-sm">{errorText}</p>
          )}
          
          <Button
            className="bg-linear-to-tr from-pink-500 to-yellow-500 shadow-lg flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            radius="full"
            type="submit"
          >
            Нэвтрэх
          </Button>
        </form>

      </div>
    </div>
  );
}
