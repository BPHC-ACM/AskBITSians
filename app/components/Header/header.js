import Image from 'next/image';
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src='/askbitsians-logo.webp'
          alt='AskBITSians Logo'
          width={40}
          height={40}
          priority={true}
        />
        <h1 className={styles.name}>AskBITSians</h1>
      </div>
    </header>
  );
}
