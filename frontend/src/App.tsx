import { useAuth } from './hooks/useAuth';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading, logoutUser } = useAuth();

  // Check if the user has explicitly requested to run in local demo mode
  const isDemoOverrideActive = localStorage.getItem('nova_local_demo_override') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center font-mono gap-3">
        <Loader2 size={24} className="text-nova-glow animate-spin" />
        <div className="text-xs text-nova-glow/80 tracking-widest uppercase">
          Booting Nova Core Engine Topology...
        </div>
      </div>
    );
  }

  // If NOT in demo mode AND no authenticated Firebase user exists, show Login screen
  if (!user && !isDemoOverrideActive) {
    return (
      <Login 
        onDemoBypass={() => {
          // 1. Set the flag first
          localStorage.setItem('nova_local_demo_override', 'true');
          // 2. Clear out any potential lingering stale sessions
          localStorage.removeItem('firebase:authTransientState');
          // 3. Reload cleanly to let the application re-evaluate the condition
          window.location.reload(); 
        }} 
      />
    );
  }

  // Generate a mock operator profile wrapper structure if bypassing production tracks
  const effectiveUser = user || {
    uid: 'demo-operator-01',
    displayName: 'DEMO_OPERATOR',
    email: 'sandbox@nova.architecture'
  };

  // Custom logout handler that can cleanly destroy the local demo mode state
  const handleSignOut = () => {
    if (isDemoOverrideActive) {
      localStorage.removeItem('nova_local_demo_override');
      window.location.reload();
    } else {
      logoutUser();
    }
  };

  return (
    <Dashboard 
      userSession={effectiveUser} 
      onSignOut={handleSignOut} 
    />
  );
}

export default App;