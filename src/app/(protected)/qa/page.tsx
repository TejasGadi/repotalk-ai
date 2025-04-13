"use client"
import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"
import useProject from "~/hooks/use-project"
import { api } from "~/trpc/react"
import AskQuestionCard from "../dashboard/ask-question-card"
import MDEditor from "@uiw/react-md-editor"
import CodeReferences from "../dashboard/code-references"

const QAPage = () => {
  const {selectedProjectId: projectId} = useProject()
  const {data: questions} = api.project.getQuestions.useQuery({
    projectId: projectId
  })
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const question = questions?.[questionIndex]

  return (
    <Sheet>
      <AskQuestionCard/>
      
      <h1 className="text-xl font-semibold mb-2 mt-4">
        Saved Questions
      </h1>

      <div className="flex flex-col gap-2">
        {questions?.map((question, index)=>(
          <React.Fragment key={question.id}>
            <SheetTrigger onClick={()=>setQuestionIndex(index)}>
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                <img src={question.user.imageUrl || "./default_avatar.png"} alt="User Profile image" className="rounded-full" width={30} height={30}/>
                <div className="text-left flex flex-col">
                  <div className="flex flex-center gap-2">
                    <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                      {question?.question}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-500 line-clamp-1 text-sm">
                    {question?.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        )
          
        )}
      </div>
      
      {question && (
        <SheetContent className="sm: w-[80vw] h-[100vh]">
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
            <div className="flex flex-col h-[90vh]">
                
              <MDEditor.Markdown source={question.answer} className='flex-1 max-w-[90%] !h-full max-h-[40vh] overflow-scroll mb-4'/>
              <CodeReferences filesReferences={(question.filesReferences ?? []) as any}/>
            </div>
          </SheetHeader>
        </SheetContent>
      )}
      
    </Sheet>
  )
}

export default QAPage
