import {Check, ChevronDown} from 'lucide-react-native';
import React, {useRef, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export default function Dropdown({value, options, onChange, label, placeholder}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o) => o.value === value);
    const dropdownRef = useRef<View>(null);
    const [layout, setLayout] = useState({x: 0, y: 0, width: 0, height: 0});

    const openDropdown = () => {
        dropdownRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setLayout({x: pageX, y: pageY, width, height});
            setIsOpen(true);
        });
    };

    return (
        <View className='w-full'>
            {label && <Text className='text-[11px] font-[450] mb-3 text-[#45474D] uppercase tracking-[0.1em]'>{label}</Text>}
            <View ref={dropdownRef}>
                <Pressable
                    onPress={openDropdown}
                    className='w-full px-3 py-2 bg-[#f8f9fc] border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] flex flex-row items-center justify-between active:bg-[var(--theme-surface-surface)]'
                >
                    <Text className='text-[#121317] font-normal text-lg'>{selectedOption?.label || placeholder || 'Select...'}</Text>
                    <ChevronDown size={20} color='#B2BBC5' />
                </Pressable>
            </View>

            <Modal visible={isOpen} transparent animationType='none'>
                <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                    <View style={StyleSheet.absoluteFill} className='bg-[#121317]/10 backdrop-blur-sm'>
                        <View
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: [{translateX: '-50%'}, {translateY: '-50%'}],
                            }}
                            className='bg-white border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] overflow-hidden p-2 shadow-xl w-[50%]'
                        >
                            {options.map((option) => (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-3 py-2 rounded-xl flex flex-row items-center justify-between transition-colors ${
                                        option.value === value ? 'bg-[#121317]' : 'active:bg-[#F8F9FC]'
                                    }`}
                                >
                                    <Text className={`font-[450] ${option.value === value ? 'text-white' : 'text-[#121317]'}`}>
                                        {option.label}
                                    </Text>
                                    {option.value === value && <Check size={18} color='white' />}
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
