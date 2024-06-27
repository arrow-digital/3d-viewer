'use client';
import React, { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';

type Props = {
  handleShowModel(): void;
};

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prevState) => prevState + 10);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  const loadingIsCompleted = progress >= 100;

  return (
    <>
      {!loadingIsCompleted && (
        <section className="flex flex-col w-1/2 gap-4">
          <h1 className="text-4xl text-white">Carregando</h1>
          <Progress value={progress} />
        </section>
      )}
    </>
  );
}
