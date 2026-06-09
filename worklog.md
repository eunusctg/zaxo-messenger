---
Task ID: 1
Agent: Main
Task: Replace Zap dial button, remove dummy data, add admin login, create legal pages, add call direction logic

Work Log:
- Read all source files (page.tsx, ChatView, CallScreen, CallHistory, ProfileView, SettingsView, stores, globals.css, mock-data.ts, ChatList)
- TASK 1: Replaced Zap/Sparkles dial button with Phone icon + ripple animation
  - globals.css: Removed flash-glow, lightning-flash, electric-spark, dial-pulse animations; Added phone-dial-glow, phone-dial-ripple, phone-dial-ripple-delayed, phone-dial-ring animations
  - ChatView.tsx: Replaced Zap/Sparkles with Phone icon, added phone-dial-glow, phone-dial-ripple, phone-dial-ring classes
  - CallHistory.tsx: Replaced Zap/Sparkles in New Call button with Phone icon + phone-dial-ring
- TASK 2: Removed all dummy/mock data
  - mock-data.ts: Emptied mockUsers, mockChats, mockMessages, mockCallHistory, mockContactStatuses, mockAdminUsers, mockReports, mockAuditLogs
  - page.tsx: Removed mock data initialization useEffect, removed mock data imports
  - ChatList.tsx: Removed mock data useEffect, removed mockUsers/mocks imports, replaced (typeof mockChats)[0] with Chat type, replaced isChatOnline to return false
  - ChatView.tsx: Removed mockUsers import, replaced onlineUsers useMemo with simple false return
  - CallHistory.tsx: Removed mockCallHistory/mockUsers imports, removed useMemo init, updated NewCallModal to show "No contacts yet"
- TASK 3: Added admin credentials and login screen
  - stores/index.ts: Changed isAuthenticated to false, currentUser to null, added adminCredentials constant, changed login to (email, password) => boolean
  - page.tsx: Added LoginScreen component with email/password fields, loading state, error display, Zaxo branding
- TASK 4: Created essential pages
  - Created AboutUs.tsx: Mission statement, features (E2E encryption, HD calls, cross-platform, privacy-first), stats, company details, zaxo.eu.cc domain
  - Created ContactUs.tsx: Contact form (Name, Email, Subject, Message), support@zaxo.eu.cc, social links
  - Created TermsAndConditions.tsx: 10 sections covering acceptance, accounts, acceptable use, privacy, IP, termination, disclaimers, liability, changes, contact
  - Created PrivacyPolicy.tsx: 10 sections covering info collection, usage, sharing, storage/security, rights, cookies, third-party, children's, changes, contact
  - stores/index.ts: Added 'about-us' | 'contact-us' | 'terms' | 'privacy-policy' to overlay union type
  - page.tsx: Added overlay cases for all 4 new pages
  - SettingsView.tsx: Updated HelpSettings with links to About Us, Contact Us, Terms & Conditions, Privacy Policy
  - ProfileView.tsx: Added Legal section with Terms & Privacy Policy links, replaced Zap icons with Globe
- TASK 5: Added incoming/outgoing call logic
  - stores/index.ts: Added direction field to activeCall, added incomingCall/setIncomingCall/addCallToHistory to CallStore
  - ChatView.tsx: Added direction: 'outgoing' to handleStartCall and handleStartGroupCall
  - CallHistory.tsx: Added direction: 'outgoing' to handleCallBack and handleStartNewCall
  - CallScreen.tsx: Added call recording to history on end call and decline call, set callStartTime on connected, imported useAuthStore
- TASK 6: Fixed all build errors
  - Fixed lint error (setState in effect) by removing the problematic useEffect
  - Build succeeds with no errors
  - Lint passes with no errors

Stage Summary:
- All 6 tasks completed successfully
- Build passes, lint passes, dev server running on port 3000
- Login screen requires email: eunus527@gmail.com / password: RAna22@@
- All new pages accessible from Settings > Help & Support and Profile > Legal
