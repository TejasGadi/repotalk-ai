"use client"

import { Info } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import useRefetch from '~/hooks/use-refetch'
import { api } from '~/trpc/react'

type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}

const CreatePage = () => {
    const {register, handleSubmit, reset} = useForm<FormInput>()

    const createProject = api.project.createProject.useMutation()
    const checkCredits = api.project.checkCredits.useMutation()

    const refetch = useRefetch()

    const onSubmit = (data: FormInput)=>{

        if(!!checkCredits.data){
            createProject.mutate({
                githubUrl: data.repoUrl,
                name: data.projectName,
                githubToken: data.githubToken
            }, {
                onSuccess() {
                    toast.success("Project created successfully")
                    refetch()
                    reset()
                },
                onError(error) {
                    toast.error(`Error in creating the project: ${error}`)
                },
            })
            
        }else{
            checkCredits.mutate({
                githubUrl: data.repoUrl,
                githubToken: data.githubToken
            })
        }
        
    }

    const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits.data.fileCount <=checkCredits.data.userCredits: true


  return (
    <div className='flex items-center gap-12 h-full justify-center'>
    <img src={"github_svg.svg"} alt='Github SVG' className='h-56 w-auto'/>
      <div>
        <div className='mb-4'>
            <h1 className="font-semibold text-2xl">
                Link your Github Repository
            </h1>
            <p className='text-sm text-muted-foreground'>
                Enter the URL of your repository
            </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                className='mt-4'
                {...register('projectName', {required: true})}
                placeholder='ProjectName'
                required/>
            <Input
                className='mt-4'
                {...register('repoUrl', {required: true})}
                placeholder='Github URL'
                type='url'
                required/>
            <Input
                className='mt-4'
                {...register('githubToken', {required: false})}
                placeholder='Github Token(Optional)'
                />

            {!!checkCredits.data && (
                <>
                    <div className="mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
                        <div className="flex items-center gap-2">
                            <Info className='size-4'/>
                            <p className="text-sm">You will be charged <strong>{checkCredits.data?.fileCount}</strong> credits for this repository</p>
                        </div>
                        <p className="text-sm text-blue-600 ml-6">You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining</p>
                    </div>
                </>
            )}
            
            <Button type='submit' className='mt-4' disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits}>
                {!!checkCredits.data ? 'Create Project': 'Check Required Credits'}
            </Button>
        </form>
      </div>
    </div>
  )
}

export default CreatePage
