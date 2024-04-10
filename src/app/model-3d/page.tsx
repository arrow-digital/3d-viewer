import styles from './page.module.css';
import { Scene } from '@/components/scene';

export default function STLModel() {
  return (
    <main className={styles.main}>
      <Scene />
    </main>
  );
}
