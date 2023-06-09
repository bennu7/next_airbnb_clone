"use client"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import Button from '../Button'
import useLoginModal from '@/hooks/useLoginModel'
import useRegisterModal from '@/hooks/useRegisterModal'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'

const LoginModal = () => {
    const router = useRouter()
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsloading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsloading(true);
        console.log("data LoginModal => ", data);

        signIn("credentials", {
            ...data,
            redirect: false,
        }).then((callback) => {
            console.log("callback LoginModal => ", callback);
            setIsloading(false);
            if (callback?.ok) {
                toast.success("Login success");
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        }).catch((err) => {
            console.log("err LoginModal => ", err);
            toast.error("oops failed to login");
        }).finally(() => {
            setIsloading(false);
        });
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title='Welcome to Airbnb'
                subtitle='Login to your account!'
            />
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id='password'
                label='Password'
                type='password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button
                outline
                icon={FcGoogle}
                label='Continue with Google'
                onClick={() => signIn("google")}
            />
            <Button
                outline
                icon={AiFillGithub}
                label='Continue with Github'
                onClick={() => signIn("github")}
            />
            <div
                className='mt-4 font-light text-center text-neutral-500'
            >
                <div className='flex flex-row items-center justify-center gap-2'>
                    <div>First time using Airbnb?</div>
                    <div
                        onClick={toggle}
                        className='cursor-pointer text-neutral-800 hover:underline'
                    >Create an account</div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title='Login'
            actionLabel='Continue'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal