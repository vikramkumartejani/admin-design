import * as React from 'react';

interface TextareaCustomProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const TextareaCustom: React.FC<TextareaCustomProps> = ({ value, onChange, placeholder, className }) => {
    return (
        <textarea
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder={placeholder || "Tell us about your offer"}
            className={
                "w-full border border-[#E8ECF4] rounded-xl p-4 text-[16px] font-normal leading-[20px] tracking-[0.5px] text-[#252525] placeholder:text-[#676D75] bg-white focus:outline-none focus:border-[#3A96AF] resize-none " +
                (className || "")
            }
            rows={5}
        />
    );
};

export default TextareaCustom;