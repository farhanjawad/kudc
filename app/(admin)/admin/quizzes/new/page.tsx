'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveQuiz } from '@/lib/actions/admin';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

const quizFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  timeLimit: z.number().min(1),
  passingScore: z.number().min(0).max(100),
  status: z.enum(['draft', 'published']),
  questions: z.array(z.object({
    text: z.string().min(5),
    options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).length(4),
    correctOptionId: z.string(),
    points: z.number().min(1)
  })).min(1)
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export default function QuizBuilderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { status: 'draft', timeLimit: 30, passingScore: 70, questions: [{ text: '', points: 1, correctOptionId: 'a', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }] }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);
    const { questions, ...metadata } = data;
    const res = await saveQuiz(null, metadata, questions);
    if (res.success) router.push('/admin/quizzes');
    else { alert("Failed to save quiz: " + res.error); setIsSubmitting(false); }
  };

  const inputClass = "flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">Quiz Builder</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Quiz Details</h2>
          <div><label className={labelClass}>Title</label><input {...register('title')} className={inputClass} /></div>
          <div><label className={labelClass}>Description</label><textarea {...register('description')} className={`${inputClass} min-h-[100px]`} /></div>
          <div className="grid grid-cols-3 gap-6">
            <div><label className={labelClass}>Time Limit</label><input type="number" {...register('timeLimit', { valueAsNumber: true })} className={inputClass} /></div>
            <div><label className={labelClass}>Passing %</label><input type="number" {...register('passingScore', { valueAsNumber: true })} className={inputClass} /></div>
            <div><label className={labelClass}>Status</label><select {...register('status')} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option></select></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Questions</h2>
            <button type="button" onClick={() => append({ text: '', points: 1, correctOptionId: 'a', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }] })} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium">Add Question</button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-6 rounded-xl border relative">
              <button type="button" onClick={() => remove(index)} className="absolute top-6 right-6 text-red-500"><Trash2 className="w-5 h-5" /></button>
              <div className="mb-4 pr-12"><label className={labelClass}>Question {index + 1}</label><textarea {...register(`questions.${index}.text` as const)} className={`${inputClass} min-h-[80px]`} /></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {['a', 'b', 'c', 'd'].map((optId, optIdx) => (
                  <div key={optId} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border">
                    <input type="radio" value={optId} {...register(`questions.${index}.correctOptionId` as const)} className="w-4 h-4 text-blue-600" />
                    <input {...register(`questions.${index}.options.${optIdx}.text` as const)} className={`${inputClass} flex-1`} placeholder={`Option ${optId.toUpperCase()}`} />
                    <input type="hidden" {...register(`questions.${index}.options.${optIdx}.id` as const)} value={optId} />
                  </div>
                ))}
              </div>
              <div className="w-32"><label className={labelClass}>Points</label><input type="number" {...register(`questions.${index}.points` as const, { valueAsNumber: true })} className={inputClass} /></div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-6"><button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl disabled:opacity-50">Save Quiz</button></div>
      </form>
    </div>
  );
}
