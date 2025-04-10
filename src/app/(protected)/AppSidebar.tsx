"use client"

import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import useProject from "~/hooks/use-project"
import { cn } from "~/lib/utils"


const items =[
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "QandA",
    url: "/qa",
    icon: Bot
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },

]

// interface Project {
//   id: number; // Add 'id' if needed
//   name: string;
// }

// const projects: Project[] = [
//   { id: 1, name: "Project1" },
//   { id: 1, name: "Project2" },
// ];



const AppSidebar = () => {

  const pathname = usePathname()
  const router = useRouter()
  const open = useSidebar().open
  const {projects, selectedProjectId, setSelectedProjectId} = useProject()


  return (
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Image src={'/repotalk.png'} alt={"Logo-icon"} width={30} height={30}/>
            {
              open && (
                <h1 className="text-xl font-bold text-primary/80">
                  RepoTalk AI
                </h1>
              )
            }
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
              {
                items.map((item)=>(
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={cn({
                        '!bg-primary !text-white': pathname === item.url}
                      )}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
              {
                projects?.map((project)=>(
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <div onClick={() => {
                        router.push("/dashboard"); // ✅ Navigate to /dashboard
                        setSelectedProjectId(project.id); // ✅ Set project ID
                      }}
                       className="cursor-pointer">
                        <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                          {
                            // "bg-primary text-white" : true
                            "bg-primary text-white" : project.id === selectedProjectId
                          }
                        )}>
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
              <div className="h-2">
                {
                  open && (
                    <SidebarMenuItem>
                      <Link href={'/create'}>
                        <Button variant={'outline'} className="" size={'sm'}>
                          <Plus/>
                          Create Project
                        </Button>
                      </Link>
                    </SidebarMenuItem>
                  )
                }
              </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  )
}

export default AppSidebar
