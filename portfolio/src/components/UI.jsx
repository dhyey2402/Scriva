export const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-xl my-4 text-center">
    {message || 'Something went wrong. Please try again.'}
  </div>
);

export const EmptyState = ({ title, message }) => (
  <div className="text-center py-20 glass-panel rounded-2xl">
    <h3 className="text-xl font-semibold text-gray-300 mb-2">{title || 'No content found'}</h3>
    <p className="text-gray-500">{message || 'Check back later.'}</p>
  </div>
);
