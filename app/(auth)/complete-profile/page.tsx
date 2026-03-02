'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues, kuDisciplines } from '@/lib/validators/profile';
import { auth } from '@/lib/firebase/client';
import { completeUserProfile, createSessionCookie } from '@/lib/actions/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Let react-hook-form infer the types directly from the schema resolver
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userType: 'student',
      wantsToBuyBook: false,
      gender: 'male'
    }
  });

  const watchUserType = watch('userType');
  const watchBuyBook = watch('wantsToBuyBook');

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

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!userUid) return;
    setIsSubmitting(true);
    setServerError('');
    
    // We cast data to ProfileFormValues here since it has safely passed Zod validation
    const result = await completeUserProfile(data as ProfileFormValues, userUid);
    
    if (result.success) {
      const newToken = await auth.currentUser?.getIdToken(true);
      if (newToken) {
        await createSessionCookie(newToken); 
      }
      
      if (result.status === 'approved') {
        router.push('/dashboard');
      } else {
        router.push(`/registration-success?gender=${data.gender}`);
      }
    } else {
      setServerError(result.error || 'Failed to complete profile');
      setIsSubmitting(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors";
  const labelClass = "text-sm font-semibold mb-1.5 block text-slate-700";

  if (!userUid) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-emerald-600 h-8 w-8" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        <div className="mb-8 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">Participant Registration</h1>
          <p className="text-slate-500 text-sm mt-1">Please provide your details to access the LMS.</p>
        </div>
        
        {serverError && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{serverError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <label className="text-sm font-semibold mb-3 block text-slate-900">I am registering as a:</label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input type="radio" value="student" {...register('userType')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span>Student</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input type="radio" value="staff" {...register('userType')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span>Staff Member</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input {...register('name')} className={inputClass} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
            </div>
            
            <div>
              <label className={labelClass}>Email (Read-only)</label>
              <input {...register('email')} readOnly className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`} />
            </div>
            
            <div>
              <label className={labelClass}>Phone Number</label>
              <input {...register('phone')} className={inputClass} placeholder="017........" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Discipline (Khulna University)</label>
              <select {...register('discipline')} className={inputClass}>
                <option value="">Select your discipline</option>
                {kuDisciplines.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
              {errors.discipline && <p className="text-red-500 text-xs mt-1">{errors.discipline.message as string}</p>}
            </div>

            {watchUserType === 'student' && (
              <div>
                <label className={labelClass}>Student ID</label>
                <input {...register('studentId')} className={inputClass} placeholder="e.g. 020220" />
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message as string}</p>}
              </div>
            )}

            {watchUserType === 'staff' && (
              <div>
                <label className={labelClass}>Designation</label>
                <input {...register('designation')} className={inputClass} placeholder="e.g. Professor, Section Officer" />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message as string}</p>}
              </div>
            )}

            <div className="md:col-span-2 mt-2">
              <label className={labelClass}>Gender Identity</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="male" {...register('gender')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" /><span>Male</span></label>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="female" {...register('gender')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" /><span>Female</span></label>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" value="other" {...register('gender')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" /><span>Other</span></label>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <div className="flex items-start mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mr-4"><BookOpen className="w-6 h-6" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Course Material Option</h3>
                <p className="text-sm text-slate-600 mt-1">Do you want to purchase the physical book "Al-Aqeedah Al-Tahawiyyah" at a discounted student price?</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 ml-12">
              <label className="flex items-center space-x-3 text-sm font-medium text-slate-700 cursor-pointer p-3 rounded-xl border hover:bg-emerald-50 transition-colors">
                <input type="radio" value="true" {...register('wantsToBuyBook')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span>Yes, I want to buy the book (Requires Admin Approval)</span>
              </label>
              <label className="flex items-center space-x-3 text-sm font-medium text-slate-700 cursor-pointer p-3 rounded-xl border hover:bg-emerald-50 transition-colors">
                <input type="radio" value="false" {...register('wantsToBuyBook')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span>No, I don't need the book (Auto-Approved Access)</span>
              </label>
            </div>

            {/* If they select 'Yes', show the transaction ID box */}
            {String(watchBuyBook) === 'true' && (
              <div className="mt-6 ml-12 p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center text-amber-700 mb-3 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" /> Please pay 200 BDT via bKash/Nagad to: 01xxxxxxxxx
                </div>
                <label className={labelClass}>Transaction ID (TrxID)</label>
                <input {...register('transactionId')} className={inputClass} placeholder="e.g. 9ABC123XYZ" />
                {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message as string}</p>}
                <p className="text-xs text-slate-500 mt-2">Your account will be pending until an administrator verifies this payment.</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-8 flex items-center justify-center rounded-xl text-lg font-bold h-14 px-4 py-2 w-full bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null} 
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}