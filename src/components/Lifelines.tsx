import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const isLifelineDisabled = (lifelineType: LifelineType): boolean => {
    return usedLifelines[lifelineType] || isAnswerConfirmed;
  };

  return (
    <div className={styles.lifelines}>
      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('50/50') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUse50_50}
        disabled={isLifelineDisabled('50/50')}
        title={
          usedLifelines['50/50'] ? t('lifelines.fiftyFiftyUsed') : t('lifelines.fiftyFiftyHint')
        }
      >
        <span className={styles['lifelines__icon']}>🎯</span>
        <span className={styles['lifelines__label']}>{t('lifelines.fiftyFifty')}</span>
      </button>

      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('callToFriend') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUseCallToFriend}
        disabled={isLifelineDisabled('callToFriend')}
        title={
          usedLifelines['callToFriend']
            ? t('lifelines.fiftyFiftyUsed')
            : t('lifelines.callToFriendHint')
        }
      >
        <span className={styles['lifelines__icon']}>📞</span>
        <span className={styles['lifelines__label']}>{t('lifelines.callToFriend')}</span>
      </button>

      <button
        className={`${styles['lifelines__button']} ${isLifelineDisabled('publicVote') ? styles['lifelines__button--disabled'] : ''}`}
        onClick={onUsePublicVote}
        disabled={isLifelineDisabled('publicVote')}
        title={
          usedLifelines['publicVote']
            ? t('lifelines.publicVoteUsed')
            : t('lifelines.publicVoteHint')
        }
      >
        <span className={styles['lifelines__icon']}>🗳️</span>
        <span className={styles['lifelines__label']}>{t('lifelines.publicVote')}</span>
      </button>
    </div>
  );
};

export default Lifelines;
