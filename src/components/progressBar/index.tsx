'use client';
import React, { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress((prevState) => prevState + 10), 1900);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  const loadingIsCompleted = progress >= 100;

  return (
    <>
      {!loadingIsCompleted && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col w-1/2 gap-4 items-center">
            <h1 className="text-xl text-white font-bold self-start">Carregando ...</h1>
            <Progress value={progress} />

            <div className="hidden md:flex bg-white rounded-lg p-4 flex-col items-center gap-4">
              <h1 className="text-2xl md:text-xl text-black font-bold">
                Use o mouse para navegar através do modelo
              </h1>

              <p className="text-lg md:text-sm text-black self-start">
                Para dar zoom use o scroll do mouse
              </p>

              <p className="text-lg md:text-sm text-black self-start">
                Para girar o modelo pressione o botão esquerdo do mouse e movimente mouse
              </p>

              <p className="text-lg md:text-sm text-black self-start">
                Para navegar através do modelo pressione o botão direito e movimente o mouse
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
