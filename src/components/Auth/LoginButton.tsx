import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginButton() {
  const { user, demoMode, signInWithGoogle, signOut } = useAuth();

  if (demoMode) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        <span className="text-sm font-medium">Demo Mode</span>
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
          {user.user_metadata.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.name || 'User'}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
          <span className="text-sm text-white">
            {user.user_metadata.name || user.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-sm font-medium">Sign In with Google</span>
    </button>
  );
}
