"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import useProject from '~/hooks/use-project'
import { askQuestion } from './actions'
import MDEditor from '@uiw/react-md-editor';
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from './code-references'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import useRefetch from '~/hooks/use-refetch'

const AskQuestionCard = () => {
    const {project} = useProject()
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [filesReferences, setFilesReferences] = React.useState<{ filename: string; sourceCode: string;summary: string}[]>([])
    const [answer, setAnswer] = React.useState("")
    const saveAnswer = api.project.saveAnswer.useMutation()
    
    
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        setAnswer("")
        setFilesReferences([])
        e.preventDefault()

        if(!project?.id) return
        
        setLoading(true)
        
        const {output, filesReferenced, context} = await askQuestion(question, project.id)
        setOpen(true)
        setFilesReferences(filesReferenced)

        for await (const chunk of readStreamableValue(output)){
            if(chunk){
                setAnswer(ans => ans + chunk)
            }
        }
        
        setLoading(false)

    }
    const refetch = useRefetch()

  return (
    <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-[80vw] '>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>
                            <Image src="/repotalk.png" alt='RepoTalk' width={40} height={40}/>
                        </DialogTitle>
                        <Button variant={"outline"} disabled={saveAnswer.isPending} onClick={()=>{
                            saveAnswer.mutate({
                                projectId: project?.id!,
                                question,
                                answer,
                                filesReferences
                            },
                            {
                                onSuccess() {
                                    toast.success("Answer Saved!")
                                    refetch()
                                },
                                onError(error) {
                                    toast.error(`Failed to save Answer, Error: ${error}`)
                                },
                            }
                        )
                        }}>
                            Save Answer
                        </Button>
                    </div>
                </DialogHeader>
                
                <div className="flex flex-col h-[80vh]">
                    <MDEditor.Markdown source={answer} className='flex-1 max-w-[70vw] !h-full max-h-[30vh] overflow-auto mb-4'/>
                    <CodeReferences filesReferences={filesReferences}/>
                </div>

                <Button type='button' onClick={()=>setOpen(false)}>
                    Close
                </Button>
                
            </DialogContent>
        </Dialog>
        <Card className='relative col-span-4'>
            <CardHeader>Ask a question</CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Textarea className='mb-4' placeholder='Which file to edit in order to edit the HomePage?' value={question} onChange={e=>setQuestion(e.target.value)} rows={5}/>
                    <Button type='submit' disabled={loading}>
                        Ask RepoTalk AI
                    </Button>
                </form>
            </CardContent>
        </Card>
    </>
  )
}

export default AskQuestionCard
