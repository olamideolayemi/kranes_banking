import { z } from 'zod';
import React from 'react';
import { Input } from './ui/input';
import { authFormSchema } from '@/lib/utils';
import { Control, FieldPath } from 'react-hook-form';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';

const formSchema = authFormSchema('sign-in');

interface FormInput {
	control: Control<z.infer<typeof formSchema>>;
	name: FieldPath<z.infer<typeof formSchema>>;
	label: string;
	placeholder: string;
}

const FormInput = ({ control, name, label, placeholder }: FormInput) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<div className='form-item'>
					<FormLabel className='form-label'>{label}</FormLabel>
					<div className='flex w-full flex-col'>
						<FormControl>
							<Input
								placeholder={placeholder}
								className='input-class'
								type={name === 'password' ? 'password' : 'text'}
								{...field}
							/>
						</FormControl>
						<FormMessage className='form-message mt-2' />
					</div>
				</div>
			)}
		/>
	);
};

export default FormInput;
