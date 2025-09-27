import React, { useState, useEffect, useMemo } from 'react';

// --- Inline SVG Icons (Replaces lucide-react) ---
const Wallet = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H3a2 2 0 0 1 2-2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M16 12h.01"></path>
    <path d="M22 7.74a4 4 0 0 1 0 8.52"></path>
  </svg>
);
const TrendingUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);
const AlertTriangle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const CheckCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const Clock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const LogIn = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);
const UserPlus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);
const LogOut = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);


// --- Firebase Imports (Required Setup) ---
// We mock Firebase Auth methods for local testing and include real setup for deployment.
const mockFirebase = {
  // Core services
  initializeApp: () => ({}),
  getFirestore: () => ({}),
  
  // Auth service and methods
  getAuth: () => ({
    currentUser: null, // Initial state is logged out
  }),
  signInWithCustomToken: (auth, token) => console.log('Signing in with token...'),
  signInAnonymously: (auth) => console.log('Signing in anonymously...'),
  
  // Auth state listener (Crucial for session management)
  onAuthStateChanged: (auth, callback) => {
    // Simulate initial auth check: log in via custom token, then log out after 1s
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        callback({ uid: 'initial-user-id', email: 'canvas@example.com' });
    } else {
        setTimeout(() => callback(null), 100); // Simulate not signed in
    }
    return () => {}; // Cleanup function
  },

  // Mocked Auth Functions (Replace with actual Firebase Auth SDK in a real project)
  signInWithEmailAndPassword: (auth, email, password) => new Promise((resolve, reject) => {
    console.log(`Mock sign in attempt for: ${email}`);
    if (email === 'test@user.com' && password === 'password') {
      setTimeout(() => resolve({ user: { uid: 'mock-auth-user', email } }), 500);
    } else {
      setTimeout(() => reject(new Error('Mock: Invalid email or password.')), 500);
    }
  }),
  createUserWithEmailAndPassword: (auth, email, password) => new Promise((resolve, reject) => {
    console.log(`Mock sign up attempt for: ${email}`);
    if (password.length >= 6) {
        setTimeout(() => resolve({ user: { uid: 'mock-auth-newuser', email } }), 500);
    } else {
        setTimeout(() => reject(new Error('Mock: Password must be at least 6 characters.')), 500);
    }
  }),
  signOut: (auth) => new Promise((resolve) => {
    console.log('Mock sign out successful.');
    setTimeout(() => resolve(), 300);
  }),
};

// Global services container
let firebaseServices = { auth: null, db: null, userId: null };

const initializeFirebase = async (appId) => {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
  
  // Use mockFirebase for demonstration if not in the Canvas environment
  const { 
    initializeApp, getAuth, signInWithCustomToken, signInAnonymously, 
    getFirestore, onAuthStateChanged, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, signOut 
  } = mockFirebase;

  try {
    const app = initializeApp(firebaseConfig);
    firebaseServices.auth = getAuth(app);
    firebaseServices.db = getFirestore(app);
    
    // Initial Auth: Custom Token (Canvas environment) or Anonymous
    if (initialAuthToken) {
      await signInWithCustomToken(firebaseServices.auth, initialAuthToken);
    } else {
      // We will rely on user email/password sign-in now, so anonymous sign-in is less critical
      // await signInAnonymously(firebaseServices.auth); 
    }
    
    // Attach all auth methods to the services object for easy access
    firebaseServices.signIn = (email, password) => signInWithEmailAndPassword(firebaseServices.auth, email, password);
    firebaseServices.signUp = (email, password) => createUserWithEmailAndPassword(firebaseServices.auth, email, password);
    firebaseServices.signOut = () => signOut(firebaseServices.auth);

    return { 
        auth: firebaseServices.auth, 
        db: firebaseServices.db,
        onAuthStateChanged: (callback) => onAuthStateChanged(firebaseServices.auth, callback) 
    };
    
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { auth: null, db: null, onAuthStateChanged: () => () => {} };
  }
};


// --- AUTHENTICATION FORM COMPONENT ---
const AuthForm = ({ authMode, setAuthMode, onAuthSuccess }) => {
  const [email, setEmail] = useState('test@user.com'); // Pre-fill for easy testing
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLogin = authMode === 'login';
  const headerText = isLogin ? 'Welcome Back' : 'Create Account';
  const buttonText = isLogin ? 'Sign In' : 'Sign Up';
  const icon = isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await firebaseServices.signIn(email, password);
      } else {
        await firebaseServices.signUp(email, password);
      }
      onAuthSuccess(); // Handle UI update after successful auth
    } catch (err) {
      // Firebase errors typically have a 'message' property
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{headerText}</h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="e.g., test@user.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="Min 6 characters"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Processing...' : (
            <>
              {icon}
              {buttonText}
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button 
          onClick={() => {
            setAuthMode(isLogin ? 'signup' : 'login');
            setError(null); // Clear errors when switching mode
          }}
          className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
          disabled={loading}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};


// --- HELPER FUNCTIONS ---

const getPrediction = (totalBudget, totalSpent) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysPassed = today.getDate(); 

  const dailyBurnRate = totalSpent / daysPassed;
  const remainingBudget = totalBudget - totalSpent;
  const daysRemaining = daysInMonth - daysPassed;

  if (remainingBudget <= 0) {
    return { status: 'error', message: 'You have already exceeded your budget for the month. Immediate action needed!' };
  }

  if (dailyBurnRate <= 0) {
    return { status: 'success', message: 'No significant spending detected yet. You are perfectly on track!' };
  }
  
  const daysUntilDepleted = remainingBudget / dailyBurnRate;
  
  if (daysUntilDepleted >= daysRemaining) {
    return { status: 'success', message: `You are on track to finish the month with \$${remainingBudget.toFixed(2)} remaining. Keep it up!` };
  } else {
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + Math.floor(daysUntilDepleted));
    const dateOptions = { day: 'numeric', month: 'long' };
    const dateString = depletionDate.toLocaleDateString('en-US', dateOptions);
    const projectedOverspendAmount = (dailyBurnRate * daysRemaining) - remainingBudget;
    
    return {
      status: 'warning',
      message: `Warning! At your current spending rate, you are predicted to overspend your budget by \$${projectedOverspendAmount.toFixed(2)} around ${dateString}.`,
    };
  }
};


// --- MAIN APPLICATION COMPONENT ---
const BudgetPredictor = () => {
  const [budget, setBudget] = useState(1500); 
  const [spent, setSpent] = useState(950);   
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null); // Firebase User object
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // 1. Firebase/Auth Initialization and Listener (MANDATORY)
  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    
    initializeFirebase(appId).then(({ onAuthStateChanged }) => {
        // Set up the state change listener
        const unsubscribe = onAuthStateChanged(authUser => {
            setUser(authUser);
            // After the initial check, we set authReady to true
            setAuthReady(true); 
            console.log(`Auth state changed. User is ${authUser ? 'SIGNED IN' : 'SIGNED OUT'}`);
            if (authUser) {
                firebaseServices.userId = authUser.uid;
            }
        });

        // Cleanup the subscription
        return () => unsubscribe();
    });
  }, []);

  // Budget Prediction Logic
  const prediction = useMemo(() => {
    if (budget > 0) {
      return getPrediction(budget, spent);
    }
    return { status: 'info', message: 'Set a budget to enable predictions.' };
  }, [budget, spent]);

  const { status, message } = prediction;
  let statusColor = 'bg-gray-100 border-gray-300 text-gray-800';
  let icon = <Clock className="w-6 h-6" />;
  let iconBg = 'bg-gray-500';

  if (status === 'success') {
    statusColor = 'bg-green-100 border-green-500 text-green-700';
    icon = <CheckCircle className="w-6 h-6" />;
    iconBg = 'bg-green-500';
  } else if (status === 'warning') {
    statusColor = 'bg-yellow-100 border-yellow-500 text-yellow-700';
    icon = <AlertTriangle className="w-6 h-6" />;
    iconBg = 'bg-yellow-500';
  } else if (status === 'error') {
    statusColor = 'bg-red-100 border-red-500 text-red-700';
    icon = <TrendingUp className="w-6 h-6" />;
    iconBg = 'bg-red-500';
  }

  const handleBudgetChange = (e) => setBudget(parseFloat(e.target.value) || 0);
  const handleSpentChange = (e) => setSpent(parseFloat(e.target.value) || 0);
  const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;
  const progressBarWidth = Math.min(100, percentUsed);
  const progressColor = percentUsed < 70 ? 'bg-green-500' : percentUsed < 95 ? 'bg-yellow-500' : 'bg-red-500';

  const handleSignOut = async () => {
    try {
        await firebaseServices.signOut();
    } catch (error) {
        console.error("Sign out failed:", error);
    }
  };

  // --- LOADING / AUTH CHECK VIEW ---
  if (!authReady) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p className="text-lg font-medium text-gray-600">Checking session...</p>
        </div>
    );
  }

  // --- AUTH FORM VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50 sm:p-8">
        <AuthForm authMode={authMode} setAuthMode={setAuthMode} onAuthSuccess={() => setAuthMode('login')} />
      </div>
    );
  }

  // --- MAIN APP VIEW (Authenticated) ---
  return (
    <div className="min-h-screen p-4 bg-gray-50 sm:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          <span className="text-indigo-600">AI</span> Budget Predictor
        </h1>
        <p className="mt-1 text-gray-500">Welcome, {user.email || 'User'}! Track and predict your budget.</p>
        
        <div className="flex justify-center items-center mt-3 space-x-4">
            <p className="text-xs text-gray-400">User ID: {user.uid}</p>
            <button
                onClick={handleSignOut}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition duration-150"
            >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
            </button>
        </div>

      </header>

      <div className="max-w-xl p-6 mx-auto bg-white rounded-xl shadow-2xl space-y-6 border border-gray-100">
        
        {/* Input Form */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <div className="space-y-1">
            <label htmlFor="budget" className="text-sm font-medium text-gray-700 flex items-center">
              <Wallet className="w-4 h-4 mr-1 text-indigo-500" /> Monthly Budget
            </label>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Total Budget"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="spent" className="text-sm font-medium text-gray-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-red-500" /> Amount Spent (So Far)
            </label>
            <input
              id="spent"
              type="number"
              value={spent}
              onChange={handleSpentChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Current Spending"
            />
          </div>
        </div>
        
        {/* Separator */}
        <div className="border-t border-gray-200"></div>


        {/* Visual Summary */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Budget Status</h2 >
            
            <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Spent: ${spent.toFixed(2)}</span>
                <span>Remaining: ${(budget - spent).toFixed(2)}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-200 rounded-full">
                <div 
                    className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                    style={{ width: `${progressBarWidth}%` }}
                ></div>
            </div>
            <p className="text-sm font-semibold text-right text-gray-500">{percentUsed.toFixed(1)}% Used</p>
        </div>

        {/* AI Prediction Card (The core feature) */}
        <div className={`p-5 mt-6 border-2 rounded-xl shadow-lg ${statusColor}`}>
          <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 text-white rounded-full flex-shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold">Predictive Insight</h3>
              <p className="mt-1 text-base leading-snug">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actionable Advice */}
        {status === 'warning' && (
             <div className="p-4 mt-4 text-sm bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">Actionable Advice:</p>
                <p>Consider pausing discretionary spending (e.g., dining out, subscriptions) for the next 5 days to realign with your monthly target.</p>
             </div>
        )}

      </div>
    </div>
  );
};

export default BudgetPredictor;
