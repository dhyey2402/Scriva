export const Loader = () => (
  <div className="flex flex-col justify-center items-center py-24 gap-4">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl border-2 border-amber-400/20 animate-spin" style={{ animationDuration: '1.5s' }} />
      <div className="absolute inset-0 w-14 h-14 rounded-2xl border-t-2 border-amber-400 animate-spin" />
    </div>
    <span className="text-xs font-mono text-gray-500 tracking-wider uppercase">Loading</span>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="glass-card rounded-2xl p-5 my-4 flex items-center gap-3 border-red-500/20">
    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
    <p className="text-sm text-red-300 font-medium">
      {message || 'Something went wrong. Please try again.'}
    </p>
  </div>
);

export const EmptyState = ({ title, message }) => (
  <div className="text-center py-24 glass-card rounded-2xl">
    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 border border-amber-400/20 flex items-center justify-center">
      <span className="text-2xl text-amber-400/60">∅</span>
    </div>
    <h3 className="text-lg font-bold text-gray-200 mb-2">{title || 'No content found'}</h3>
    <p className="text-sm text-gray-500">{message || 'Check back later.'}</p>
  </div>
);
