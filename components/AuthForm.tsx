'use client';

import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import FormInput from './FormInput';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { authFormSchema } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const formSchema = authFormSchema(type);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			address1: '',
			city: '',
			state: '',
			postalCode: '',
			dateOfBirth: '',
			ssn: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);

		try {
			// Sign up with Appwrite & create plaid token

			if (type === 'sign-up') {
				const userData = {
					firstName: data.firstName!,
					lastName: data.lastName!,
					address1: data.address1!,
					city: data.city!,
					state: data.state!,
					postalCode: data.postalCode!,
					dateOfBirth: data.dateOfBirth!,
					ssn: data.ssn!,
					email: data.email,
					password: data.password,
				};
				const newUser = await signUp(userData);
				setUser(newUser);
			}

			if (type === 'sign-in') {
				const response = await signIn({
					email: data.email,
					password: data.password,
				});
				if (response) router.push('/');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className='auth-form'>
			<header className='flex flex-col gap-5 md:gap-8'>
				<Link
					href='/'
					className='cursor-pointer flex items-center gap-1'
				>
					<Image
						src='icons/logo.svg'
						width={34}
						height={34}
						alt='KraneX logo'
					/>
					<h1 className='text-26 ibm-plex-serif font-bold text-black'>
						KraneX
					</h1>
				</Link>
				<div className='flex flex-col gap-1 md:gap-3'>
					<h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
						{user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
						<p className='text-16 font-normal text-gray-600'>
							{user
								? 'Link your account to get started'
								: 'Please enter your details'}
						</p>
					</h1>
				</div>
			</header>
			{user ? (
				<div className='flex flex-col gap-4'>
					<PlaidLink
						user={user}
						variant='primary'
					/>
				</div>
			) : (
				<>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'
						>
							{type === 'sign-up' && (
								<>
									<div className='flex gap-4'>
										<FormInput
											control={form.control}
											name='firstName'
											label='First Name'
											placeholder='Input your first name'
										/>
										<FormInput
											control={form.control}
											name='lastName'
											label='Last Name'
											placeholder='Input your last name'
										/>
									</div>
									<FormInput
										control={form.control}
										name='address1'
										label='Address'
										placeholder='Input your address'
									/>
									<FormInput
										control={form.control}
										name='city'
										label='city'
										placeholder='Input your city'
									/>
									<div className='flex gap-4'>
										<FormInput
											control={form.control}
											name='state'
											label='State'
											placeholder='E.g: LG'
										/>
										<FormInput
											control={form.control}
											name='postalCode'
											label='Postal Code'
											placeholder='E.g: 100011'
										/>
									</div>
									<div className='flex gap-4'>
										<FormInput
											control={form.control}
											name='dateOfBirth'
											label='Date of Birth'
											placeholder='YYYY-MM-DD'
										/>
										<FormInput
											control={form.control}
											name='ssn'
											label='SSN'
											placeholder='E.g: 1234'
										/>
									</div>
								</>
							)}
							<FormInput
								control={form.control}
								name='email'
								label='Email'
								placeholder='Input your email'
							/>
							<FormInput
								control={form.control}
								name='password'
								label='Password'
								placeholder='Input your Pasword'
							/>

							<div className='flex flex-col gap-4'>
								<Button
									type='submit'
									className='form-btn'
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											{' '}
											<Loader2
												size={20}
												className='animate-spin'
											/>{' '}
											&nbsp; Loading...{' '}
										</>
									) : type === 'sign-in' ? (
										'Sign In'
									) : (
										'Sign Up'
									)}
								</Button>
							</div>
						</form>
					</Form>

					<footer className='flex justify-center gap-1'>
						<p className='text-14 font-normal text-gray-600'>
							{' '}
							{type === 'sign-in'
								? "Don't have an account?"
								: 'Already have an account'}
						</p>
						<Link
							href={type === 'sign-in' ? '/sign-up' : 'sign-in'}
							className='form-link'
						>
							{type === 'sign-in' ? 'Sign Up' : 'Sign In'}
						</Link>
					</footer>
				</>
			)}
		</section>
	);
};

export default AuthForm;
