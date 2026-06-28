import { PriorityTier } from '../../types';

export const PriorityBadge = ({ tier }: { tier: PriorityTier }) => {
  const styles = {
    critical: 'bg-nova-urgent/10 text-nova-urgent border-nova-urgent/30 shadow-glow-amber',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-nova-action/10 text-nova-action border-nova-action/30',
    low: 'bg-nova-glow/10 text-nova-glow border-nova-glow/30'
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border tracking-wider ${styles[tier]}`}>
      {tier}
    </span>
  );
};
