import { Scene } from '@/components/scene';
import { Metadata } from 'next';


export const metadata: Metadata = { 
  title: 'Visualizador 3d' 
};


export default function STLModel() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black min-w-screen">
      <Scene />
    </main>
  );
}
