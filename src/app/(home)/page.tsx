import { ProgressBar } from '@/components/progressBar';
import { Scene } from '@/components/scene';

export default function STLModel() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black min-w-screen">
      <ProgressBar />
      <Scene />
    </main>
  );
}
