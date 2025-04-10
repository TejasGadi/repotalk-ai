'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import useProject from '~/hooks/use-project'

const InviteButton = () => {
    const { selectedProjectId: projectId } = useProject()
    const [open, setOpen] = useState(false)
    const [inviteLink, setInviteLink] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined' && projectId) {
            setInviteLink(`${window.location.origin}/join/${projectId}`)
        }
    }, [projectId])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-500">
                        Ask them to copy and paste this link
                    </p>
                    <Input
                        className="mt-4 cursor-pointer hover:bg-gray-200"
                        readOnly
                        value={inviteLink}
                        onClick={() => {
                            navigator.clipboard.writeText(inviteLink)
                            toast.success('Copied to Clipboard')
                        }}
                    />
                </DialogContent>
            </Dialog>
            <Button size="sm" onClick={() => setOpen(true)}>
                Invite Members
            </Button>
        </>
    )
}

export default InviteButton
