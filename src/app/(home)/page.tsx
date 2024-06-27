import { ProgressBar } from '@/components/progressBar';
import { Scene } from '@/components/scene';
import { Suspense } from 'react';

export default function STLModel() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black min-w-screen">
      <Suspense fallback={<ProgressBar />}>
        <Scene />
      </Suspense>
    </main>
  );
}
