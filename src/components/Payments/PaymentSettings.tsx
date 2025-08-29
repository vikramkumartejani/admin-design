"use client"
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Clock, Edit2 } from 'lucide-react'

const PaymentSettings = () => {
    const [formData, setFormData] = useState({
        pspProvider: 'M-Pesa Xpress',
        apiKey: 'sk_live_xxxx',
        callbackUrl: 'https://app.com/mpesa/callback',
        webhookToken: 'mpesaToken123',
        apiSecret: '********',
        platformFee: '10'
    })

    const [connectionStatus, setConnectionStatus] = useState('Connected successfully')
    const [isConnected, setIsConnected] = useState(true)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = () => {
        // Handle save logic here
        console.log('Saving configuration:', formData)
    }

    const handleDiscard = () => {
        // Reset to original values
        setFormData({
            pspProvider: 'M-Pesa Xpress',
            apiKey: 'sk_live_xxxx',
            callbackUrl: 'https://app.com/mpesa/callback',
            webhookToken: 'mpesaToken123',
            apiSecret: '********',
            platformFee: '10'
        })
    }

    const handleTestConnection = () => {
        // Simulate connection test
        setIsConnected(true)
        setConnectionStatus('Connected successfully')
    }

    return (
        <div className="max-w-[1138px] w-full mx-auto">
            <div className="flex justify-between items-center mb-3.5">
                <h1 className="text-[24px] leading-[38px] tracking-[-1px] font-semibold text-[#252525]">Payment Configuration</h1>
                <div className="flex gap-3">
                    <Button
                        onClick={handleDiscard}
                        className="h-[48px] border border-[#3A96AF] bg-white rounded-[12px] px-[26px] text-[#3A96AF] text-[14px] font-medium leading-[19px]"
                    >
                        Discard changes
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-[48px] bg-[#3A96AF] rounded-[12px] px-[35px] text-white text-[14px] font-medium leading-[19px]"
                    >
                        Save configuration
                    </Button>
                </div>
            </div>

            <div className="border border-[#E8ECF4] bg-white rounded-[22px] px-6 py-[30px]">
                {/* PSP Configuration Form */}
                <div>
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] mb-6">PSP Configuration Form</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <Label htmlFor="pspProvider" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    PSP Provider Name
                                </Label>
                                <Select value={formData.pspProvider} onValueChange={(value) => handleInputChange('pspProvider', value)}>
                                    <SelectTrigger className="w-full min-h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="M-Pesa Xpress">M-Pesa Xpress</SelectItem>
                                        <SelectItem value="PayPal">PayPal</SelectItem>
                                        <SelectItem value="Stripe">Stripe</SelectItem>
                                        <SelectItem value="Square">Square</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='space-y-4'>
                                <Label htmlFor="apiKey" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    API Key
                                </Label>
                                <Input
                                    id="apiKey"
                                    value={formData.apiKey}
                                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                                    className="h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5"
                                />
                            </div>

                            <div className='space-y-4'>
                                <Label htmlFor="callbackUrl" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    Callback URL
                                </Label>
                                <Input
                                    id="callbackUrl"
                                    value={formData.callbackUrl}
                                    onChange={(e) => handleInputChange('callbackUrl', e.target.value)}
                                    className="h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <Label htmlFor="webhookToken" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    Webhook Verification Token
                                </Label>
                                <Input
                                    id="webhookToken"
                                    value={formData.webhookToken}
                                    onChange={(e) => handleInputChange('webhookToken', e.target.value)}
                                    className="h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5"
                                />
                            </div>

                            <div className='space-y-4'>
                                <Label htmlFor="apiSecret" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    API Secret
                                </Label>
                                <Input
                                    id="apiSecret"
                                    type="password"
                                    value={formData.apiSecret}
                                    onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                                    className="h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5"
                                />
                            </div>

                            <div className='space-y-4'>
                                <Label htmlFor="platformFee" className="text-[14px] leading-[20px] font-medium text-[#676D75]">
                                    Platform Fee (%)
                                </Label>
                                <Select value={formData.platformFee} onValueChange={(value) => handleInputChange('platformFee', value)}>
                                    <SelectTrigger className="w-full min-h-[48px] cursor-pointer outline-none border border-[#E8ECF4] rounded-xl px-5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation/Test Section */}
                <div className="border-y border-[#9A9EA666] py-[34px] my-[34px]">
                    <div className="flex justify-between items-center gap-4">
                        <div className='flex flex-col gap-2'>
                            <h3 className='text-[#252525] text-[24px] leading-[38px] font-semibold tracking-[-1px]'>Validation/Test</h3>
                            <div className="flex items-center gap-3">
                                <svg width="24" height="24" className={`${isConnected ? 'text-[#1ECE73]' : 'text-red-600'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_859_19548)">
                                        <path d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76515 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76515 3.51472 3.51472C5.76515 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76515 24 8.8174 24 12ZM18.045 7.455C17.9379 7.34823 17.8103 7.26416 17.6699 7.20782C17.5295 7.15149 17.3792 7.12404 17.228 7.12712C17.0768 7.1302 16.9277 7.16375 16.7897 7.22575C16.6518 7.28776 16.5277 7.37695 16.425 7.488L11.2155 14.1255L8.076 10.9845C7.86274 10.7858 7.58067 10.6776 7.28922 10.6827C6.99776 10.6879 6.71969 10.8059 6.51357 11.0121C6.30745 11.2182 6.18938 11.4963 6.18424 11.7877C6.1791 12.0792 6.28728 12.3612 6.486 12.5745L10.455 16.545C10.5619 16.6517 10.6892 16.7358 10.8294 16.7923C10.9695 16.8487 11.1196 16.8764 11.2706 16.8736C11.4217 16.8708 11.5706 16.8376 11.7085 16.776C11.8465 16.7144 11.9706 16.6256 12.0735 16.515L18.0615 9.03C18.2656 8.81775 18.3784 8.53391 18.3756 8.23944C18.3728 7.94496 18.2546 7.66333 18.0465 7.455H18.045Z" fill="#1ECE73" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_859_19548">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className='text-[14px] leading-[20px] text-[#252525] font-medium'>
                                    {connectionStatus}
                                </span>
                            </div>
                        </div>
                        <Button
                            onClick={handleTestConnection}
                            className="h-[48px] bg-[#252525] rounded-[12px] px-[35px] text-white text-[14px] font-medium leading-[19px]"
                        >
                            Test Connection
                        </Button>
                    </div>
                </div>

                {/* Audit Info Section */}
                <div className="space-y-6 max-w-[494px] w-full pb-16">
                    <h3 className="text-[24px] leading-[38px] font-semibold text-[#252525]">Audit Info</h3>
                    <div className="flex items-center gap-2 justify-between">
                        <div className='flex items-center gap-3'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_859_19562)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.535 12.225L18.777 16.468L14.534 20.711C14.3465 20.8986 14.0922 21.0039 13.827 21.004H11C10.7348 21.004 10.4804 20.8986 10.2929 20.7111C10.1054 20.5236 10 20.2692 10 20.004V17.175C10.0001 16.9098 10.1055 16.6555 10.293 16.468L14.536 12.225H14.535ZM17 2C17.5046 1.99984 17.9906 2.19041 18.3605 2.5335C18.7305 2.87659 18.9572 3.34684 18.995 3.85L19 4V8.02C18.2445 7.87669 17.4662 7.90969 16.7255 8.11644C15.9849 8.32319 15.302 8.69811 14.73 9.212L14.534 9.397L8.878 15.054C8.36391 15.5682 8.05403 16.2515 8.006 16.977L7.999 17.175V20.004C7.99908 20.2757 8.03609 20.5462 8.109 20.808L8.169 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V4C2.99984 3.49542 3.19041 3.00943 3.5335 2.63945C3.87659 2.26947 4.34684 2.04284 4.85 2.005L5 2H17ZM20.191 10.811C20.4696 11.0896 20.6907 11.4203 20.8414 11.7843C20.9922 12.1483 21.0699 12.5385 21.0699 12.9325C21.0699 13.3265 20.9922 13.7167 20.8414 14.0807C20.6907 14.4447 20.4696 14.7754 20.191 15.054L15.95 10.81C16.5126 10.2476 17.2755 9.93164 18.071 9.93164C18.8665 9.93164 19.6294 10.2476 20.192 10.81L20.191 10.811ZM11 6H7C6.73478 6 6.48043 6.10536 6.29289 6.29289C6.10536 6.48043 6 6.73478 6 7C6 7.26522 6.10536 7.51957 6.29289 7.70711C6.48043 7.89464 6.73478 8 7 8H11C11.2652 8 11.5196 7.89464 11.7071 7.70711C11.8946 7.51957 12 7.26522 12 7C12 6.73478 11.8946 6.48043 11.7071 6.29289C11.5196 6.10536 11.2652 6 11 6Z" fill="#3A96AF" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_859_19562">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[16px] leading-[22px] font-medium text-[#676D75]">Last Edited By:</span>
                        </div>
                        <span className="text-[16px] font-medium leading-[22px] text-[#252525]">Olivia K.</span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <div className='flex items-center gap-3'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_859_19570)">
                                    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C24 8.8174 22.7357 5.76515 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0ZM17.2 17.22C17.1111 17.3178 17.0036 17.3969 16.8839 17.4529C16.7642 17.5089 16.6346 17.5406 16.5025 17.5462C16.3705 17.5518 16.2386 17.5311 16.1146 17.4854C15.9906 17.4397 15.8769 17.3699 15.78 17.28L10.78 12.74C10.6855 12.6422 10.6119 12.5261 10.5637 12.3989C10.5156 12.2716 10.4939 12.1359 10.5 12V6.5C10.5 6.23478 10.6054 5.98043 10.7929 5.79289C10.9804 5.60536 11.2348 5.5 11.5 5.5C11.7652 5.5 12.0196 5.60536 12.2071 5.79289C12.3946 5.98043 12.5 6.23478 12.5 6.5V11.56L17.13 15.81C17.3258 15.9879 17.4432 16.2363 17.4563 16.5005C17.4694 16.7648 17.3773 17.0235 17.2 17.22Z" fill="#3A96AF" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_859_19570">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[16px] leading-[22px] font-medium text-[#676D75]">Last Updated:</span>
                        </div>
                        <span className="text-[16px] font-medium leading-[22px] text-[#252525]">27-May-2025 10:45 AM</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSettings