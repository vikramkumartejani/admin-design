"use client"

import React from "react"
import RippleButton from "./button"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    icon?: React.ReactNode
    confirmButtonColor?: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon,
    confirmButtonColor = ""
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-[#06132326] flex items-center justify-center z-50">
            <div className="bg-white rounded-[34px] py-[30px] px-10 w-[429px] mx-4 border border-[#E8ECF4]" style={{boxShadow: "0px 4px 8px 0px #2D2E330A"}}>
                <div className="flex flex-col items-center text-center mb-5">
                    {icon && (
                        <div className="flex items-center justify-center mb-5 bg-[#3A96AF26] w-12 h-12 rounded-full">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-[24px] leading-[41px] font-medium text-[#252525]">
                        {title}
                    </h3>
                    <p className="text-[16px] leading-[22px] font-medium text-[#676D75]">
                        {description}
                    </p>
                </div>
                <div className="flex gap-3.5 max-w-[309px] w-full mx-auto">
                    <RippleButton
                        onClick={onClose}
                        className="flex-1 bg-white border border-[#676D75] text-[#252525] text-[16px] font-medium hover:bg-gray-100 h-12 px-4 rounded-xl"
                    >
                        {cancelText}
                    </RippleButton>
                    <RippleButton
                        onClick={onConfirm}
                        className={`flex-1 bg-[#3A96AF] border border-[#3A96AF] text-white text-[16px] font-medium hover:bg-[#3692ac] h-12 px-4 rounded-xl ${confirmButtonColor}`}
                    >
                        {confirmText}
                    </RippleButton>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal 