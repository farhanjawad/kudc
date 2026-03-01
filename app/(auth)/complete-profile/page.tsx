'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '@/lib/validators/profile';
import { auth } from '@/lib/firebase/client';
import { completeUserProfile, createSessionCookie } from '@/lib/actions/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        if (user.email) setValue('email', user.email);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userUid) return;
    setIsSubmitting(true);
    setServerError('');
    
    const result = await completeUserProfile(data, userUid);
    
    if (result.success) {
      // Force refresh to get the new 'pending' claim
      const newToken = await auth.currentUser?.getIdToken(true);
      if (newToken) {
        // Sync the new claim to the Next.js server so the middleware allows passage
        await createSessionCookie(newToken); 
      }
      // Route to the gender-tailored success page
      router.push(`/registration-success?gender=${data.gender}`);
    } else {
      setServerError(result.error || 'Failed to complete profile');
      setIsSubmitting(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors";
  const labelClass = "text-sm font-semibold mb-1.5 block text-slate-700";

  if (!userUid) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="mb-8 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complete Your Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Please provide your details to access the LMS.</p>
        </div>
        
        {serverError && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{serverError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input {...register('name')} className={inputClass} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email (Read-only)</label>
              <input {...register('email')} readOnly className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input {...register('phone')} className={inputClass} placeholder="+1234567890" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Student ID</label>
              <input {...register('studentId')} className={inputClass} placeholder="e.g. CS-2024-001" />
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Discipline</label>
              <select {...register('discipline')} className={inputClass}>
                <option value="">Select a discipline</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Engineering">Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Other">Other</option>
              </select>
              {errors.discipline && <p className="text-red-500 text-xs mt-1">{errors.discipline.message}</p>}
            </div>
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className={labelClass}>Gender Identity</label>
              <div className="flex gap-6 mt-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="male" {...register('gender')} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" /><span>Male</span></label>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="female" {...register('gender')} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" /><span>Female</span></label>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="other" {...register('gender')} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" /><span>Other</span></label>
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-8 inline-flex items-center justify-center rounded-xl text-sm font-bold h-12 px-4 py-2 w-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null} 
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
