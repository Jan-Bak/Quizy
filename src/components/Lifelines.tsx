import React from 'react';
import type { LifelineType } from '../types/quiz';
import styles from './../styles/Lifelines.module.css';

interface LifelinesProps {
  usedLifelines: Record<LifelineType, boolean>;
  onUse50_50: () => void;
  onUseCallToFriend: () => void;
  onUsePublicVote: () => void;
  isAnswerConfirmed: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({
  usedLifelines,
  onUse50_50,
  onUseCallToFriend,
  onUsePublicVote,
  isAnswerConfirmed,
}) => {
  const isLifelineDisabled = (lifelineType: LifelineType): boolean => {
    return usedLifelines[lifelineType] || isAnswerConfirmed;
  };

  return (
    <div className={styles.lifelines}>
      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('50/50') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUse50_50}
        disabled={isLifelineDisabled('50/50')}
        title={usedLifelines['50/50'] ? 'Already used' : 'Remove 2 wrong answers'}
      >
        <span className={styles['lifelines__icon']}>🎯</span>
        <span className={styles['lifelines__label']}>50/50</span>
      </button>

      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('callToFriend') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUseCallToFriend}
        disabled={isLifelineDisabled('callToFriend')}
        title={usedLifelines['callToFriend'] ? 'Already used' : 'Call a friend for help'}
      >
        <span className={styles['lifelines__icon']}>📞</span>
        <span className={styles['lifelines__label']}>Call a Friend</span>
      </button>

      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('publicVote') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUsePublicVote}
        disabled={isLifelineDisabled('publicVote')}
        title={usedLifelines['publicVote'] ? 'Already used' : 'Ask the audience'}
      >
        <span className={styles['lifelines__icon']}>🗳️</span>
        <span className={styles['lifelines__label']}>Public Vote</span>
      </button>
    </div>
  );
};

export default Lifelines;
