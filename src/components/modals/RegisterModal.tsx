"use client"
import axios from 'axios'
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import useRegisterModal from '@/hooks/useRegisterModal'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import Button from '../Button'
import { signIn } from 'next-auth/react'
import { OAuthConfig } from 'next-auth/providers'

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsloading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }

    });
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsloading(true);

        axios.post('/api/register', data).then((res) => {
            registerModal.onClose();
        }).catch((err) => {
            console.log("err RegisterModal => ", err);
            toast.error("oops failed to register, something");
        }).finally(() => {
            setIsloading(false);
        });
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title={'Welcome to Airbnb'}
                subtitle='Create an account'
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
                id='name'
                label='Name'
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
                onClick={() => signIn('github')}
            />
            <div
                className='mt-4 font-light text-center text-neutral-500'
            >
                <div className='flex flex-row items-center justify-center gap-2'>
                    <div>Already have an account?</div>
                    <div
                        onClick={() => { registerModal.onClose() }}
                        // onClick={registerModal.onClose}
                        className='cursor-pointer text-neutral-800 hover:underline'
                    >Login</div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal