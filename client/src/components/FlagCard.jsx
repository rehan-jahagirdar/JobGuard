const SEVERITY_CONFIG = {
  high:   { bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: 'bg-red-500',    label: 'High Risk' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500', label: 'Medium Risk' },
  low:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   dot: 'bg-blue-400',   label: 'Low Risk' },
};

const CATEGORY_ICONS = {
  PAYMENT:         '💰',
  PERSONAL_DATA:   '🪪',
  VAGUE_DETAILS:   '🌫️',
  UNREALISTIC_OFFER: '🤑',
  CONTACT:         '📞',
  URGENCY:         '⏱️',
  COMPANY:         '🏢',
  LANGUAGE:        '📝',
};

export default function FlagCard({ flag }) {
  const config = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.low;
  const icon = CATEGORY_ICONS[flag.category] || '⚠️';

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{flag.title}</span>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-black/20`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
          <p className="text-gray-300 text-sm mt-1 leading-relaxed">
            {flag.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}